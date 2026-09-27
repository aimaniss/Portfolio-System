<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

// Public site
Route::get('/', [PortfolioController::class, 'home'])->name('home');
Route::get('projects', [PortfolioController::class, 'projects'])->name('projects.index');
Route::get('projects/{project:slug}', [PortfolioController::class, 'show'])->name('projects.show');
Route::post('contact', [PortfolioController::class, 'contact'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Old starter-kit dashboard URL → admin
Route::redirect('dashboard', '/admin')->name('dashboard');

// Admin panel
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', Admin\DashboardController::class)->name('dashboard');

    Route::get('profile', [Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('profile', [Admin\ProfileController::class, 'update'])->name('profile.update');

    Route::get('theme', [Admin\ThemeController::class, 'edit'])->name('theme.edit');
    Route::post('theme', [Admin\ThemeController::class, 'update'])->name('theme.update');

    Route::get('skills', [Admin\SkillController::class, 'index'])->name('skills.index');
    Route::post('skills', [Admin\SkillController::class, 'store'])->name('skills.store');
    Route::put('skills/{skill}', [Admin\SkillController::class, 'update'])->name('skills.update');
    Route::delete('skills/{skill}', [Admin\SkillController::class, 'destroy'])->name('skills.destroy');
    Route::post('skill-categories', [Admin\SkillController::class, 'storeCategory'])->name('categories.store');
    Route::put('skill-categories/{category}', [Admin\SkillController::class, 'updateCategory'])->name('categories.update');
    Route::delete('skill-categories/{category}', [Admin\SkillController::class, 'destroyCategory'])->name('categories.destroy');

    Route::resource('experiences', Admin\ExperienceController::class)->except('show');

    // Projects use POST for update so multipart image uploads work.
    Route::get('projects', [Admin\ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/create', [Admin\ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [Admin\ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project:id}/edit', [Admin\ProjectController::class, 'edit'])->name('projects.edit');
    Route::post('projects/{project:id}', [Admin\ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project:id}', [Admin\ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('projects/{project:id}/images/{image}/cover', [Admin\ProjectController::class, 'setCover'])->name('projects.images.cover');
    Route::delete('projects/{project:id}/images/{image}', [Admin\ProjectController::class, 'destroyImage'])->name('projects.images.destroy');

    Route::get('messages', [Admin\MessageController::class, 'index'])->name('messages.index');
    Route::post('messages/{message}/read', [Admin\MessageController::class, 'toggleRead'])->name('messages.read');
    Route::delete('messages/{message}', [Admin\MessageController::class, 'destroy'])->name('messages.destroy');
});

require __DIR__.'/settings.php';
