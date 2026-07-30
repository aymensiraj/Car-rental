<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    // 📝 تحديد الحقول المسموح بكتابتها ف الـ Base de données
    protected $fillable = [
        'user_id',
        'brand',
        'model',
        'image',
        'price_per_day',
        'category',
        'seats',
        'transmission',
        'fuel_type',
        'city',
        'agency_name',
        'rating',
        'is_available',
        'year'
    ];

    /**
     * 🔗 العلاقة: السيارة تنتمي إلى مستخدم (وكالة)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
}