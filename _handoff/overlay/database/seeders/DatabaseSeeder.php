<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Project;
use App\Models\SkillCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the admin account, profile, skills and one starter project.
     * Safe to run more than once.
     */
    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_NAME', 'Aiman Ismail'),
                'password' => env('ADMIN_PASSWORD', 'password'),
                'email_verified_at' => now(),
            ],
        );

        Profile::query()->firstOrCreate([], [
            'name' => 'Aiman Ismail',
            'headline' => 'Web Developer · System Developer · Software Engineer',
            'bio' => 'Building web apps and systems end to end — Laravel, React and Node on the front of it, Docker and CI/CD pipelines behind it. Currently going deep on infrastructure.',
        ]);

        $skills = [
            'frontend' => ['react', 'react-native', 'inertia.js', 'blade'],
            'backend' => ['laravel', 'node.js'],
            'database' => ['mysql', 'mariadb', 'postgresql'],
            'devops' => ['docker', 'jenkins', 'github-actions', 'uptime-kuma'],
        ];

        $order = 0;
        foreach ($skills as $category => $names) {
            $cat = SkillCategory::query()->firstOrCreate(['name' => $category], ['sort_order' => $order++]);
            foreach ($names as $i => $name) {
                $cat->skills()->firstOrCreate(['name' => $name], ['sort_order' => $i]);
            }
        }

        $project = Project::query()->firstOrCreate(['slug' => 'portfolio-cms'], [
            'title' => 'portfolio-cms',
            'summary' => 'This site — a Laravel + Inertia monolith with a private admin CMS.',
            'description' => "## About\nA personal portfolio with an admin panel to manage projects, skills and experience.\n\n## Highlights\n- Terminal-style UI\n- Image uploads per project\n- Contact form inbox",
            'role' => 'solo developer',
            'built_at' => now()->startOfMonth(),
            'is_published' => true,
            'is_featured' => true,
        ]);

        $project->skills()->syncWithoutDetaching(
            \App\Models\Skill::query()->whereIn('name', ['laravel', 'react', 'inertia.js', 'mysql'])->pluck('id')
        );
    }
}
