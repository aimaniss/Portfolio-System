<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
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

        $this->seedSampleExperience();
    }

    /**
     * Example work history with company projects. Replace it from the admin panel.
     */
    private function seedSampleExperience(): void
    {
        $jobs = [
            [
                'company' => 'Example Tech Sdn Bhd',
                'position' => 'Software Engineer',
                'start_date' => '2024-03-01',
                'end_date' => null,
                'description' => 'Build and maintain internal business systems end to end, from Laravel APIs and React dashboards to Docker-based deployments.',
                'skills' => ['laravel', 'react', 'docker', 'mysql'],
                'projects' => [
                    ['HR Portal', 'Leave, claims and payroll self-service for 300+ staff.', ['laravel', 'react', 'mysql']],
                    ['Payment Gateway Integration', 'FPX and card payments with webhook reconciliation.', ['laravel', 'docker']],
                ],
            ],
            [
                'company' => 'Sample Digital Agency',
                'position' => 'Web Developer',
                'start_date' => '2021-06-01',
                'end_date' => '2024-02-01',
                'description' => 'Delivered client websites and e-commerce stores; set up CI pipelines for the team.',
                'skills' => ['php', 'blade', 'mariadb', 'jenkins'],
                'projects' => [
                    ['E-commerce Storefronts', 'Multi-tenant online stores for retail clients.', ['php', 'blade', 'mariadb']],
                ],
            ],
            [
                'company' => 'Demo Solutions',
                'position' => 'Junior Developer (Intern)',
                'start_date' => '2020-09-01',
                'end_date' => '2021-05-01',
                'description' => 'Maintained PHP modules and wrote reports for an inventory system.',
                'skills' => ['php', 'javascript', 'mysql'],
                'projects' => [],
            ],
        ];

        foreach ($jobs as $job) {
            $experience = Experience::query()->firstOrCreate(
                ['company' => $job['company'], 'position' => $job['position']],
                Arr::only($job, ['start_date', 'end_date', 'description']),
            );
            $experience->skills()->syncWithoutDetaching(Skill::query()->whereIn('name', $job['skills'])->pluck('id'));

            foreach ($job['projects'] as $i => [$title, $summary, $skills]) {
                $project = Project::query()->firstOrCreate(['slug' => Str::slug($title)], [
                    'experience_id' => $experience->id,
                    'title' => $title,
                    'summary' => $summary,
                    'description' => "## About\n{$summary}\n\n## My role\n- Designed the data model\n- Built the main features\n- Wrote tests and deployment scripts",
                    'role' => 'developer',
                    'built_at' => $job['start_date'],
                    'is_published' => true,
                    'sort_order' => $i,
                ]);
                $project->skills()->syncWithoutDetaching(Skill::query()->whereIn('name', $skills)->pluck('id'));
            }
        }
    }
}
