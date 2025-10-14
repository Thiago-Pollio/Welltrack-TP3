<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroHabito extends Model
{
    use HasFactory;

    protected $table = 'registro_habitos';
    protected $primaryKey = 'idRegistroHabito';

    protected $fillable = [
        'idHabito',
        'idUsuario',
        'fecha',
        'cantidadRealizada',
        'cumplido',
        'comentario',
    ];

    public $timestamps = true;

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'idUsuario');
    }

        public function habito()
    {
        return $this->belongsTo(Habito::class, 'idHabito');
    }
}
