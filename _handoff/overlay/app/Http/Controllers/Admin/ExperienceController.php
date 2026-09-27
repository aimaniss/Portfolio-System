<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/experiences/index', [
            'experiences' => Experience::query()->with('skills')->orderByDesc('start_date')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/experiences/form', [
            'experience' => null,
            'categories' => $this->categories(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $experience = Experience::create($data);
        $experience->skills()->sync($data['skill_ids'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Experience added.']);

        return to_route('admin.experiences.index');
    }

    public function edit(Experience $experience): Response
    {
        return Inertia::render('admin/experiences/form', [
            'experience' => $experience->load('skills'),
            'categories' => $this->categories(),
        ]);
    }

    public function update(Request $request, Experience $experience): RedirectResponse
    {
        $data = $this->validated($request);
        $experience->update($data);
        $experience->skills()->sync($data['skill_ids'] ?? []);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Experience saved.']);

        return to_route('admin.experiences.index');
    }

    public function destroy(Experience $experience): RedirectResponse
    {
        $experience->delete();

        return to_route('admin.experiences.index');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'company' => ['required', 'string', 'max:150'],
            'position' => ['required', 'string', 'max:150'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'description' => ['nullable', 'string', 'max:3000'],
            'skill_ids' => ['array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);
    }

    private function categories()
    {
        return SkillCategory::query()->with('skills')->orderBy('sort_order')->get();
    }
}
