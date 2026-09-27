import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Markdown, year } from '@/lib/portfolio';
import type { ProjectShowProps } from '@/types/portfolio';
import { ProShell, proBtnGhost, proBtnPrimary } from './shell';

export default function ProProject({
    profile,
    project,
}: Omit<ProjectShowProps, 'theme'>) {
    const images = project.images ?? [];
    const [active, setActive] = useState(0);
    const current = images[active];

    return (
        <ProShell name={profile.name}>
            <article className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:gap-10 md:px-8 md:py-16">
                <div className="flex flex-col gap-4">
                    <Link
                        href="/projects"
                        className="text-sm text-pro-muted hover:text-pro-ink"
                    >
                        ← All projects
                    </Link>
                    {!project.is_published && (
                        <span className="self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                            Draft — only you can see this
                        </span>
                    )}
                    <h1 className="text-4xl font-semibold tracking-tight break-words md:text-5xl">
                        {project.title}
                    </h1>
                    {project.summary && (
                        <p className="max-w-3xl text-lg leading-relaxed text-pro-soft md:text-xl">
                            {project.summary}
                        </p>
                    )}
                    {(project.github_url || project.live_url) && (
                        <div className="mt-1 flex flex-wrap gap-3">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={proBtnPrimary}
                                >
                                    Visit live site ↗
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={proBtnGhost}
                                >
                                    Source on GitHub ↗
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {current && (
                    <div className="flex flex-col gap-3">
                        <img
                            src={current.url}
                            alt={current.caption ?? project.title}
                            className="max-h-[560px] w-full rounded-2xl border border-pro-line bg-pro-surface object-contain"
                        />
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActive(i)}
                                        aria-label={`Image ${i + 1}`}
                                        className={cn(
                                            'h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 md:h-20 md:w-32',
                                            i === active
                                                ? 'border-pro-accent'
                                                : 'border-transparent opacity-70 hover:opacity-100',
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
                )}

                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
                    <div className="flex flex-col gap-4 text-[17px] leading-relaxed">
                        {project.description ? (
                            <Markdown
                                source={project.description}
                                classes={{
                                    h2: 'mt-6 text-2xl font-semibold tracking-tight first:mt-0',
                                    h3: 'mt-3 text-lg font-semibold',
                                    p: 'text-pro-soft',
                                    ul: 'flex flex-col gap-2',
                                    li: 'flex gap-3 text-pro-soft',
                                    bullet: (
                                        <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-pro-accent" />
                                    ),
                                }}
                            />
                        ) : (
                            <p className="text-pro-muted">
                                More details coming soon.
                            </p>
                        )}
                    </div>

                    <aside className="flex flex-col gap-5 self-start rounded-2xl border border-pro-line bg-pro-surface p-6">
                        {project.role && (
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-semibold tracking-wider text-pro-muted uppercase">
                                    Role
                                </div>
                                <div className="capitalize">{project.role}</div>
                            </div>
                        )}
                        {project.built_at && (
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-semibold tracking-wider text-pro-muted uppercase">
                                    Year
                                </div>
                                <div>{year(project.built_at)}</div>
                            </div>
                        )}
                        {project.skills.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <div className="text-xs font-semibold tracking-wider text-pro-muted uppercase">
                                    Stack
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/projects?skill=${encodeURIComponent(s.name)}`}
                                            className="rounded-full border border-pro-line px-3 py-1 text-[13px] text-pro-soft hover:border-pro-accent hover:text-pro-accent"
                                        >
                                            {s.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </article>
        </ProShell>
    );
}
