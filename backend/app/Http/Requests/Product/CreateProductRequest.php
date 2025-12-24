<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseRequest;
use Illuminate\Support\Str;

class CreateProductRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            // Basic info
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            
            // Category (Embedded object - optional)
            'category' => 'nullable|array',
            'category.name' => 'nullable|string|max:255',
            
            // Brand (Embedded object - optional)
            'brand' => 'nullable|array',
            'brand.name' => 'nullable|string|max:255',
            
            // Pricing
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0|gte:price',
            
            // Images (Array of base64 strings or URLs)
            'images' => 'nullable|array',
            'images.*' => 'file|image|mimes:jpeg,png,jpg,webp,gif|max:5120', 
            
            // Variants (Array of objects)
            'variants' => 'required|array|min:1',
            'variants.*.size' => 'required|string|max:50',
            'variants.*.color' => 'required|string|max:50',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price' => 'required|numeric|min:0',
            
            // Product details
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'material' => 'nullable|string|max:255',
            'care_instructions' => 'nullable|string',
            
            // Dimensions (Embedded object)
            'dimensions' => 'nullable|array',
            'dimensions.length' => 'nullable|string|max:50',
            'dimensions.chest' => 'nullable|string|max:50',
            'dimensions.shoulder' => 'nullable|string|max:50',
            
            // Dress Style (Embedded object)
            'dressStyle' => 'nullable|array',
            'dressStyle.name' => 'nullable|string|max:100',
            'dressStyle.slug' => 'nullable|string|max:100',
            
            // Status
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',   
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc',
            'slug.unique' => 'Slug đã tồn tại',
            'price.required' => 'Giá sản phẩm là bắt buộc',
            'price.min' => 'Giá phải lớn hơn hoặc bằng 0',
            'compare_price.gte' => 'Giá so sánh phải lớn hơn hoặc bằng giá bán',
            'variants.required' => 'Phải có ít nhất 1 biến thể',
            'variants.min' => 'Phải có ít nhất 1 biến thể',
            'images.*.image' => 'File phải là ảnh',
            'images.*.mimes' => 'Ảnh phải có định dạng: jpeg, png, jpg, webp, gif',
            'images.*.max' => 'Kích thước ảnh tối đa 5MB',
        ];
    }

    protected function prepareForValidation()
    {
        // Parse nested objects từ FormData
        if (is_string($this->category)) {
            $this->merge(['category' => json_decode($this->category, true)]);
        }
        
        if (is_string($this->brand)) {
            $this->merge(['brand' => json_decode($this->brand, true)]);
        }
        
        if (is_string($this->dressStyle)) {
            $this->merge(['dressStyle' => json_decode($this->dressStyle, true)]);
        }
        
        if (is_string($this->dimensions)) {
            $this->merge(['dimensions' => json_decode($this->dimensions, true)]);
        }
        
        if (is_string($this->variants)) {
            $this->merge(['variants' => json_decode($this->variants, true)]);
        }
        
        if ($this->variants && is_array($this->variants)) {
            $variants = array_map(function($variant) {
                return [
                    'size' => $variant['size'] ?? '',
                    'color' => $variant['color'] ?? '',
                    'stock' => isset($variant['stock']) ? (int) $variant['stock'] : 0,
                    'price' => isset($variant['price']) ? (float) $variant['price'] : 0,
                ];
            }, $this->variants);
            
            $this->merge(['variants' => $variants]);
        }
        
        // Cast số về đúng kiểu
        $this->merge([
            'price' => $this->price ? (float) $this->price : 0,
            'compare_price' => $this->compare_price ? (float) $this->compare_price : null,
        ]);
        
        // Auto generate slug
        if (!$this->slug && $this->name) {
            $this->merge(['slug' => $this->generateUniqueSlug($this->name)]);
        }

        // Set default values
        $this->merge([
            'is_active' => $this->convertToBoolean($this->is_active ?? true),
            'is_featured' => $this->convertToBoolean($this->is_featured ?? false),
        ]);

        // Process nested objects with auto slug
        $this->processNestedObject('category');
        $this->processNestedObject('brand');
        $this->processNestedObject('dressStyle');

        // Clean dimensions if all values are empty
        if ($this->dimensions && is_array($this->dimensions)) {
            $hasValue = !empty($this->dimensions['length']) || 
                    !empty($this->dimensions['chest']) || 
                    !empty($this->dimensions['shoulder']);
            
            if (!$hasValue) {
                $this->merge(['dimensions' => null]);
            }
        }
    }

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;
        
        while (\App\Models\Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }
        
        return $slug;
    }

    private function processNestedObject(string $field): void
    {
        $data = $this->input($field);
        
        if (!$data || (is_array($data) && empty($data['name']))) {
            $this->merge([$field => null]);
            return;
        }
        
        // Auto-generate slug if not provided
        if (is_array($data) && empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        
        $this->merge([$field => $data]);
    }

    private function convertToBoolean($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        
        if (is_string($value)) {
            return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
        }
        
        return (bool) $value;
    }

    
}