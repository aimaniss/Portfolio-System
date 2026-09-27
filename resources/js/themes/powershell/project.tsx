import { Link } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Markdown, year } from '@/lib/portfolio';
import type { ProjectShowProps } from '@/types/portfolio';
import {
    Arg,
    Cmd,
    PsCursor,
    PsList,
    PsPrompt,
    PsShell,
    psBtnGhost,
    psBtnPrimary,
    psLink,
    psUser,
} from './ui';

export default function PsProject({
    profile,
    project,
}: Omit<ProjectShowProps, 'theme'>) {
    const user = psUser(profile.name);
    const images = project.images ?? [];
    const [active, setActive] = useState(0);
    const current = images[active];

    const rows: [string, ReactNode][] = [];

    if (project.role) {
        rows.push(['Role', project.role]);
    }

    if (project.built_at) {
        rows.push(['Year', year(project.built_at)]);
    }

    rows.push([
        'Status',
        project.is_published ? (
            <span key="s" className="text-ps-green">
                Published
            </span>
        ) : (
            <span key="s" className="text-ps-yellow">
                Draft (only you can see this)
            </span>
        ),
    ]);

    if (project.skills.length) {
        rows.push([
            'Stack',
            <span key="st" className="text-ps-chip-text">
                {'{'}
                {project.skills.map((s, i) => (
                    <span key={s.id}>
                        {i > 0 && ', '}
                        <Link
                            href={`/projects?skill=${encodeURIComponent(s.name)}`}
                            className="hover:underline"
                        >
                            {s.name}
                        </Link>
                    </span>
                ))}
                {'}'}
            </span>,
        ]);
    }

    return (
        <PsShell user={user} owner={profile.name}>
            <div className="flex flex-col gap-6 md:gap-8">
                <PsPrompt path="projects">
                    <Cmd>Get-Content</Cmd> .\{project.slug}\README.md
                </PsPrompt>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/projects"
                        className={cn(psLink, 'self-start text-[13px]')}
                    >
                        ← Set-Location ..
                    </Link>
                    <h1 className="text-3xl leading-tight font-bold break-words text-white md:text-[44px]">
                        <span className="text-ps-muted"># </span>
                        {project.title}
                    </h1>
                    {project.summary && (
                        <p className="max-w-[820px] text-[15px] text-ps-soft md:text-[17px]">
                            {project.summary}
                        </p>
                    )}
                    {(project.github_url || project.live_url) && (
                        <div className="mt-2 flex flex-wrap gap-2.5">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={psBtnPrimary}
                                >
                                    git clone ↗
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={psBtnGhost}
                                >
                                    Start-Process live ↗
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {current ? (
                        <img
                            src={current.url}
                            alt={current.caption ?? project.title}
                            className="h-56 w-full rounded-md border border-ps-line bg-ps-shot object-contain sm:h-80 lg:h-[460px]"
                        />
                    ) : (
                        <div className="flex h-40 items-center justify-center rounded-md border border-ps-line bg-ps-shot text-xs text-ps-muted md:h-60">
                            [no screenshots yet]
                        </div>
                    )}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 md:gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={img.id}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    aria-label={`Screenshot ${i + 1}`}
                                    className={cn(
                                        'h-16 overflow-hidden rounded bg-ps-shot md:h-24',
                                        i === active
                                            ? 'border-2 border-ps-accent'
                                            : 'border border-ps-line hover:border-ps-muted',
                                    )}
                                >
                                    <img
                                        src={img.url}
                                        alt=""
                                        loading="lazy"
                                        className="size-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
                    <div className="flex flex-col gap-3 lg:col-span-2">
                        {project.description ? (
                            <Markdown
                                source={project.description}
                                classes={{
                                    h2: 'mt-3 text-lg font-bold text-white first:mt-0 md:text-xl',
                                    h3: 'mt-2 font-bold text-white',
                                    headingPrefix: (
                                        <span className="text-ps-muted">
                                            ##{' '}
                                        </span>
                                    ),
                                    p: 'text-ps-soft',
                                    ul: 'flex flex-col gap-1',
                                    li: 'flex gap-2 text-ps-soft',
                                    bullet: (
                                        <span className="text-ps-accent">
                                            •
                                        </span>
                                    ),
                                }}
                            />
                        ) : (
                            <div className="text-ps-muted">
                                README.md is empty.
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3 self-start rounded-md border border-t-2 border-ps-rule border-t-ps-accent bg-ps-panel p-5 text-sm">
                        <div className="text-[13px] text-ps-muted">
                            <Cmd>Get-Item</Cmd> .\{project.slug} <Arg>|</Arg>{' '}
                            <Cmd>Format-List</Cmd>
                        </div>
                        <PsList
                            rows={rows}
                            keyWidth="grid-cols-[64px_minmax(0,1fr)]"
                        />
                    </div>
                </div>

                <div>
                    <PsPrompt path="projects">
                        <PsCursor />
                    </PsPrompt>
                </div>
            </div>
        </PsShell>
    );
}
