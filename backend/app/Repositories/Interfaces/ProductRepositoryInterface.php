<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface
{
    public function getAll(int $page = 1, int $perPage = 9);
    public function findById(string $id);
    public function findBySlug(string $slug);
    public function findByCategorySlug(string $categorySlug, int $page, int $perPage = 15);
    public function findByCategoryName(string $categoryName, int $perPage = 15);
    public function findByParentCategory(string $parentName, int $perPage = 15);
    public function filter(array $filters,int $current, int $perPage = 15);
    public function search(string $keyword, int $page = 1, int $perPage = 12);
    public function getFeatured(int $limit = 10);
    public function getNew(int $limit = 10);
    public function getBestseller(int $limit = 10);
    public function getAllCategories();
    public function getAllDressStyles();
    public function getAllBrands();
    public function getRelatedProducts(string $productId, string $categorySlug, int $limit = 6);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function forceDelete(string $id);
    public function updateStock(string $id, int $quantity);
    public function decreaseStock(string $id, int $quantity);
    public function increaseStock(string $id, int $quantity);

    /**
     * Kiểm tra sản phẩm có còn hàng không
     */
    public function isInStock(string $id, int $quantity = 1);

    /**
     * Lấy sản phẩm theo khoảng giá
     */
    public function getByPriceRange(int $minPrice, int $maxPrice, int $perPage = 15);
}