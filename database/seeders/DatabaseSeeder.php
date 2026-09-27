<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the admin account, profile, skills and one starter project.
     * Safe to run more than once.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@example.com');

        if (! User::query()->where('email', $email)->exists()) {
            // Never fall back to a known password; generate one when .env has none.
            $password = env('ADMIN_PASSWORD');

            if (blank($password)) {
                $password = Str::password(20);
                $this->command?->warn("ADMIN_PASSWORD is not set. Generated admin password for {$email}: {$password}");
            }

            User::query()->create([
                'email' => $email,
                'name' => env('ADMIN_NAME', 'Admin'),
                'password' => $password,
                'email_verified_at' => now(),
            ]);
        }

        Profile::query()->firstOrCreate([], [
            'name' => 'Aiman Ismail',
            'headline' => 'Web Developer · System Developer · Software Engineer',
            'bio' => 'Building web apps and systems end to end — Laravel, React and Node on the front of it, Docker and CI/CD pipelines behind it. Currently going deep on infrastructure.',
        ]);

        // name => level (1 beginner, 2 intermediate, 3 advanced, 4 expert). Tune these in the admin.
        $skills = [
            'languages' => ['php' => 4, 'javascript' => 3, 'typescript' => 3],
            'frontend' => ['react' => 3, 'react-native' => 2, 'inertia.js' => 3, 'blade' => 4],
            'backend' => ['laravel' => 4, 'node.js' => 3],
            'database' => ['mysql' => 4, 'mariadb' => 3, 'postgresql' => 2],
            'devops' => ['docker' => 3, 'jenkins' => 2, 'github-actions' => 3, 'uptime-kuma' => 2],
        ];

        $order = 0;
        foreach ($skills as $category => $levels) {
            $cat = SkillCategory::query()->firstOrCreate(['name' => $category], ['sort_order' => $order++]);
            $i = 0;
            foreach ($levels as $name => $level) {
                $cat->skills()->firstOrCreate(['name' => $name], ['level' => $level, 'sort_order' => $i++]);
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
            Skill::query()->whereIn('name', ['laravel', 'react', 'inertia.js', 'mysql'])->pluck('id')
        );
    }
}
