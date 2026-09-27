import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { ProjectsProps } from '@/types/portfolio';
import { Empty, ProProjectCard, ProShell } from './shell';

export default function ProProjects({
    profile,
    projects,
    skills,
    activeSkill,
}: Omit<ProjectsProps, 'theme'>) {
    const chip = (active: boolean) =>
        cn(
            'rounded-full border px-3 py-1 text-[13px] transition-colors',
            active
                ? 'border-pro-accent bg-pro-accent text-white'
                : 'border-pro-line bg-pro-surface text-pro-soft hover:border-pro-muted',
        );

    return (
        <ProShell name={profile.name}>
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:gap-10 md:px-8 md:py-16">
                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="text-sm text-pro-muted hover:text-pro-ink"
                    >
                        ← Home
                    </Link>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                        Projects
                    </h1>
                    <p className="text-lg text-pro-soft">
                        {projects.length} project
                        {projects.length === 1 ? '' : 's'}
                        {activeSkill && (
                            <>
                                {' '}
                                built with{' '}
                                <span className="font-medium text-pro-ink">
                                    {activeSkill}
                                </span>
                            </>
                        )}
                        .
                    </p>
                </div>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/projects"
                            preserveScroll
                            className={chip(!activeSkill)}
                        >
                            All
                        </Link>
                        {skills.map((s) => (
                            <Link
                                key={s}
                                href={`/projects?skill=${encodeURIComponent(s)}`}
                                preserveScroll
                                className={chip(activeSkill === s)}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                )}

                {projects.length === 0 ? (
                    <Empty>No projects match this filter yet.</Empty>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((p) => (
                            <ProProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </div>
        </ProShell>
    );
}
