<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agency_profiles', function (Blueprint $table) {
            $table->id();
            // الربط مع جدول الـ users (إيلا تمسح المستخدم كيتمسح البروفايل ديالو تلقائياً)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // المعلومات الزايدة د الوكالة
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('logo')->nullable(); // مسار اللوݣو ف الـ Storage
            $table->text('description')->nullable();
            $table->string('address')->nullable(); // العنوان د المقر
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_profiles');
    }
};
