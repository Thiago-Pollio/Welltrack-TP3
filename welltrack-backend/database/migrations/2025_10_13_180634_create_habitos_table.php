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
        Schema::create('habitos', function (Blueprint $table) {
            $table->id('idHabito');
            $table->unsignedBigInteger('idUsuario');
            $table->string('nombre', 120);
            $table->text('descripcion')->nullable();
            $table->enum('frecuencia', ['diario','semanal','mensual'])->default('diario');
            $table->integer('meta')->nullable();        
            $table->string('unidad', 30)->nullable();  
            $table->enum('estado', ['activo','archivado'])->default('activo');
            $table->integer('rachaActual')->default(0);
            $table->integer('rachaMaxima')->default(0);
            $table->date('fechaUltimoRegistro')->nullable();
            $table->timestamps();

                $table->foreign('idUsuario')
            ->references('idUsuario')
            ->on('usuarios')
            ->onDelete('cascade');
        });

     
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habitos');
    }
};
