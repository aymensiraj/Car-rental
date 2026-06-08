<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class UserProfile extends Model
{
    protected $table = 'user_profiles';
    protected $fillable = ['user_id', 'phone', 'city', 'address', 'logo'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
