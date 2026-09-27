<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ThemeController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/theme', [
            'current' => Profile::current()->theme ?? 'mac',
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'theme' => ['required', Rule::in(Profile::THEMES)],
        ]);

        Profile::current()->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Theme switched to '.$data['theme'].'.']);

        return back();
    }
}
