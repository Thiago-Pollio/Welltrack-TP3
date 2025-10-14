<?php

namespace App\Http\Controllers;

use App\Models\Habito;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HabitoController extends Controller
{
        public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:120',
            'descripcion' => 'nullable|string',
            'frecuencia' => 'required|in:diario,semanal,mensual',
            'meta' => 'nullable|integer|min:1',
            'unidad' => 'nullable|string|max:30',
        ]);

        $user = $request->user();

        $habito = Habito::create([
            'idUsuario' => $user->idUsuario,
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'frecuencia' => $validated['frecuencia'],
            'meta' => $validated['meta'] ?? null,
            'unidad' => $validated['unidad'] ?? null,
            'estado' => 'activo',
        ]);

        return response()->json([
            'mensaje' => 'Habito creado con exito',
            'habito' => $habito
        ], Response::HTTP_CREATED);
    }

        public function index(Request $request)
    {
        $user = $request->user();

            $habitos = Habito::where('idUsuario', $user->idUsuario)
            ->where('estado', 'activo')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'mensaje' => 'Habitos obtenidos con éxito',
            'registros' => $habitos
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $habito = Habito::findOrFail($id);

        if ($habito->idUsuario !== $request->user()->idUsuario) {
            return response()->json(['mensaje'=> 'No autorizado'], Response::HTTP_FORBIDDEN);
        }

        $habito->estado = 'archivo';
        $habito->save();

        return response()->json(['mensaje' => 'Habito archivado con éxito'], Response::HTTP_OK);
    }
}
