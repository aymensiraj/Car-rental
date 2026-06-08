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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); 
            
            $table->string('brand');          
            $table->string('model');         
            $table->string('image');          
            $table->integer('price_per_day'); 
            
            $table->enum('category', ['economique', 'suv', 'luxe', 'electrique']);
            $table->integer('seats')->default(5);                       
            $table->enum('transmission', ['manual', 'automatic']);     
            $table->enum('fuel_type', ['essence', 'diesel', 'electric']); 
            
            $table->string('city');        
            $table->string('agency_name');  
            $table->double('rating', 2, 1)->default(5.0); 
            $table->boolean('is_available')->default(true); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
