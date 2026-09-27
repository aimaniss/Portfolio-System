import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { useContactForm, ym } from '@/lib/portfolio';
import type { Profile, Project } from '@/types/portfolio';
import { PsError, psBtnPrimary, psInput, psLabel, psLink, PsList } from './ui';

export function PsProjectCard({ project }: { project: Project }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group flex flex-col overflow-hidden rounded-md border border-ps-rule bg-ps-panel text-ps-text transition-colors hover:border-ps-line"
        >
            {project.cover ? (
                <img
                    src={project.cover.url}
                    alt={project.title}
                    loading="lazy"
                    className="h-44 w-full bg-ps-shot object-cover md:h-[190px]"
                />
            ) : (
                <div className="flex h-44 items-center justify-center bg-ps-shot text-xs text-ps-muted md:h-[190px]">
                    [no screenshot]
                </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-4 md:p-[18px]">
                <div className="text-xs text-ps-muted">
                    d----&nbsp;&nbsp;&nbsp;{ym(project.built_at) || '----'}
                </div>
                <div className="text-[15px] font-bold text-ps-blue group-hover:underline md:text-[17px]">
                    {project.slug}
                </div>
                {project.summary && (
                    <div className="text-[13px] text-ps-soft md:text-sm">
                        {project.summary}
                    </div>
                )}
                {project.skills.length > 0 && (
                    <div className="mt-auto pt-1.5 text-[13px] text-ps-chip-text">
                        {`{${project.skills.map((s) => s.name).join(', ')}}`}
                    </div>
                )}
            </div>
        </Link>
    );
}

export function PsContact({
    profile,
}: {
    profile: Pick<Profile, 'email' | 'github_url'>;
}) {
    const { form, submit } = useContactForm();
    const links: [string, ReactNode][] = [];

    if (profile.email) {
        links.push([
            'Email',
            <a key="e" href={`mailto:${profile.email}`} className={psLink}>
                {profile.email}
            </a>,
        ]);
    }

    if (profile.github_url) {
        links.push([
            'GitHub',
            <a
                key="g"
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className={psLink}
            >
                {profile.github_url.replace(/^https?:\/\//, '')}
            </a>,
        ]);
    }

    return (
        <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:gap-14 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="flex flex-col gap-3">
                <div className="text-lg font-bold text-white md:text-xl">
                    Let's build something.
                </div>
                <div className="text-ps-soft">
                    Have a project or a role in mind? Send a message, or reach
                    me directly.
                </div>
                {links.length > 0 && (
                    <PsList
                        rows={links}
                        keyWidth="grid-cols-[70px_minmax(0,1fr)]"
                        className="mt-2 text-sm"
                    />
                )}
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="w-name" className={psLabel}>
                            Name:
                        </label>
                        <input
                            id="w-name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="your name"
                            required
                            className={psInput}
                        />
                        <PsError message={form.errors.name} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="w-email" className={psLabel}>
                            Email:
                        </label>
                        <input
                            id="w-email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            placeholder="you@domain.com"
                            required
                            className={psInput}
                        />
                        <PsError message={form.errors.email} />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="w-msg" className={psLabel}>
                        Message:
                    </label>
                    <textarea
                        id="w-msg"
                        rows={4}
                        value={form.data.body}
                        onChange={(e) => form.setData('body', e.target.value)}
                        placeholder="hello..."
                        required
                        className={`${psInput} resize-y`}
                    />
                    <PsError message={form.errors.body} />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className={`${psBtnPrimary} w-full sm:w-auto`}
                    >
                        {form.processing ? 'Sending…' : 'Send ↵'}
                    </button>
                </div>
            </form>
        </div>
    );
}
