<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Profile;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_home_renders_with_the_active_theme()
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->where('theme', 'mac')
            ->has('categories', 5)
            ->has('projects', 1));

        Profile::current()->update(['theme' => 'powershell']);

        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('theme', 'powershell'));
    }

    public function test_only_admins_can_preview_other_themes()
    {
        $this->get('/?theme=professional')
            ->assertInertia(fn (Assert $page) => $page->where('theme', 'mac'));

        $this->actingAs(User::first())
            ->get('/?theme=professional')
            ->assertInertia(fn (Assert $page) => $page->where('theme', 'professional'));
    }

    public function test_draft_projects_are_hidden_from_guests()
    {
        $draft = Project::create(['title' => 'Secret', 'slug' => 'secret', 'is_published' => false]);

        $this->get('/projects/secret')->assertNotFound();
        $this->get('/projects')->assertInertia(fn (Assert $page) => $page->has('projects', 1));
        $this->actingAs(User::first())->get("/projects/{$draft->slug}")->assertOk();
    }

    public function test_projects_can_be_filtered_by_skill()
    {
        $this->get('/projects?skill=laravel')->assertInertia(fn (Assert $page) => $page->has('projects', 1));
        $this->get('/projects?skill=jenkins')->assertInertia(fn (Assert $page) => $page->has('projects', 0));
    }

    public function test_contact_form_stores_a_message()
    {
        $this->post('/contact', ['name' => 'Ali', 'email' => 'ali@example.com', 'body' => 'Hello'])
            ->assertRedirect();

        $this->assertDatabaseHas('messages', ['email' => 'ali@example.com', 'read_at' => null]);

        $this->post('/contact', ['name' => 'Ali', 'email' => 'not-an-email', 'body' => ''])
            ->assertSessionHasErrors(['email', 'body']);
    }

    public function test_registration_is_disabled()
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_admin_pages_require_login()
    {
        foreach (['/admin', '/admin/profile', '/admin/theme', '/admin/skills', '/admin/experiences', '/admin/projects', '/admin/messages'] as $url) {
            $this->get($url)->assertRedirect('/login');
        }
    }

    public function test_admin_pages_render()
    {
        $this->actingAs(User::first());

        foreach ([
            '/admin' => 'admin/dashboard',
            '/admin/profile' => 'admin/profile',
            '/admin/theme' => 'admin/theme',
            '/admin/skills' => 'admin/skills',
            '/admin/experiences' => 'admin/experiences/index',
            '/admin/experiences/create' => 'admin/experiences/form',
            '/admin/projects' => 'admin/projects/index',
            '/admin/projects/create' => 'admin/projects/form',
            '/admin/messages' => 'admin/messages',
        ] as $url => $component) {
            $this->get($url)->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_admin_can_create_a_project_with_images_and_change_the_cover()
    {
        Storage::fake('public');
        $this->actingAs(User::first());

        $this->post('/admin/projects', [
            'title' => 'Queue Monitor',
            'is_published' => '1',
            'is_featured' => '0',
            'sort_order' => '',
            'images' => [UploadedFile::fake()->image('a.png'), UploadedFile::fake()->image('b.png')],
        ])->assertRedirect();

        $project = Project::where('slug', 'queue-monitor')->firstOrFail();
        $this->assertSame(0, $project->sort_order);
        $this->assertCount(2, $project->images);
        [$first, $second] = $project->images;
        $this->assertTrue($first->is_cover);
        Storage::disk('public')->assertExists($first->path);

        $this->post("/admin/projects/{$project->id}/images/{$second->id}/cover")->assertRedirect();
        $this->assertTrue($second->fresh()->is_cover);
        $this->assertFalse($first->fresh()->is_cover);

        $this->delete("/admin/projects/{$project->id}/images/{$second->id}")->assertRedirect();
        Storage::disk('public')->assertMissing($second->path);
        $this->assertTrue($first->fresh()->is_cover);

        $this->delete("/admin/projects/{$project->id}")->assertRedirect('/admin/projects');
        $this->assertModelMissing($project);
    }

    public function test_admin_can_switch_theme_and_manage_messages()
    {
        $this->actingAs(User::first());

        $this->post('/admin/theme', ['theme' => 'professional'])->assertRedirect();
        $this->assertSame('professional', Profile::current()->fresh()->theme);
        $this->post('/admin/theme', ['theme' => 'nope'])->assertSessionHasErrors('theme');

        $message = Message::create(['name' => 'A', 'email' => 'a@example.com', 'body' => 'Hi']);
        $this->post("/admin/messages/{$message->id}/read");
        $this->assertNotNull($message->fresh()->read_at);
        $this->delete("/admin/messages/{$message->id}");
        $this->assertModelMissing($message);
    }

    public function test_admin_can_upload_avatar_and_resume()
    {
        Storage::fake('public');
        $this->actingAs(User::first());

        $this->post('/admin/profile', [
            'name' => 'Aiman Ismail',
            'avatar' => UploadedFile::fake()->image('me.jpg'),
            'resume' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ])->assertRedirect();

        $profile = Profile::current()->fresh();
        Storage::disk('public')->assertExists([$profile->avatar_path, 'profile/resume.pdf']);

        $this->post('/admin/profile', ['name' => 'Aiman Ismail', 'remove_avatar' => '1']);
        $this->assertNull($profile->fresh()->avatar_path);
    }
}
