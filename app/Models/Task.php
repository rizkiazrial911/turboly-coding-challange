<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'description',
        'due_date',
        'priority',
        'is_completed'
    ];

    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}