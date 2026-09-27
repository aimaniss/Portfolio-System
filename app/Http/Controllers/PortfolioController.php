<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Models\Message;
use App\Models\Profile;
use App\Models\Project;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function home(Request $request): Response
    {
        return Inertia::render('public/home', [
            'theme' => $this->theme($request),
            'profile' => Profile::current(),
            'categories' => SkillCategory::query()->with('skills')->orderBy('sort_order')->get(),
            // Work projects are listed under the job they were built at.
            'experiences' => Experience::query()
                ->with(['skills', 'projects' => fn ($q) => $q->published()->ordered()->select(['id', 'experience_id', 'title', 'slug', 'summary'])])
                ->orderByDesc('start_date')->get(),
            // The projects section shows personal work only.
            'projects' => Project::query()->published()->personal()->where('is_featured', true)
                ->with(['cover', 'skills'])->ordered()->limit(6)->get(),
            'projectCount' => Project::query()->published()->count(),
        ]);
    }

    public function projects(Request $request): Response
    {
        $skill = $request->string('skill')->toString();
        $type = in_array($request->query('type'), ['personal', 'work'], true) ? $request->query('type') : null;

        $projects = Project::query()->published()
            ->when($skill !== '', fn ($q) => $q->whereHas('skills', fn ($s) => $s->where('name', $skill)))
            ->when($type === 'personal', fn ($q) => $q->personal())
            ->when($type === 'work', fn ($q) => $q->work())
            ->with(['cover', 'skills', 'experience:id,company,position'])->ordered()->get();

        return Inertia::render('public/projects/index', [
            'theme' => $this->theme($request),
            'profile' => Profile::current()->only(['name', 'email', 'github_url', 'linkedin_url']),
            'projects' => $projects,
            'skills' => SkillCategory::query()->with('skills')->orderBy('sort_order')->get()
                ->flatMap->skills->pluck('name')->values(),
            'activeSkill' => $skill ?: null,
            'activeType' => $type,
        ]);
    }

    public function show(Request $request, Project $project): Response
    {
        abort_unless($project->is_published || $request->user(), 404);

        return Inertia::render('public/projects/show', [
            'theme' => $this->theme($request),
            'profile' => Profile::current()->only(['name', 'email', 'github_url', 'linkedin_url']),
            'project' => $project->load(['images', 'skills', 'experience:id,company,position,start_date,end_date']),
        ]);
    }

    public function contact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        Message::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Message sent. Thanks!']);

        return back();
    }

    /**
     * Active public theme. Logged-in admins can preview another one with ?theme=.
     */
    private function theme(Request $request): string
    {
        $preview = $request->query('theme');

        if ($request->user() && in_array($preview, Profile::THEMES, true)) {
            return $preview;
        }

        $theme = Profile::current()->theme;

        return in_array($theme, Profile::THEMES, true) ? $theme : 'mac';
    }
}
