<?php

// Este archivo va fuera del proyecto, se guarda en htdocs

// Ruta completa a backend
$backendPath = 'C:/Users/thiag/welltrack-app - Soap REST/welltrack-backend';

require_once $backendPath . '/vendor/autoload.php';

$app = require_once $backendPath . '/bootstrap/app.php';

// Inicializar el kernel (necesario para que funcione Eloquent)
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Ahora sí podés usar tus modelos
use App\Models\Usuario;

$options = [
    'uri' => 'http://localhost/soap-server.php'
];
$server = new SoapServer(null, $options);

class UsuarioService
{
    public function obtenerUsuarioPorEmail($email)
    {
        $user = \App\Models\Usuario::where('email', $email)->first();

        if (!$user) {
            return ['error' => 'Usuario no encontrado'];
        }

        return [
            'idUsuario' => $user->idUsuario,
            'nombreApellido' => $user->nombreApellido,
            'nombreUsuario' => $user->nombreUsuario,
            'email' => $user->email,
            'fechaNac' => $user->fechaNac
        ];
    }
}

$server->setClass(UsuarioService::class);
$server->handle();
