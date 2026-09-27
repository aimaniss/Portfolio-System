<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/messages', [
            'messages' => Message::query()->latest()->get(),
        ]);
    }

    public function toggleRead(Message $message): RedirectResponse
    {
        $message->update(['read_at' => $message->read_at ? null : now()]);

        return back();
    }

    public function destroy(Message $message): RedirectResponse
    {
        $message->delete();

        return back();
    }
}
