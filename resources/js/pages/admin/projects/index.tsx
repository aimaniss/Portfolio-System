import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { year } from '@/lib/portfolio';
import {
    btnSmallPrimary,
    confirmed,
    EmptyRow,
    linkBlue,
    linkRed,
    Panel,
    StatusDot,
} from '@/themes/mac/admin-ui';
import { Placeholder } from '@/themes/mac/ui';
import type { Project } from '@/types/portfolio';

export default function Projects({ projects }: { projects: Project[] }) {
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
            title="Projects"
            cwd="~/admin/projects"
            command="ls -l projects/"
            actions={
                <Link href="/admin/projects/create" className={btnSmallPrimary}>
                    + new project
                </Link>
            }
        >
            <Panel
                head={`# ${projects.length} total · sorted by sort_order, then newest`}
                className="overflow-hidden"
            >
                {projects.length === 0 && (
                    <EmptyRow>total 0 — create your first project.</EmptyRow>
                )}
                {projects.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center gap-3 border-b border-mac-rule px-4 py-3 last:border-b-0 md:gap-5 md:px-5"
                    >
                        {p.cover ? (
                            <img
                                src={p.cover.url}
                                alt=""
                                className="h-12 w-18 shrink-0 rounded border border-mac-line object-cover md:h-14 md:w-22"
                            />
                        ) : (
                            <Placeholder
                                label="—"
                                className="h-12 w-18 shrink-0 rounded border border-mac-line md:h-14 md:w-22"
                            />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <Link
                                href={`/admin/projects/${p.id}/edit`}
                                className="truncate font-bold text-mac-blue hover:underline"
                            >
                                {p.slug}/
                            </Link>
                            <div className="truncate text-xs text-mac-muted">
                                {[
                                    year(p.built_at),
                                    p.skills.map((s) => s.name).join(', '),
                                ]
                                    .filter(Boolean)
                                    .join(' · ') || '—'}
                            </div>
                        </div>
                        <div className="hidden shrink-0 flex-col items-end gap-0.5 text-[13px] sm:flex">
                            <StatusDot published={p.is_published} />
                            {p.is_featured && (
                                <span className="text-xs text-mac-amber">
                                    ★ featured
                                </span>
                            )}
                        </div>
                        <div className="flex shrink-0 gap-3 text-[13px]">
                            <a
                                href={`/projects/${p.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-mac-muted hover:text-mac-text"
                            >
                                view
                            </a>
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
                        </div>
                    </div>
                ))}
            </Panel>
        </AdminLayout>
    );
}
