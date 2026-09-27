<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/skills', [
            'categories' => SkillCategory::query()->with('skills')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'skill_category_id' => ['required', 'exists:skill_categories,id'],
            'name' => ['required', 'string', 'max:50'],
        ]);

        $data['sort_order'] = Skill::where('skill_category_id', $data['skill_category_id'])->max('sort_order') + 1;
        Skill::create($data);

        return back();
    }

    public function update(Request $request, Skill $skill): RedirectResponse
    {
        $skill->update($request->validate([
            'skill_category_id' => ['required', 'exists:skill_categories,id'],
            'name' => ['required', 'string', 'max:50'],
        ]));

        return back();
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->delete();

        return back();
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:50']]);
        $data['sort_order'] = SkillCategory::max('sort_order') + 1;
        SkillCategory::create($data);

        return back();
    }

    public function updateCategory(Request $request, SkillCategory $category): RedirectResponse
    {
        $category->update($request->validate([
            'name' => ['required', 'string', 'max:50'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ]));

        return back();
    }

    public function destroyCategory(SkillCategory $category): RedirectResponse
    {
        $category->delete();

        return back();
    }
}
