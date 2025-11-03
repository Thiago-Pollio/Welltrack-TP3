<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class AfirmacionController extends Controller
{
    public function obtener()
    {
        try {
            // Llamar a la API de afirmaciones
            $response = Http::get('https://www.affirmations.dev/');
            $data = $response->json();

            if (!isset($data['affirmation'])) {
                return response()->json(['error' => 'No se pudo obtener la afirmación'], 500);
            }

            // Traducir la afirmación a español
            $traduccion = Http::get('https://api.mymemory.translated.net/get', [
                'q' => $data['affirmation'],
                'langpair' => 'en|es',
            ])->json();

            $textoTraducido = $traduccion['responseData']['translatedText'] ?? $data['affirmation'];

            return response()->json([
                'affirmation' => $data['affirmation'],
                'traduccion' => $textoTraducido,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener la afirmación: ' . $e->getMessage()], 500);
        }
    }
}
