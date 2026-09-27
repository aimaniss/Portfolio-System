<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/projects/index', [
            'projects' => Project::query()->with(['cover', 'skills'])->ordered()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/projects/form', [
            'project' => null,
            'categories' => $this->categories(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $project = Project::create($data);
        $project->skills()->sync($data['skill_ids'] ?? []);
        $this->storeImages($request, $project);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project created.']);

        return to_route('admin.projects.edit', $project->id);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('admin/projects/form', [
            'project' => $project->load(['images', 'skills']),
            'categories' => $this->categories(),
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validated($request, $project);
        $project->update($data);
        $project->skills()->sync($data['skill_ids'] ?? []);
        $this->storeImages($request, $project);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project saved.']);

        return to_route('admin.projects.edit', $project->id);
    }

    public function destroy(Project $project): RedirectResponse
    {
        Storage::disk('public')->deleteDirectory("projects/{$project->id}");
        $project->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Project deleted.']);

        return to_route('admin.projects.index');
    }

    public function setCover(Project $project, ProjectImage $image): RedirectResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $project->images()->update(['is_cover' => false]);
        $image->update(['is_cover' => true]);

        return back();
    }

    public function destroyImage(Project $project, ProjectImage $image): RedirectResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        Storage::disk('public')->delete($image->path);
        $wasCover = $image->is_cover;
        $image->delete();

        if ($wasCover) {
            $project->images()->first()?->update(['is_cover' => true]);
        }

        return back();
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?Project $project = null): array
    {
        $request->merge(['slug' => Str::slug($request->input('slug') ?: $request->input('title'))]);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:160', Rule::unique('projects', 'slug')->ignore($project?->id)],
            'summary' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'role' => ['nullable', 'string', 'max:100'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'built_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'skill_ids' => ['array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
            'images' => ['array', 'max:12'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $data['sort_order'] ??= 0;

        return $data;
    }

    private function storeImages(Request $request, Project $project): void
    {
        $order = (int) $project->images()->max('sort_order');
        $hasCover = $project->images()->where('is_cover', true)->exists();

        foreach ($request->file('images', []) as $file) {
            $project->images()->create([
                'path' => $file->store("projects/{$project->id}", 'public'),
                'is_cover' => ! $hasCover,
                'sort_order' => ++$order,
            ]);
            $hasCover = true;
        }
    }

    private function categories()
    {
        return SkillCategory::query()->with('skills')->orderBy('sort_order')->get();
    }
}
