<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
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
            
            // 🔥 FIX: Images - Format từ relationship
            'images' => $this->formatImages(),
            'main_image' => $this->getMainImage(),
            'thumbnail' => $this->getThumbnail(),
            
            // 🔥 FIX: Variants - Format từ relationship
            'variants' => $this->formatVariants(),
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

    // 🔥 NEW: Format images từ relationship
    private function formatImages(): array
    {
        // Nếu images là relationship Collection từ MySQL
        if ($this->relationLoaded('images')) {
            return $this->images->pluck('image_url')->toArray();
        }

        // Fallback: nếu images là JSON array
        if (is_array($this->images)) {
            return collect($this->images)->map(function ($image) {
                if (is_string($image)) {
                    return $image;
                }
                return $image['url'] ?? $image['image_url'] ?? null;
            })->filter()->values()->toArray();
        }

        return [];
    }

    private function getMainImage(): ?string
    {
        // 🔥 FIX: Lấy ảnh primary từ relationship
        if ($this->relationLoaded('images')) {
            $primaryImage = $this->images->where('is_primary', 1)->first();
            if ($primaryImage) {
                return $primaryImage->image_url;
            }
            // Nếu không có primary, lấy ảnh đầu tiên
            return $this->images->first()?->image_url;
        }

        // Fallback: JSON format
        $images = $this->formatImages();
        return $images[0] ?? null;
    }

    private function getThumbnail(): ?string
    {
        return $this->getMainImage();
    }

    // 🔥 NEW: Format variants từ relationship
    private function formatVariants(): array
    {
        // Nếu variants là relationship Collection từ MySQL
        if ($this->relationLoaded('variants')) {
            return $this->variants->map(function ($variant) {
                return [
                    'id' => (string) $variant->id,
                    'size' => $variant->size,
                    'color' => $variant->color,
                    'color_code' => $variant->color_code ?? null,
                    'stock' => $variant->stock ?? 0,
                    'price' => $variant->price ?? $this->price,
                ];
            })->toArray();
        }

        // Fallback: JSON format
        if (is_array($this->variants)) {
            return collect($this->variants)->map(function ($variant) {
                return [
                    'id' => (string) ($variant['id'] ?? ''),
                    'size' => $variant['size'] ?? '',
                    'color' => $variant['color'] ?? '',
                    'color_code' => $variant['color_code'] ?? null,
                    'stock' => $variant['stock'] ?? 0,
                    'price' => $variant['price'] ?? $this->price,
                ];
            })->toArray();
        }

        return [];
    }

    private function getAvailableSizes(): array
    {
        $variants = $this->formatVariants();
        
        if (empty($variants)) {
            return [];
        }

        return collect($variants)
            ->pluck('size')
            ->unique()
            ->values()
            ->toArray();
    }

    private function getAvailableColors(): array
    {
        $variants = $this->formatVariants();
        
        if (empty($variants)) {
            return [];
        }

        return collect($variants)
            ->map(function ($variant) {
                return [
                    'name' => $variant['color'],
                    'code' => $variant['color_code'] ?? null,
                ];
            })
            ->unique('name')
            ->values()
            ->toArray();
    }
}