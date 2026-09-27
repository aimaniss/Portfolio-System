<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

class CreateAdmin extends Command
{
    protected $signature = 'app:create-admin';

    protected $description = 'Create or update the admin account';

    public function handle(): int
    {
        $email = text('Email', required: true, validate: ['email' => 'email']);
        $name = text('Name', default: 'Admin', required: true);
        $pass = password('Password (min 8 chars)', required: true, validate: ['password' => 'min:8']);

        User::query()->updateOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => $pass, 'email_verified_at' => now()],
        );

        $this->components->info("Admin {$email} is ready. Log in at /login.");

        return self::SUCCESS;
    }
}
