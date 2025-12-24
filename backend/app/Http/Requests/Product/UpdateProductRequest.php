<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UpdateProductRequest extends BaseRequest
{
    public function rules(): array
    {
        // Lấy ID từ route parameter
        $productId = $this->route('id');

        return [
            // ===== THÔNG TIN CƠ BẢN =====
            'name' => 'sometimes|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($productId, '_id')
            ],
            'description' => 'sometimes|nullable|string',
            
            // ===== CATEGORY (Embedded Object) =====
            'category' => 'sometimes|nullable|array',
            'category.name' => 'sometimes|string|max:255',
            'category.slug' => 'sometimes|string|max:255',
            
            // ===== BRAND (Embedded Object) =====
            'brand' => 'sometimes|nullable|array',
            'brand.name' => 'sometimes|string|max:255',
            'brand.slug' => 'sometimes|string|max:255',
            
            // ===== GIÁ =====
            'price' => 'sometimes|numeric|min:0',
            'compare_price' => 'sometimes|nullable|numeric|min:0',
            
            // ===== HÌNH ẢNH (Array of strings) =====
            'images' => 'sometimes|nullable|array',
            'images.*' => 'url',
            
            // ===== BIẾN THỂ (Array of objects) =====
            'variants' => 'sometimes|nullable|array',
            'variants.*.size' => 'required|string|max:50',
            'variants.*.color' => 'required|string|max:50',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.price' => 'required|numeric|min:0',
            
            // ===== CHI TIẾT SẢN PHẨM =====
            'tags' => 'sometimes|nullable|array',
            'tags.*' => 'string|max:50',
            'material' => 'sometimes|nullable|string|max:255',
            'care_instructions' => 'sometimes|nullable|string',
            
            // ===== KÍCH THƯỚC (Dimensions - cho phép string) =====
            // Dựa theo data: waist, length, legOpening, chest, shoulder
            'dimensions' => 'sometimes|nullable|array',
            'dimensions.length' => 'sometimes|nullable|string|max:50',
            'dimensions.chest' => 'sometimes|nullable|string|max:50',
            'dimensions.shoulder' => 'sometimes|nullable|string|max:50',
            'dimensions.waist' => 'sometimes|nullable|string|max:50',
            'dimensions.legOpening' => 'sometimes|nullable|string|max:50',
            
            // ===== DRESS STYLE (Embedded Object) =====
            'dressStyle' => 'sometimes|nullable|array',
            'dressStyle.name' => 'sometimes|string|max:255',
            'dressStyle.slug' => 'sometimes|string|max:255',
            
            // ===== TRẠNG THÁI =====
            'is_featured' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
            'is_new' => 'sometimes|nullable|boolean',
            'is_bestseller' => 'sometimes|nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            // Basic
            'name.string' => 'Tên sản phẩm phải là chuỗi ký tự',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự',
            'slug.unique' => 'Slug đã tồn tại, vui lòng chọn slug khác',
            
            // Price
            'price.numeric' => 'Giá phải là số',
            'price.min' => 'Giá phải lớn hơn hoặc bằng 0',
            'compare_price.numeric' => 'Giá so sánh phải là số',
            'compare_price.min' => 'Giá so sánh phải lớn hơn hoặc bằng 0',
            
            // Images
            'images.array' => 'Hình ảnh phải là một mảng',
            'images.*.url' => 'URL hình ảnh không hợp lệ',
            
            // Variants
            'variants.array' => 'Biến thể phải là một mảng',
            'variants.*.size.required' => 'Kích thước biến thể là bắt buộc',
            'variants.*.color.required' => 'Màu sắc biến thể là bắt buộc',
            'variants.*.stock.required' => 'Số lượng tồn kho là bắt buộc',
            'variants.*.stock.integer' => 'Số lượng tồn kho phải là số nguyên',
            'variants.*.stock.min' => 'Số lượng tồn kho phải lớn hơn hoặc bằng 0',
            'variants.*.price.required' => 'Giá biến thể là bắt buộc',
            'variants.*.price.numeric' => 'Giá biến thể phải là số',
            'variants.*.price.min' => 'Giá biến thể phải lớn hơn hoặc bằng 0',
            
            // Tags
            'tags.array' => 'Tags phải là một mảng',
            'tags.*.string' => 'Mỗi tag phải là chuỗi ký tự',
            'tags.*.max' => 'Mỗi tag không được vượt quá 50 ký tự',
            
            // Category
            'category.name.string' => 'Tên danh mục phải là chuỗi ký tự',
            'category.slug.string' => 'Slug danh mục phải là chuỗi ký tự',
            
            // Brand
            'brand.name.string' => 'Tên thương hiệu phải là chuỗi ký tự',
            'brand.slug.string' => 'Slug thương hiệu phải là chuỗi ký tự',
            
            // DressStyle
            'dressStyle.name.string' => 'Tên phong cách phải là chuỗi ký tự',
            'dressStyle.slug.string' => 'Slug phong cách phải là chuỗi ký tự',
        ];
    }

    protected function prepareForValidation()
    {
        // Auto-generate slug từ name nếu name được update nhưng không có slug
        if ($this->has('name') && !$this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->name)
            ]);
        }
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'tên sản phẩm',
            'slug' => 'đường dẫn',
            'description' => 'mô tả',
            'price' => 'giá bán',
            'compare_price' => 'giá so sánh',
            'material' => 'chất liệu',
            'care_instructions' => 'hướng dẫn bảo quản',
            'category.name' => 'tên danh mục',
            'brand.name' => 'tên thương hiệu',
            'dressStyle.name' => 'tên phong cách',
            'is_featured' => 'sản phẩm nổi bật',
            'is_active' => 'trạng thái kích hoạt',
        ];
    }
}