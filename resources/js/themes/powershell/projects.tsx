import { Link } from '@inertiajs/react';
import { projectsUrl } from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import type { Project, ProjectsProps } from '@/types/portfolio';
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

const types = [
    [null, '*'],
    ['personal', 'Personal'],
    ['work', 'Work'],
] as const;

function Group({
    user,
    folder,
    projects,
}: {
    user: string;
    folder: string;
    projects: Project[];
}) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-xs whitespace-pre text-ps-muted md:text-[13px]">
                {'    '}Directory: C:\Users\{user}\projects\{folder}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                    <PsProjectCard key={p.id} project={p} />
                ))}
            </div>
        </div>
    );
}

export default function PsProjects({
    profile,
    projects,
    skills,
    activeSkill,
    activeType,
}: Omit<ProjectsProps, 'theme'>) {
    const user = psUser(profile.name);
    const chip = (active: boolean) =>
        cn(
            'rounded-[3px] px-2.5 py-px text-[13px]',
            active
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
                    {activeType && `\\${activeType}`} <Arg>-Recurse</Arg>
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

                <div className="flex flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-1 w-14 text-[13px] text-ps-muted">
                            -Type
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
                            <span className="mr-1 w-14 text-[13px] text-ps-muted">
                                -Stack
                            </span>
                            <Link
                                href={projectsUrl(null, activeType)}
                                preserveScroll
                                className={chip(activeSkill === null)}
                            >
                                *
                            </Link>
                            {skills.map((s) => (
                                <Link
                                    key={s}
                                    href={projectsUrl(s, activeType)}
                                    preserveScroll
                                    className={chip(activeSkill === s)}
                                >
                                    {s}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {projects.length === 0 ? (
                    <div className="text-ps-muted">(no items)</div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <Group
                            user={user}
                            folder="personal"
                            projects={projects.filter((p) => !p.experience_id)}
                        />
                        <Group
                            user={user}
                            folder="work"
                            projects={projects.filter((p) => p.experience_id)}
                        />
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
