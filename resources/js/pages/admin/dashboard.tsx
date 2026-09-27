import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import {
    btnSmallGhost,
    btnSmallPrimary,
    confirmed,
    EmptyRow,
    linkBlue,
    linkRed,
    Panel,
    StatusDot,
} from '@/themes/mac/admin-ui';
import type { DashboardStats, Message, Project } from '@/types/portfolio';

function Stat({
    label,
    value,
    note,
    accent = false,
}: {
    label: string;
    value: number;
    note?: string;
    accent?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-[10px] border border-mac-rule bg-mac-panel p-3.5 md:px-5 md:py-4.5">
            <div className="text-[11px] text-mac-muted md:text-xs">{label}</div>
            <div
                className={cn(
                    'text-[26px] leading-tight font-extrabold md:text-[32px]',
                    accent && value > 0 ? 'text-mac-amber' : 'text-mac-bright',
                )}
            >
                {value}
            </div>
            {note && (
                <div className="hidden text-xs text-mac-muted md:block">
                    {note}
                </div>
            )}
        </div>
    );
}

export default function Dashboard({
    stats,
    projects,
    messages,
}: {
    stats: DashboardStats;
    projects: Project[];
    messages: Message[];
}) {
    const destroy = (p: Project) => {
        if (
            confirmed(
                `rm -rf ${p.slug}? This deletes the project and its images.`,
            )
        ) {
            router.delete(`/admin/projects/${p.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Dashboard"
            command="status"
            actions={
                <>
                    <Link
                        href="/admin/projects/create"
                        className={btnSmallPrimary}
                    >
                        + new project
                    </Link>
                    <Link
                        href="/admin/experiences/create"
                        className={cn(btnSmallGhost, 'max-md:hidden')}
                    >
                        + experience
                    </Link>
                    <Link
                        href="/admin/skills"
                        className={cn(btnSmallGhost, 'max-md:hidden')}
                    >
                        + skill
                    </Link>
                </>
            }
        >
            <div className="grid grid-cols-2 gap-2.5 md:gap-4 xl:grid-cols-4">
                <Stat
                    label="projects"
                    value={stats.projects}
                    note={`${stats.published} published · ${stats.projects - stats.published} draft`}
                />
                <Stat
                    label="skills"
                    value={stats.skills}
                    note={`${stats.categories} categories`}
                />
                <Stat
                    label="experiences"
                    value={stats.experiences}
                    note={`${stats.current} current`}
                />
                <Stat
                    label="unread msgs"
                    value={stats.unread}
                    note="unread"
                    accent
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-6">
                <Panel
                    head="$ ls -lt projects/"
                    aside={
                        <Link
                            href="/admin/projects"
                            className={cn(linkBlue, 'text-[13px]')}
                        >
                            all →
                        </Link>
                    }
                    className="overflow-hidden"
                >
                    <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_110px_90px] gap-3 border-b border-mac-rule px-5 py-2.5 text-xs text-mac-muted md:grid">
                        <span>name</span>
                        <span>stack</span>
                        <span>status</span>
                        <span className="text-right">actions</span>
                    </div>
                    {projects.length === 0 && (
                        <EmptyRow>
                            total 0 — create your first project.
                        </EmptyRow>
                    )}
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center gap-3 border-b border-mac-rule px-4 py-3 last:border-b-0 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_110px_90px] md:px-5 md:py-3.5"
                        >
                            <div className="min-w-0 flex-1">
                                <Link
                                    href={`/admin/projects/${p.id}/edit`}
                                    className="block truncate font-bold text-mac-blue hover:underline"
                                >
                                    {p.slug}/
                                </Link>
                                <div className="truncate text-[11px] text-mac-muted md:hidden">
                                    {p.skills.map((s) => s.name).join(', ') ||
                                        '—'}
                                </div>
                            </div>
                            <span className="hidden truncate text-[13px] text-[#a3aab4] md:block">
                                {p.skills.map((s) => s.name).join(', ') || '—'}
                            </span>
                            <span className="shrink-0 text-xs md:text-[13px]">
                                <StatusDot published={p.is_published} />
                            </span>
                            <span className="hidden justify-end gap-3 text-[13px] md:flex">
                                <Link
                                    href={`/admin/projects/${p.id}/edit`}
                                    className={linkBlue}
                                >
                                    edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => destroy(p)}
                                    className={linkRed}
                                >
                                    rm
                                </button>
                            </span>
                        </div>
                    ))}
                </Panel>

                <Panel
                    head="$ tail messages.log"
                    aside={
                        <Link
                            href="/admin/messages"
                            className={cn(linkBlue, 'text-[13px]')}
                        >
                            inbox →
                        </Link>
                    }
                    className="overflow-hidden"
                >
                    {messages.length === 0 && (
                        <EmptyRow>No messages yet.</EmptyRow>
                    )}
                    {messages.map((m) => (
                        <Link
                            key={m.id}
                            href="/admin/messages"
                            className="flex flex-col gap-0.5 border-b border-mac-rule px-4 py-3 last:border-b-0 hover:bg-mac-chip/40 md:px-5 md:py-3.5"
                        >
                            <div className="flex gap-2 text-[13px]">
                                {m.read_at ? (
                                    <>
                                        <span className="text-mac-dim">○</span>
                                        <span className="truncate text-mac-soft">
                                            {m.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-mac-amber">
                                            ●
                                        </span>
                                        <span className="truncate font-bold text-mac-bright">
                                            {m.name}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div
                                className={cn(
                                    'truncate text-[13px]',
                                    m.read_at
                                        ? 'text-mac-muted'
                                        : 'text-[#a3aab4]',
                                )}
                            >
                                {m.body.split('\n')[0]}
                            </div>
                        </Link>
                    ))}
                </Panel>
            </div>
        </AdminLayout>
    );
}
