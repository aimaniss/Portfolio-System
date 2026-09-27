<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    public const THEMES = ['mac', 'powershell', 'professional'];

    protected $fillable = [
        'name', 'headline', 'bio', 'avatar_path', 'resume_path',
        'email', 'location', 'github_url', 'linkedin_url', 'theme',
    ];

    protected $appends = ['avatar_url', 'resume_url'];

    /**
     * The single profile row; created on first access.
     */
    public static function current(): self
    {
        return once(fn () => static::query()->firstOrCreate([], ['name' => config('app.name'), 'theme' => 'mac']));
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::get(fn () => $this->avatar_path ? Storage::disk('public')->url($this->avatar_path) : null);
    }

    protected function resumeUrl(): Attribute
    {
        return Attribute::get(fn () => $this->resume_path ? Storage::disk('public')->url($this->resume_path) : null);
    }
}
