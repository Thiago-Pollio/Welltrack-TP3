<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Habito extends Model
{
    protected $table = 'habitos';
    protected $primaryKey = 'idHabito';

    protected $fillable = [
              'idUsuario',
        'nombre',
        'descripcion',
        'frecuencia',
        'meta',
        'unidad',
        'estado',
        'rachaActual',
        'rachaMaxima',
        'fechaUltimoRegistro'
    ];

    public $timestamps = true;

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }
}
