<?php

namespace App\Http\Controllers;

use App\Models\RegistroDiario;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RegistroDiarioController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'fecha' => 'required|date',
        'estadoAnimo' => 'string|max:50',
        'mente' => 'nullable|string|max:50',
        'energiaNivel' => 'nullable|string|max:50',
        'horasSueño' => 'nullable|numeric|min:0|max:24',
        'vidaSocial' => 'nullable|string|max:50',
        'aguaTomada' => 'nullable|numeric|min:0|max:5000',
        'estresNivel' => 'nullable|integer|min:1|max:10',
        'notaOpcional' => 'nullable|string|max:500',
    ]);

    $user = $request->user();

    $registro = RegistroDiario::updateOrCreate(
        [
            'idUsuario' => $user->idUsuario,
            'fecha' => $validated['fecha'],
        ],
        $validated
    );

    return response()->json([
        'mensaje' => 'Registro diario guardado con éxito',
        'registro' => $registro
    ], Response::HTTP_CREATED);
}


        public function index(Request $request)
    {
        $user = $request->user();

            $registros = RegistroDiario::where('idUsuario', $user->idUsuario)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'mensaje' => 'Registros obtenidos con éxito',
            'registros' => $registros
        ], 200);
    }

    public function ultimo(Request $request)
{
    $user = $request->user();

    $registro = RegistroDiario::where('idUsuario', $user->idUsuario)
        ->orderBy('fecha', 'desc')
        ->first();

    if (!$registro) {
        return response()->json([
            'mensaje' => 'No hay registros todavía'
        ], 404);
    }

    return response()->json([
        'mensaje' => 'Último registro obtenido con éxito',
        'registro' => $registro
    ], 200);
}
}
