<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('registro_diarios', function (Blueprint $table) {
            // cambiamos tipo de integer a string para guardar texto o emojis
            $table->string('energiaNivel', 50)->nullable()->change();
            $table->string('vidaSocial', 50)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('registro_diarios', function (Blueprint $table) {
            // revertimos a integer si se necesita volver atrás
            $table->integer('energiaNivel')->nullable()->change();
            $table->integer('vidaSocial')->nullable()->change();
        });
    }
};