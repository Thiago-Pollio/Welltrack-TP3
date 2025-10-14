<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RegistroHabito;
use App\Models\Habito;
use Illuminate\Http\Response;

class RegistroHabitoController extends Controller
{
        public function store(Request $request)
    {
        $validated = $request->validate([
            'idHabito' => 'required|exists:habitos,idHabito',
            'valor' => 'required|numeric|min:0',
            'fecha' => 'required|date',
            
        ]);

        $user = $request->user();

        $existe = RegistroHabito::where('idHabito', $validated['idHabito'])
        ->where('fecha', $validated['fecha'])
        ->where('idUsuario', $user->idUsario)
        ->first();

        if ($existe) {
            return response()->json([
                'mensaje' => 'Ya se registró ese habito hoy.'
            ], Response::HTTP_CONFLICT);
        }


        $registro = RegistroHabito::create([
            'idUsuario' => $user->idUsuario,
            'idHabito' => $validated['idHabito'],
            'fecha' => $validated['fecha'],
            'valor' => $validated['valor'],
        ]);

        $habito = Habito::find($validated['idHabito']);
        if ($habito->fechaUltimoRegistro === date('Y-m-d', strtotime('-1 day'))) {
            $habito->rachaActual += 1;
        } else {
            $habito->rachaActual += 1;
        }

        if ($habito->rachaActual > $habito->rachaMaxima) {
            $habito->rachaMaxima = $habito->rachaActual;
        }

        $habito->fechaUltimoRegistro = $validated['fecha'];
        $habito->save();

        return response()->json([
            'mensaje' => 'Registro guardado con exito',
            'registro' => $registro,
            'rachaActual' => $habito->rachaActual,
        ], Response::HTTP_CREATED);
    }

        public function index(Request $request, $idHabito)
    {
        $user = $request->user();

            $registros = RegistroHabito::where('idUsuario', $user->idUsuario)
            ->where('idHabito', $idHabito)
            ->orderBy('fecha', 'desc')
            ->get();

        return response()->json([
            'mensaje' => 'Registros obtenidos con éxito',
            'registros' => $registros
        ], 200);
    }
}
