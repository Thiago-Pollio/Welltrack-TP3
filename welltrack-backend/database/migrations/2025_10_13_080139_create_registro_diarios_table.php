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
        Schema::create('registro_diarios', function (Blueprint $table) {
            $table->id('idRegistro');
            $table->unsignedBigInteger('idUsuario');
            $table->date('fecha');
            $table->string('estadoAnimo');
            $table->string('mente')->nullable();
            $table->integer('energiaNivel')->nullable();
            $table->decimal('horasSueño', 4, 2)->nullable();
            $table->integer('vidaSocial')->nullable();
            $table->integer('aguaTomada')->nullable();
            $table->integer('estresNivel')->nullable();
            $table->text('notaOpcional')->nullable();
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
        Schema::dropIfExists('registro_diarios');
    }
};
