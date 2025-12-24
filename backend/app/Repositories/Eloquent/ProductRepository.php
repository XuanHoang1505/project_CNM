<?php

namespace App\Repositories\Eloquent;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    public function getAll(int $page = 1, int $perPage = 15)
    {
        return Product::paginate($perPage, ['*'], 'page', $page);
    }

    public function findById(string $id)
    {
        return Product::find($id);
    }

    public function findBySlug(string $slug)
    {
        $product = Product::where('slug', $slug)->first();

        if (!$product) {
            return response()->json([
                'message' => 'Sản phẩm không tồn tại'
            ], 404);
        }

        // Trả về Resource chỉ khi $product tồn tại
        return new ProductResource($product);

    }

    public function findByCategorySlug(string $categorySlug, int $page = 1, int $perPage = 15)
    {
        
        return Product::where('category.slug', $categorySlug)
            ->where('is_active', true)
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function findByCategoryName(string $categoryName, int $perPage = 15)
    {
        return Product::where('category.name', $categoryName)
            ->where('is_active', true)
            ->paginate($perPage);
    }

    public function findByParentCategory(string $parentName, int $perPage = 15)
    {
        return Product::where('category.parent', $parentName)
            ->where('is_active', true)
            ->paginate($perPage);
    }

    public function search(string $keyword, int $page = 1, int $perPage = 12)
    {
        if (empty(trim($keyword))) {
            return Product::where('is_active', true)
                ->paginate($perPage, ['*'], 'page', $page);
        }

        $query = Product::where('is_active', true)
            ->where(function($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                ->orWhere('description', 'like', "%{$keyword}%")
                ->orWhere('slug', 'like', "%{$keyword}%")
                ->orWhere('category.name', 'like', "%{$keyword}%")
                ->orWhere('brand.name', 'like', "%{$keyword}%");
            })
            ->orderBy('created_at', 'desc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function filter(array $filters,int $current, int $perPage = 9)
    {
        $query = Product::where('is_active', true);

        if (isset($filters['categories'])) {
            $query->whereIn('category.slug', $filters['categories']);
        }

        if (isset($filters['minPrice']) || isset($filters['maxPrice'])) {
            $minPrice = $filters['minPrice'] ?? 0;
            $maxPrice = $filters['maxPrice'] ?? PHP_INT_MAX;
            $query->whereBetween('price', [$minPrice, $maxPrice]);
        }

        if (isset($filters['colors'])) {
            $query->whereIn('variants.color', $filters['colors']);
        }

        if(isset($filters['sizes'])) {
            $query->whereIn('variants.size', $filters['sizes']);
        }

        if(isset($filters['dressStyles'])) {
            $query->whereIn('dressStyle.slug', $filters['dressStyles']);
        }

        return $query->paginate($perPage, ['*'], 'page', $current);
    }

    public function getFeatured(int $limit = 4)
    {
        return Product::where('is_featured', true)
            ->where('is_active', true)
            ->limit($limit)
            ->get();
    }

    public function getNew(int $limit = 4)
    {
        // Sắp xếp theo created_at mới nhất
        return Product::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getBestseller(int $limit = 4)
    {
        // Lấy sản phẩm featured hoặc sản phẩm có giá compare_price cao
        // (sản phẩm giảm giá thường bán chạy)
        return Product::where('is_active', true)
            ->where(function($query) {
                $query->where('is_featured', true)
                    ->orWhereNotNull('compare_price');
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getAllCategories()
    {
        return Product::raw(function($collection) {
            return $collection->distinct('category');
        });
    }

    public function getAllDressStyles()
    {
        return Product::raw(function($collection) {
            return $collection->distinct('dressStyle');
        });
    }

    public function getAllBrands()
    {
        return Product::raw(function($collection) {
            return $collection->distinct('brand');
        });
    }

    public function getRelatedProducts(string $productId, string $categorySlug, int $limit = 6)
    {
        return Product::where('category.slug', $categorySlug)
            ->where('_id', '!=', $productId)
            ->where('is_active', true)
            ->limit($limit)
            ->get();
    }

    public function create(array $data)
    {
        return Product::create($data);
    }

    public function update(string $id, array $data): Product|bool
    {
        $product = Product::find($id);
        
        if (!$product) {
            return false;
        }

        // Update the product
        $product->update($data);
        
        // Refresh to get the latest data from database
        $product->refresh();
        
        // Return the updated product instance
        return $product;
    }

    public function delete(string $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return false;
        }

        return $product->update(['is_active' => false]);
    }

    public function forceDelete(string $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return false;
        }

        return $product->delete();
    }

    public function updateStock(string $id, int $quantity)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return false;
        }

        return $product->update(['stock' => $quantity]);
    }

    public function decreaseStock(string $id, int $quantity)
    {
        $product = Product::find($id);
        
        if (!$product || $product->stock < $quantity) {
            return false;
        }

        return $product->decrement('stock', $quantity);
    }

    public function increaseStock(string $id, int $quantity)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return false;
        }

        return $product->increment('stock', $quantity);
    }

    public function isInStock(string $id, int $quantity = 1)
    {
        $product = Product::find($id);
        
        return $product && $product->stock >= $quantity;
    }

    public function getByPriceRange(int $minPrice, int $maxPrice, int $perPage = 15)
    {
        return Product::where('price', '>=', $minPrice)
            ->where('price', '<=', $maxPrice)
            ->where('is_active', true)
            ->paginate($perPage);
    }
}
