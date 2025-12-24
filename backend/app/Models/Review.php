<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Review extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'reviews';
    protected $primaryKey = '_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'product_id',      // ObjectId
        'order_id',
        'user_id',         // ObjectId
        'rating',          // int
        'content',         // string
        'images',          // array
    ];

    protected $casts = [
        'product_id' => 'string',
        'order_id'   => 'string',
        'user_id'    => 'string',
        'images'     => 'array',
        'rating'     => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    /**
     * Quan hệ: Review thuộc về 1 Product
     */
    public function product()
    {
        return $this->belongsTo(Product::class, '_id', 'product_id');
    }

    /**
     * Quan hệ: Review thuộc về 1 User (nếu có model User)
     */
    public function user()
    {
        return $this->belongsTo(User::class, '_id', 'user_id');
    }
}
