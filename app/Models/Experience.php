<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Experience extends Model
{
    protected $fillable = ['company', 'position', 'start_date', 'end_date', 'description'];

    /** Work projects built while in this role. */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
        ];
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)->orderBy('name');
    }
}
