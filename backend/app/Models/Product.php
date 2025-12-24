<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';
    protected $primaryKey = '_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',        // Object
        'brand',           // Object
        'price',
        'compare_price',
        'cost_price',
        'sku',
        'barcode',
        'stock',
        'images',          // Array of objects
        'variants',        // Array of objects
        'tags',
        'material',
        'care_instructions',
        'weight',
        'dimensions',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'is_featured',
        'is_active',
        'is_new',
        'is_bestseller',
        'stats',           // Object with rating, views, etc
    ];


}