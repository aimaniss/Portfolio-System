<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use App\Models\SkillCategory;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'projects' => Project::count(),
                'published' => Project::where('is_published', true)->count(),
                'skills' => Skill::count(),
                'categories' => SkillCategory::count(),
                'experiences' => Experience::count(),
                'current' => Experience::whereNull('end_date')->count(),
                'unread' => Message::whereNull('read_at')->count(),
            ],
            'projects' => Project::query()->with('skills')->latest('updated_at')->limit(5)->get(),
            'messages' => Message::query()->latest()->limit(4)->get(),
        ]);
    }
}
