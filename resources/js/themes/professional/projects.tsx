import { Link } from '@inertiajs/react';
import { projectsUrl } from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import type { Project, ProjectsProps } from '@/types/portfolio';
import { Empty, ProProjectCard, ProShell } from './shell';

const types = [
    [null, 'All'],
    ['personal', 'Personal'],
    ['work', 'Work'],
] as const;

function Group({ title, projects }: { title: string; projects: Project[] }) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-5">
            <h2 className="flex items-baseline gap-3 text-xl font-semibold tracking-tight">
                {title}
                <span className="text-sm font-normal text-pro-muted">
                    {projects.length}
                </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                    <ProProjectCard key={p.id} project={p} />
                ))}
            </div>
        </div>
    );
}

export default function ProProjects({
    profile,
    projects,
    skills,
    activeSkill,
    activeType,
}: Omit<ProjectsProps, 'theme'>) {
    const pill = (active: boolean) =>
        cn(
            'rounded-full border px-3 py-1 text-[13px] transition-colors',
            active
                ? 'border-pro-accent bg-pro-accent text-white'
                : 'border-pro-line bg-pro-surface text-pro-soft hover:border-pro-muted',
        );
    const personal = projects.filter((p) => !p.experience_id);
    const work = projects.filter((p) => p.experience_id);

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
                        Personal side projects and work delivered for employers.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="inline-flex self-start rounded-full border border-pro-line bg-pro-surface p-1">
                        {types.map(([type, label]) => (
                            <Link
                                key={label}
                                href={projectsUrl(activeSkill, type)}
                                preserveScroll
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                                    activeType === type
                                        ? 'bg-pro-ink text-white'
                                        : 'text-pro-soft hover:text-pro-ink',
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={projectsUrl(null, activeType)}
                                preserveScroll
                                className={pill(!activeSkill)}
                            >
                                Any stack
                            </Link>
                            {skills.map((s) => (
                                <Link
                                    key={s}
                                    href={projectsUrl(s, activeType)}
                                    preserveScroll
                                    className={pill(activeSkill === s)}
                                >
                                    {s}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {projects.length === 0 ? (
                    <Empty>No projects match this filter yet.</Empty>
                ) : (
                    <div className="flex flex-col gap-12">
                        <Group title="Personal projects" projects={personal} />
                        <Group title="Work projects" projects={work} />
                    </div>
                )}
            </div>
        </ProShell>
    );
}
