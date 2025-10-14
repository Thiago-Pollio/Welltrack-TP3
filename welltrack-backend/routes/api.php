<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\RegistroDiarioController;
use App\Http\Controllers\HabitoController;
use App\Http\Controllers\RegistroHabitoController;
use App\Models\RegistroDiario;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

//Route::post('/logout', [AuthController::class, 'logout']);

//Route::post('/nota', [NotaController::class, 'store']);

//Route::get('/nota/{idUsuario}', [NotaController::class, 'index']);

Route::middleware('auth:sanctum')->group(
    function () {
        Route::post('/nota', [NotaController::class, 'store']);
        Route::get('/nota', [NotaController::class, 'index']);
        Route::patch('/nota/{id}/destacar', [NotaController::class, 'destacar']);
        Route::patch('/nota/{id}/archivar', [NotaController::class, 'archivar']);
        Route::patch('/nota/{id}/restaurar', [NotaController::class, 'restaurar']);
        Route::delete('/nota/{id}', [NotaController::class, 'destroy']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::post('/registro-diario', [RegistroDiarioController::class, 'store']);
        Route::get('/registro-diario', [RegistroDiarioController::class, 'index']);
        
        Route::post('/habitos', [HabitoController::class, 'store']);
        Route::get('/habitos', [HabitoController::class, 'index']);
        Route::delete('/habitos/{id}', [HabitoController::class, 'destroy']);

        Route::post('/registro-habito', [RegistroHabitoController::class, 'store']);
        Route::get('/registro-habito/{idHabito}', [RegistroHabitoController::class, 'index']);
    }
);

