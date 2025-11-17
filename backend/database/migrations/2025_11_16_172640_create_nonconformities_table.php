<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nonconformities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('barcode');
            $table->string('type_code');
            $table->integer('quantity');
            $table->string('unit', 10);
            $table->string('comment', 500)->nullable();
            $table->string('created_by');
            $table->boolean('disabled')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nonconformities');
    }
};
