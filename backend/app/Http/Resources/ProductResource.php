<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->_id ?? $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            
            // Category (Embedded)
            'category' => [
                'name' => $this->category['name'] ?? null,
                'slug' => $this->category['slug'] ?? null,
                'parent' => $this->category['parent'] ?? null,
            ],
            
            // Brand (Embedded)
            'brand' => [
                'name' => $this->brand['name'] ?? null,
                'slug' => $this->brand['slug'] ?? null,
                'country' => $this->brand['country'] ?? null,
                'logo' => $this->brand['logo'] ?? null,
            ],
            
            // Pricing
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'formatted_price' => number_format($this->price, 0, ',', '.') . ' ₫',
            'formatted_compare_price' => $this->compare_price 
                ? number_format($this->compare_price, 0, ',', '.') . ' ₫' 
                : null,
            'discount_percentage' => $this->getDiscountPercentage(),
            'on_sale' => $this->compare_price && $this->compare_price > $this->price,
            
            // Inventory
            'sku' => $this->sku,
            'barcode' => $this->barcode,
            'stock' => $this->stock ?? 0,
            'in_stock' => ($this->stock ?? 0) > 0,
            
            // Images (Array)
            'images' => $this->images ?? [],
            'main_image' => $this->getMainImage(),
            'thumbnail' => $this->getThumbnail(),
            
            // Variants (Array)
            'variants' => $this->variants ?? [],
            'dressStyle' => $this->dressStyle ?? null,
            'available_sizes' => $this->getAvailableSizes(),
            'available_colors' => $this->getAvailableColors(),
            
            // Product details
            'tags' => $this->tags ?? [],
            'material' => $this->material,
            'care_instructions' => $this->care_instructions,
            
            // Dimensions
            'weight' => $this->weight,
            'dimensions' => $this->dimensions ?? null,
            
            // SEO (Hidden by default, show when requested)
            $this->mergeWhen($request->input('include_seo'), [
                'meta_title' => $this->meta_title,
                'meta_description' => $this->meta_description,
                'meta_keywords' => $this->meta_keywords ?? [],
            ]),
            
            // Status
            'is_featured' => (bool) ($this->is_featured ?? false),
            'is_active' => (bool) ($this->is_active ?? true),
            'is_new' => (bool) ($this->is_new ?? false),
            'is_bestseller' => (bool) ($this->is_bestseller ?? false),
            
            // Statistics (Embedded)
            'stats' => [
                'rating_average' => $this->stats['rating_average'] ?? 0,
                'rating_count' => $this->stats['rating_count'] ?? 0,
                'review_count' => $this->stats['review_count'] ?? 0,
                'sold_count' => $this->stats['sold_count'] ?? 0,
                'view_count' => $this->stats['view_count'] ?? 0,
                'wishlist_count' => $this->stats['wishlist_count'] ?? 0,
            ],
            
            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    // Helper methods
    private function getDiscountPercentage(): int
    {
        if (!$this->compare_price || $this->compare_price <= $this->price) {
            return 0;
        }
        return (int) round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    private function getMainImage(): ?string
    {
        if (empty($this->images)) {
            return null;
        }

        // Find primary image
        foreach ($this->images as $image) {
            if (isset($image['is_primary']) && $image['is_primary']) {
                return $image['url'] ?? null;
            }
        }

        // Return first image if no primary
        return $this->images[0]['url'] ?? null;
    }

    private function getThumbnail(): ?string
    {
        // Same as main image for now, can add thumbnail logic later
        return $this->getMainImage();
    }

    private function getAvailableSizes(): array
    {
        if (empty($this->variants)) {
            return [];
        }

        $sizes = [];
        foreach ($this->variants as $variant) {
            if (!in_array($variant['size'], $sizes)) {
                $sizes[] = $variant['size'];
            }
        }

        return $sizes;
    }

    private function getAvailableColors(): array
    {
        if (empty($this->variants)) {
            return [];
        }

        $colors = [];
        foreach ($this->variants as $variant) {
            $colorKey = $variant['color'];
            if (!isset($colors[$colorKey])) {
                $colors[$colorKey] = [
                    'name' => $variant['color'],
                    'code' => $variant['color_code'] ?? null,
                ];
            }
        }

        return array_values($colors);
    }
}