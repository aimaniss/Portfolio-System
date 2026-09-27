<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/profile', ['profile' => Profile::current()]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'headline' => ['nullable', 'string', 'max:200'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'email' => ['nullable', 'email', 'max:150'],
            'location' => ['nullable', 'string', 'max:100'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:4096'],
            'resume' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'remove_avatar' => ['boolean'],
            'remove_resume' => ['boolean'],
        ]);

        $profile = Profile::current();
        $disk = Storage::disk('public');

        if ($request->hasFile('avatar') || $request->boolean('remove_avatar')) {
            $profile->avatar_path && $disk->delete($profile->avatar_path);
            $profile->avatar_path = $request->file('avatar')?->store('profile', 'public');
        }

        if ($request->hasFile('resume') || $request->boolean('remove_resume')) {
            $profile->resume_path && $disk->delete($profile->resume_path);
            $profile->resume_path = $request->file('resume')?->storeAs('profile', 'resume.pdf', 'public');
        }

        $profile->fill(collect($data)->except(['avatar', 'resume', 'remove_avatar', 'remove_resume'])->all())->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profile saved.']);

        return back();
    }
}
