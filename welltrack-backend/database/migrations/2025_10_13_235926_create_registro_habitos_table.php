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
        Schema::create('registro_habitos', function (Blueprint $table) {
            $table->id('idRegistroHabito');
            $table->unsignedBigInteger('idHabito');
            $table->unsignedBigInteger('idUsuario');
            $table->date('fecha');
            $table->decimal('cantidadRealizada', 8, 2)->nullable();
            $table->boolean('cumplido')->default(false);
            $table->string('comentario', 500)->nullable();
            $table->timestamps();

            $table->foreign('idHabito')
            ->references('idHabito')
            ->on('habitos')
            ->onDelete('cascade');

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
        Schema::dropIfExists('registro_habitos');
    }
};
