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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
            
            $table->date('start_date');       
            $table->date('end_date');         
            $table->integer('total_days');   
            $table->integer('total_price');   
            
           
            $table->enum('status', ['en_attente', 'accepte', 'refuse'])->default('en_attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
