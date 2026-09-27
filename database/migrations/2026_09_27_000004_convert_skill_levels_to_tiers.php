<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Skill levels move from a 0-100 percentage to a tier:
 * 1 = beginner, 2 = intermediate, 3 = advanced, 4 = expert.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('skills')->whereNotNull('level')->update(['level' => DB::raw(
            'CASE WHEN level >= 85 THEN 4 WHEN level >= 70 THEN 3 WHEN level >= 50 THEN 2 ELSE 1 END'
        )]);
    }

    public function down(): void
    {
        DB::table('skills')->whereNotNull('level')->update(['level' => DB::raw(
            'CASE level WHEN 4 THEN 90 WHEN 3 THEN 75 WHEN 2 THEN 60 ELSE 40 END'
        )]);
    }
};
