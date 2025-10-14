<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroDiario extends Model
{
    use HasFactory;

    protected $table = 'registro_diarios';
    protected $primaryKey = 'idRegistro';

    protected $fillable = [
        'idUsuario',
        'fecha',
        'estadoAnimo',
        'mente',
        'energiaNivel',
        'horasSueño',
        'vidaSocial',
        'aguaTomada',
        'estresNivel',
        'notaOpcional',
    ];

    public $timestamps = true;
}
