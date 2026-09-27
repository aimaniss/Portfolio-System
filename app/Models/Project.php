<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    protected $fillable = [
        'experience_id', 'title', 'slug', 'summary', 'description', 'role', 'github_url',
        'live_url', 'built_at', 'is_published', 'is_featured', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'built_at' => 'date:Y-m-d',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** The job this was built at; null for a personal project. */
    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderByDesc('is_cover')->orderBy('sort_order');
    }

    public function cover(): HasOne
    {
        return $this->hasOne(ProjectImage::class)->orderByDesc('is_cover')->orderBy('sort_order');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)->orderBy('name');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    public function scopePersonal(Builder $query): void
    {
        $query->whereNull('experience_id');
    }

    public function scopeWork(Builder $query): void
    {
        $query->whereNotNull('experience_id');
    }

    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderByDesc('built_at')->orderByDesc('id');
    }
}
