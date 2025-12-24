<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Discount extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'discounts';
    protected $primaryKey = '_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',             // Mã giảm giá, ví dụ: SALE50
        'description',      // Mô tả mã
        'type',             // percent | fixed
        'value',            // Giá trị giảm (VD: 10% hoặc 20000 vnđ)
        'min_order_value',  // Giá trị đơn tối thiểu để áp dụng
        'max_discount',     // Mức giảm tối đa áp dụng (nếu type = percent)
        'usage_limit',      // Số lần được phép dùng tổng cộng
        'used',             // Số lần đã dùng
        'start_date',       // ISODate hoặc string datetime
        'end_date',         // ISODate hoặc string datetime
        'is_active',        // true / false
    ];
}
