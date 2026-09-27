import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Markdown, year } from '@/lib/portfolio';
import type { ProjectShowProps } from '@/types/portfolio';
import { MacShell, macBtnGhost, Placeholder, Prompt, shellUser } from './ui';

export default function MacProject({
    profile,
    project,
}: Omit<ProjectShowProps, 'theme'>) {
    const user = shellUser(profile.name);
    const images = project.images ?? [];
    const [active, setActive] = useState(0);
    const current = images[active];

    // "press q to go back", like less(1).
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (
                e.key === 'q' &&
                !e.metaKey &&
                !e.ctrlKey &&
                !['INPUT', 'TEXTAREA'].includes(target.tagName)
            ) {
                router.visit('/projects');
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <MacShell
            title={`${user} — projects/${project.slug} — less`}
            user={user}
            footer={
                <div className="flex h-8 items-center gap-5 bg-mac-green px-4 text-xs font-medium text-mac-desktop">
                    <span className="font-extrabold">[portfolio]</span>
                    <span>1:less*</span>
                    <span className="flex-1" />
                    <span className="truncate">
                        © {new Date().getFullYear()} {profile.name}
                    </span>
                </div>
            }
        >
            <div className="flex flex-col gap-6 md:gap-8">
                <div className="break-all">
                    <Prompt cwd="~/projects">
                        cat {project.slug}/README.md
                    </Prompt>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/projects"
                        className="self-start text-[13px] text-mac-blue hover:underline"
                    >
                        ← cd ..
                    </Link>
                    <h1 className="text-3xl leading-tight font-extrabold break-words text-mac-bright md:text-[44px]">
                        <span className="text-mac-muted"># </span>
                        {project.title}
                    </h1>
                    {project.summary && (
                        <p className="max-w-[820px] text-[15px] text-mac-soft md:text-[17px]">
                            {project.summary}
                        </p>
                    )}
                    {(project.github_url || project.live_url) && (
                        <div className="mt-2 flex flex-wrap gap-3">
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(
                                        macBtnGhost,
                                        'border-mac-green text-mac-green',
                                    )}
                                >
                                    $ git clone ↗
                                </a>
                            )}
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={macBtnGhost}
                                >
                                    live demo ↗
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* gallery */}
                <div className="flex flex-col gap-3">
                    {current ? (
                        <img
                            src={current.url}
                            alt={current.caption ?? project.title}
                            className="h-56 w-full rounded-lg border border-mac-line bg-mac-shot object-contain sm:h-80 lg:h-[460px]"
                        />
                    ) : (
                        <Placeholder
                            label="[no screenshots yet]"
                            className="h-40 rounded-lg border border-mac-line md:h-60"
                        />
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
                                        'h-16 overflow-hidden rounded-md bg-mac-shot md:h-24',
                                        i === active
                                            ? 'border-2 border-mac-green'
                                            : 'border border-mac-line hover:border-mac-muted',
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
                                    h2: 'mt-3 text-lg font-bold text-mac-bright first:mt-0 md:text-xl',
                                    h3: 'mt-2 font-bold text-mac-bright',
                                    headingPrefix: (
                                        <span className="text-mac-muted">
                                            ##{' '}
                                        </span>
                                    ),
                                    p: 'text-mac-soft',
                                    ul: 'flex flex-col gap-1',
                                    li: 'flex gap-2 text-mac-soft',
                                    bullet: (
                                        <span className="text-mac-green">
                                            -
                                        </span>
                                    ),
                                }}
                            />
                        ) : (
                            <div className="text-mac-muted">
                                README.md is empty.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 self-start rounded-lg border border-mac-line bg-mac-panel p-5">
                        <div className="text-[13px] text-mac-muted">
                            $ stat {project.slug}
                        </div>
                        <div className="flex flex-col gap-1 text-sm">
                            {project.role && (
                                <div>
                                    <span className="text-mac-amber">
                                        role:
                                    </span>{' '}
                                    {project.role}
                                </div>
                            )}
                            <div>
                                <span className="text-mac-amber">type:</span>{' '}
                                {project.experience ? (
                                    <>
                                        work @{' '}
                                        <Link
                                            href="/#experience"
                                            className="text-mac-blue hover:underline"
                                        >
                                            {project.experience.company}
                                        </Link>
                                    </>
                                ) : (
                                    'personal'
                                )}
                            </div>
                            {project.built_at && (
                                <div>
                                    <span className="text-mac-amber">
                                        year:
                                    </span>{' '}
                                    {year(project.built_at)}
                                </div>
                            )}
                            <div>
                                <span className="text-mac-amber">status:</span>{' '}
                                {project.is_published ? (
                                    <span className="text-mac-green">
                                        ● published
                                    </span>
                                ) : (
                                    <span className="text-mac-amber">
                                        ○ draft (only you can see this)
                                    </span>
                                )}
                            </div>
                        </div>
                        {project.skills.length > 0 && (
                            <>
                                <div className="text-[13px] text-mac-muted">
                                    stack:
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.skills.map((s) => (
                                        <Link
                                            key={s.id}
                                            href={`/projects?skill=${encodeURIComponent(s.name)}`}
                                            className="rounded border border-mac-line px-2 py-0.5 text-xs text-[#a3aab4] hover:border-mac-muted hover:text-mac-bright"
                                        >
                                            {s.name}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="self-start bg-mac-text px-1.5 text-[13px] text-mac-bg">
                    README.md (END) — press q to go back
                </div>
            </div>
        </MacShell>
    );
}
