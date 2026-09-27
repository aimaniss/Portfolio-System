import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { ProjectsProps } from '@/types/portfolio';
import { PsProjectCard } from './parts';
import {
    Arg,
    Cmd,
    PsCursor,
    PsHead,
    PsPrompt,
    PsShell,
    psLink,
    psUser,
} from './ui';

export default function PsProjects({
    profile,
    projects,
    skills,
    activeSkill,
}: Omit<ProjectsProps, 'theme'>) {
    const user = psUser(profile.name);
    const chip = (skill: string | null) =>
        cn(
            'rounded-[3px] px-2.5 py-px text-[13px]',
            activeSkill === skill
                ? 'bg-ps-accent text-ps-accent-ink'
                : 'bg-ps-chip text-ps-chip-text hover:brightness-125',
        );

    return (
        <PsShell user={user} owner={profile.name}>
            <section className="flex flex-col gap-5">
                <Link href="/" className={cn(psLink, 'self-start text-[13px]')}>
                    ← Set-Location ~
                </Link>
                <PsHead
                    aside={`# ${projects.length} item${projects.length === 1 ? '' : 's'}`}
                >
                    <Cmd>Get-ChildItem</Cmd> .\projects
                    {activeSkill && (
                        <>
                            {' '}
                            <Arg>|</Arg> <Cmd>Where-Object</Cmd> Stack{' '}
                            <Arg>-contains</Arg>{' '}
                            <span className="text-ps-chip-text">
                                '{activeSkill}'
                            </span>
                        </>
                    )}
                </PsHead>

                {skills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 text-[13px] text-ps-muted">
                            -Stack
                        </span>
                        <Link
                            href="/projects"
                            preserveScroll
                            className={chip(null)}
                        >
                            *
                        </Link>
                        {skills.map((s) => (
                            <Link
                                key={s}
                                href={`/projects?skill=${encodeURIComponent(s)}`}
                                preserveScroll
                                className={chip(s)}
                            >
                                {s}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-xs whitespace-pre text-ps-muted md:text-[13px]">
                    {'    '}Directory: C:\Users\{user}\projects
                </div>

                {projects.length === 0 ? (
                    <div className="text-ps-muted">(no items)</div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((p) => (
                            <PsProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </section>

            <div className="mt-auto">
                <PsPrompt path="projects">
                    <PsCursor />
                </PsPrompt>
            </div>
        </PsShell>
    );
}
