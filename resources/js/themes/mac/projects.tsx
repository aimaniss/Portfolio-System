import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { ProjectsProps } from '@/types/portfolio';
import { ProjectCard, ShellError } from './parts';
import { Cursor, MacShell, Prompt, SectionHead, shellUser } from './ui';

export default function MacProjects({
    profile,
    projects,
    skills,
    activeSkill,
}: Omit<ProjectsProps, 'theme'>) {
    const user = shellUser(profile.name);
    const filter = (skill: string | null) =>
        cn(
            'rounded px-2 py-0.5 text-xs transition-colors',
            activeSkill === skill
                ? 'bg-mac-green text-mac-desktop'
                : 'bg-mac-chip text-[#a3aab4] hover:text-mac-bright',
        );

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
                    ls -la{activeSkill ? ` --skill=${activeSkill}` : ''}
                </SectionHead>

                {skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-[13px] text-mac-muted">
                            --skill
                        </span>
                        <Link
                            href="/projects"
                            preserveScroll
                            className={filter(null)}
                        >
                            *
                        </Link>
                        {skills.map((skill) => (
                            <Link
                                key={skill}
                                href={`/projects?skill=${encodeURIComponent(skill)}`}
                                preserveScroll
                                className={filter(skill)}
                            >
                                {skill}
                            </Link>
                        ))}
                    </div>
                )}

                {projects.length === 0 ? (
                    <ShellError>
                        {activeSkill
                            ? `ls: no projects match --skill=${activeSkill}`
                            : 'total 0'}
                    </ShellError>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
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
