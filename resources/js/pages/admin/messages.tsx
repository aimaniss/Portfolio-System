import { router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import { cn } from '@/lib/utils';
import {
    confirmed,
    EmptyRow,
    linkBlue,
    linkRed,
    Panel,
} from '@/themes/mac/admin-ui';
import type { Message } from '@/types/portfolio';

const opts = { preserveScroll: true };

function when(date: string): string {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Messages({ messages }: { messages: Message[] }) {
    const term = useTerm();
    const [open, setOpen] = useState<number | null>(null);
    const unread = messages.filter((m) => !m.read_at).length;

    const toggleRead = (m: Message) =>
        router.post(`/admin/messages/${m.id}/read`, {}, opts);

    const expand = (m: Message) => {
        setOpen(open === m.id ? null : m.id);

        if (!m.read_at) {
            toggleRead(m);
        }
    };

    const destroy = (m: Message) => {
        if (confirmed(`rm message from ${m.name}?`)) {
            router.delete(`/admin/messages/${m.id}`, opts);
        }
    };

    return (
        <AdminLayout title="Messages" cwd="~/admin/messages" command="mail">
            <Panel
                head={`# ${messages.length} message${messages.length === 1 ? '' : 's'} · ${unread} unread`}
                plain={`${messages.length} message${messages.length === 1 ? '' : 's'} · ${unread} unread`}
                className="overflow-hidden"
            >
                {messages.length === 0 && (
                    <EmptyRow>
                        {term(
                            'No mail. Messages from the contact form land here.',
                            'No messages yet. Messages from the contact form appear here.',
                        )}
                    </EmptyRow>
                )}
                {messages.map((m) => {
                    const isOpen = open === m.id;

                    return (
                        <div
                            key={m.id}
                            className="border-b border-mac-rule last:border-b-0"
                        >
                            <button
                                type="button"
                                onClick={() => expand(m)}
                                className={cn(
                                    'flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-mac-chip/40 md:px-5 md:py-3.5',
                                    isOpen && 'bg-mac-chip/40',
                                )}
                            >
                                <span
                                    className={
                                        m.read_at
                                            ? 'text-mac-dim'
                                            : 'text-mac-amber'
                                    }
                                >
                                    {m.read_at ? '○' : '●'}
                                </span>
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <div className="flex flex-wrap items-baseline gap-x-3">
                                        <span
                                            className={cn(
                                                'truncate',
                                                m.read_at
                                                    ? 'text-mac-soft'
                                                    : 'font-bold text-mac-bright',
                                            )}
                                        >
                                            {m.name}
                                        </span>
                                        <span className="truncate text-xs text-mac-muted">
                                            &lt;{m.email}&gt;
                                        </span>
                                        <span className="flex-1" />
                                        <span className="text-xs text-mac-muted">
                                            {when(m.created_at)}
                                        </span>
                                    </div>
                                    {!isOpen && (
                                        <div className="truncate text-[13px] text-mac-soft">
                                            {m.body.split('\n')[0]}
                                        </div>
                                    )}
                                </div>
                            </button>
                            {isOpen && (
                                <div className="flex flex-col gap-4 px-4 pb-4 pl-10 md:px-5 md:pl-11">
                                    <div className="break-words whitespace-pre-wrap text-mac-text">
                                        {m.body}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-[13px]">
                                        <a
                                            href={`mailto:${m.email}?subject=${encodeURIComponent('Re: your message')}`}
                                            className={linkBlue}
                                        >
                                            {term('reply ↗', 'Reply')}
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => toggleRead(m)}
                                            className={linkBlue}
                                        >
                                            {m.read_at
                                                ? term(
                                                      'mark unread',
                                                      'Mark as unread',
                                                  )
                                                : term(
                                                      'mark read',
                                                      'Mark as read',
                                                  )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => destroy(m)}
                                            className={linkRed}
                                        >
                                            {term('rm', 'Delete')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Panel>
        </AdminLayout>
    );
}
