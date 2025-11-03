<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\RegistroDiarioController;
use App\Http\Controllers\HabitoController;
use App\Http\Controllers\RegistroHabitoController;
use App\Models\RegistroDiario;
use App\Http\Controllers\EventoController;
use Illuminate\Support\Facades\Http;

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

use Illuminate\Http\Request;

Route::get('/usuario-soap/{email}', function ($email) {
    $options = [
        'location' => 'http://localhost/soap-server.php',
'uri' => 'http://localhost/soap-server.php'

    ];

    try {
        $client = new SoapClient(null, $options);
        $result = $client->obtenerUsuarioPorEmail($email);
        return response()->json($result);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

//Route::post('/logout', [AuthController::class, 'logout']);

//Route::post('/nota', [NotaController::class, 'store']);

//Route::get('/nota/{idUsuario}', [NotaController::class, 'index']);


 Route::get('/afirmacion', [App\Http\Controllers\Api\AfirmacionController::class, 'obtener']);

 Route::get('/eventos-google', function () {
    // Calendario público mundial de feriados de Google (formato ICS)
    $url = "https://www.calendarlabs.com/ical-calendar/ics/75/Argentina_Holidays.ics";


    try {
        $response = Http::withHeaders([
            'Accept' => 'text/calendar'
        ])->get($url);

        if ($response->failed() || empty($response->body())) {
            return response()->json([
                'error' => 'Error al obtener datos del calendario',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 500);
        }

        $contenido = $response->body();
        $eventos = [];

        // 🔍 Buscar nombre (SUMMARY) y fecha (DTSTART)
        preg_match_all('/SUMMARY:(.*)\r?\nDTSTART.*:(\d{8})/', $contenido, $matches, PREG_SET_ORDER);

        foreach ($matches as $m) {
            $fecha = substr($m[2], 0, 4) . '-' . substr($m[2], 4, 2) . '-' . substr($m[2], 6, 2);
            $eventos[] = [
                'summary' => trim($m[1]),
                'start' => ['date' => $fecha]
            ];
        }

        return response()->json(['items' => $eventos]);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

 
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

        Route::get('/registro-diario/ultimo', [RegistroDiarioController::class, 'ultimo']);

       Route::get('/eventos', [EventoController::class, 'index']);
        Route::post('/eventos', [EventoController::class, 'store']);
        Route::put('/eventos/{id}', [EventoController::class, 'update']);
        Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    }
);

