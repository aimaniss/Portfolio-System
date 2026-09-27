import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import { cn } from '@/lib/utils';
import { btnSmallGhost, btnSmallPrimary } from '@/themes/mac/admin-ui';
import type { ThemeName } from '@/types/portfolio';

const themes: {
    id: ThemeName;
    name: string;
    blurb: string;
    preview: ReactNode;
}[] = [
    {
        id: 'mac',
        name: 'macOS Terminal',
        blurb: 'zsh prompt, JetBrains Mono, dark window with traffic lights.',
        preview: (
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-mac-line bg-mac-bg">
                <div className="flex h-4 items-center gap-1 bg-mac-bar px-1.5">
                    <span className="size-1.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-1.5 rounded-full bg-[#febc2e]" />
                    <span className="size-1.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex flex-col gap-1.5 p-2.5 font-mac text-[9px]">
                    <div>
                        <span className="text-mac-green">aiman</span>{' '}
                        <span className="text-mac-blue">~</span> % whoami
                    </div>
                    <div className="text-sm font-extrabold text-mac-bright">
                        Aiman_
                    </div>
                    <div className="h-1 w-3/4 rounded bg-mac-amber/60" />
                    <div className="mt-1 grid grid-cols-3 gap-1">
                        <div className="h-6 rounded bg-mac-shot" />
                        <div className="h-6 rounded bg-mac-shot" />
                        <div className="h-6 rounded bg-mac-shot" />
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'powershell',
        name: 'Windows PowerShell',
        blurb: 'Windows Terminal chrome, PS prompt, Cascadia Code.',
        preview: (
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-ps-line bg-ps-bg">
                <div className="flex h-4 items-center bg-ps-bar text-[7px] text-ps-text">
                    <span className="h-full bg-ps-bg px-1.5 leading-4">
                        PowerShell
                    </span>
                    <span className="flex-1" />
                    <span className="px-1 tracking-widest">─ ☐ ✕</span>
                </div>
                <div className="flex flex-col gap-1.5 p-2.5 font-ps text-[9px] text-ps-text">
                    <div>
                        PS C:\Users\aiman&gt;{' '}
                        <span className="text-ps-yellow">Get-Profile</span>
                    </div>
                    <div className="text-ps-cyan">Name : Aiman</div>
                    <div className="h-1 w-2/3 rounded bg-ps-muted/50" />
                    <div className="mt-1 flex flex-col gap-0.5">
                        <div className="h-1.5 w-full rounded bg-ps-shot" />
                        <div className="h-1.5 w-full rounded bg-ps-shot" />
                        <div className="h-1.5 w-4/5 rounded bg-ps-shot" />
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'professional',
        name: 'Professional',
        blurb: 'Light, clean, sans-serif layout for recruiters.',
        preview: (
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-pro-line bg-pro-bg font-pro">
                <div className="flex h-4 items-center gap-1.5 border-b border-pro-line bg-pro-surface px-2 text-[7px] font-semibold text-pro-ink">
                    Aiman Ismail
                    <span className="flex-1" />
                    <span className="h-1 w-3 rounded bg-pro-line" />
                    <span className="h-1 w-3 rounded bg-pro-line" />
                </div>
                <div className="flex items-center gap-2 p-2.5">
                    <div className="size-7 shrink-0 rounded-full bg-pro-accent-soft" />
                    <div className="flex flex-col gap-1">
                        <div className="text-[10px] font-semibold text-pro-ink">
                            Aiman Ismail
                        </div>
                        <div className="h-1 w-14 rounded bg-pro-muted/40" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1 px-2.5">
                    <div className="h-6 rounded bg-pro-surface shadow-sm" />
                    <div className="h-6 rounded bg-pro-surface shadow-sm" />
                    <div className="h-6 rounded bg-pro-surface shadow-sm" />
                </div>
            </div>
        ),
    },
];

export default function ThemePage({ current }: { current: ThemeName }) {
    const term = useTerm();
    const [busy, setBusy] = useState<ThemeName | null>(null);

    const activate = (theme: ThemeName) =>
        router.post(
            '/admin/theme',
            { theme },
            {
                preserveScroll: true,
                onStart: () => setBusy(theme),
                onFinish: () => setBusy(null),
            },
        );

    return (
        <AdminLayout title="Theme" cwd="~/admin/theme" command="theme --list">
            <div className="text-mac-soft">
                Pick the look of the public site. Every theme uses the same
                data; the admin panel always stays in the terminal look.
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3">
                {themes.map((t) => {
                    const active = t.id === current;

                    return (
                        <div
                            key={t.id}
                            className={cn(
                                'flex flex-col overflow-hidden rounded-[10px] border bg-mac-panel',
                                active
                                    ? 'border-2 border-mac-green'
                                    : 'border-mac-rule',
                            )}
                        >
                            <div className="h-40 bg-mac-input p-3.5">
                                {t.preview}
                            </div>
                            <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-mac-bright">
                                        {t.name}
                                    </span>
                                    <span className="flex-1" />
                                    {active && (
                                        <span className="rounded border border-mac-green px-1.5 text-[11px] text-mac-green">
                                            {term('● active', 'Active')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[13px] text-mac-muted">
                                    {t.blurb}
                                </div>
                                <div className="mt-auto flex gap-2.5 pt-2">
                                    <a
                                        href={`/?theme=${t.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={btnSmallGhost}
                                    >
                                        {term('preview ↗', 'Preview')}
                                    </a>
                                    {!active && (
                                        <button
                                            type="button"
                                            onClick={() => activate(t.id)}
                                            disabled={busy !== null}
                                            className={btnSmallPrimary}
                                        >
                                            {busy === t.id
                                                ? term(
                                                      'switching…',
                                                      'Activating…',
                                                  )
                                                : term('activate', 'Activate')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
