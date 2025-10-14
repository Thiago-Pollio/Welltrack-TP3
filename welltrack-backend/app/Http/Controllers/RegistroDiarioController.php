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
            'energiaNivel' => 'nullable|integer|min:1|max:10',
            'horasSueño' => 'nullable|numeric|min:0|max:24',
            'vidaSocial' => 'nullable|integer|min:1|max:10',
            'aguaTomada' => 'nullable|numeric|min:0|max:5000',
            'estresNivel' => 'nullable|integer|min:1|max:10',
            'notaOpcional' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        $existe = RegistroDiario::where('idUsuario', $user->idUsuario)
        ->where('fecha', $validated['fecha'])
        ->first();

        if ($existe) {
            return response()->json([
                'mensaje' => 'Ya existe un registro para esa fecha.'
            ], 400);
        }


        $registro = RegistroDiario::create([
            'idUsuario' => $user->idUsuario,
            ...$validated,
        ]);

        return response()->json([
            'mensaje' => 'Registro diario creado con exito',
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
}
