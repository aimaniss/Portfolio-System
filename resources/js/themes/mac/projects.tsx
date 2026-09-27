import { Link } from '@inertiajs/react';
import { projectsUrl } from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import type { Project, ProjectsProps } from '@/types/portfolio';
import { ProjectCard, ShellError } from './parts';
import { Cursor, MacShell, Prompt, SectionHead, shellUser } from './ui';

const types = [
    [null, '*'],
    ['personal', 'personal'],
    ['work', 'work'],
] as const;

function Group({ name, projects }: { name: string; projects: Project[] }) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-[13px]">
                <span className="font-bold text-mac-blue">{name}/</span>{' '}
                <span className="text-mac-muted">
                    # {projects.length}{' '}
                    {projects.length === 1 ? 'entry' : 'entries'}
                </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                ))}
            </div>
        </div>
    );
}

export default function MacProjects({
    profile,
    projects,
    skills,
    activeSkill,
    activeType,
}: Omit<ProjectsProps, 'theme'>) {
    const user = shellUser(profile.name);
    const chip = (active: boolean) =>
        cn(
            'rounded px-2 py-0.5 text-xs transition-colors',
            active
                ? 'bg-mac-green text-mac-desktop'
                : 'bg-mac-chip text-[#a3aab4] hover:text-mac-bright',
        );
    const flags = [
        activeType && `--type=${activeType}`,
        activeSkill && `--skill=${activeSkill}`,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <MacShell
            title={`${user} — projects — zsh`}
            user={user}
            owner={profile.name}
        >
            <section className="flex flex-col gap-5 md:gap-7">
                <Link
                    href="/"
                    className="self-start text-[13px] text-mac-blue hover:underline"
                >
                    ← cd ~
                </Link>
                <SectionHead
                    cwd="~/projects"
                    aside={`# ${projects.length} ${projects.length === 1 ? 'entry' : 'entries'}`}
                >
                    ls -la{flags && ` ${flags}`}
                </SectionHead>

                <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 w-14 text-[13px] text-mac-muted">
                            --type
                        </span>
                        {types.map(([type, label]) => (
                            <Link
                                key={label}
                                href={projectsUrl(activeSkill, type)}
                                preserveScroll
                                className={chip(activeType === type)}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                    {skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="mr-1 w-14 text-[13px] text-mac-muted">
                                --skill
                            </span>
                            <Link
                                href={projectsUrl(null, activeType)}
                                preserveScroll
                                className={chip(activeSkill === null)}
                            >
                                *
                            </Link>
                            {skills.map((skill) => (
                                <Link
                                    key={skill}
                                    href={projectsUrl(skill, activeType)}
                                    preserveScroll
                                    className={chip(activeSkill === skill)}
                                >
                                    {skill}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {projects.length === 0 ? (
                    <ShellError>
                        {flags ? `ls: no projects match ${flags}` : 'total 0'}
                    </ShellError>
                ) : (
                    <div className="flex flex-col gap-10">
                        <Group
                            name="personal"
                            projects={projects.filter((p) => !p.experience_id)}
                        />
                        <Group
                            name="work"
                            projects={projects.filter((p) => p.experience_id)}
                        />
                    </div>
                )}
            </section>

            <div className="mt-auto">
                <Prompt cwd="~/projects">
                    <Cursor />
                </Prompt>
            </div>
        </MacShell>
    );
}
