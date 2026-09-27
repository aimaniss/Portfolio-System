import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { duration, ym } from '@/lib/portfolio';
import {
    btnSmallPrimary,
    confirmed,
    EmptyRow,
    linkBlue,
    linkRed,
    Panel,
} from '@/themes/mac/admin-ui';
import { Chip } from '@/themes/mac/ui';
import type { Experience } from '@/types/portfolio';

export default function Experiences({
    experiences,
}: {
    experiences: Experience[];
}) {
    const destroy = (exp: Experience) => {
        if (confirmed(`rm ${exp.position} @ ${exp.company}?`)) {
            router.delete(`/admin/experiences/${exp.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout
            title="Experiences"
            cwd="~/admin/experiences"
            command="cat experience.log"
            actions={
                <Link
                    href="/admin/experiences/create"
                    className={btnSmallPrimary}
                >
                    + experience
                </Link>
            }
        >
            <Panel head="# newest first" className="overflow-hidden">
                {experiences.length === 0 && (
                    <EmptyRow>
                        cat: experience.log: No such file or directory
                    </EmptyRow>
                )}
                {experiences.map((exp) => (
                    <div
                        key={exp.id}
                        className="flex flex-col gap-2 border-b border-mac-rule px-4 py-4 last:border-b-0 md:grid md:grid-cols-[200px_minmax(0,1fr)_auto] md:gap-6 md:px-5"
                    >
                        <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-start md:gap-1">
                            <span className="text-xs text-mac-muted md:text-[13px]">
                                [{ym(exp.start_date)}] →{' '}
                                {exp.end_date ? `[${ym(exp.end_date)}]` : 'now'}
                            </span>
                            {!exp.end_date && (
                                <span className="rounded border border-mac-green px-1.5 text-[11px] text-mac-green">
                                    ● current
                                </span>
                            )}
                        </div>
                        <div className="flex min-w-0 flex-col gap-1.5">
                            <div className="font-bold text-mac-bright">
                                {exp.position}{' '}
                                <span className="font-medium text-mac-amber">
                                    @ {exp.company}
                                </span>
                                <span className="ml-2 text-xs font-normal text-mac-muted">
                                    {duration(exp.start_date, exp.end_date)}
                                    {!!exp.projects_count &&
                                        ` · ${exp.projects_count} project${exp.projects_count > 1 ? 's' : ''}`}
                                </span>
                            </div>
                            {exp.description && (
                                <div className="line-clamp-2 text-[13px] text-mac-soft">
                                    {exp.description}
                                </div>
                            )}
                            {exp.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {exp.skills.map((s) => (
                                        <Chip key={s.id}>{s.name}</Chip>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 text-[13px] md:justify-end">
                            <Link
                                href={`/admin/experiences/${exp.id}/edit`}
                                className={linkBlue}
                            >
                                edit
                            </Link>
                            <button
                                type="button"
                                onClick={() => destroy(exp)}
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
