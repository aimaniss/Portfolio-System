import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useContactForm } from '@/lib/portfolio';
import type { Profile, Project } from '@/types/portfolio';
import {
    Chip,
    FieldError,
    macBtnPrimary,
    macInput,
    macLabel,
    Placeholder,
} from './ui';

/** A shell error line, used for empty states. */
export function ShellError({ children }: { children: ReactNode }) {
    return <div className="text-mac-muted">{children}</div>;
}

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group flex flex-col overflow-hidden rounded-[10px] border border-mac-rule bg-mac-panel text-mac-text transition-colors hover:border-mac-line"
        >
            {project.cover ? (
                <img
                    src={project.cover.url}
                    alt={project.title}
                    loading="lazy"
                    className="h-44 w-full bg-mac-shot object-cover md:h-[190px]"
                />
            ) : (
                <Placeholder
                    label="[no screenshot]"
                    className="h-44 md:h-[190px]"
                />
            )}
            <div className="flex flex-1 flex-col gap-2.5 p-4 md:p-5">
                <div className="text-[15px] font-bold text-mac-blue group-hover:underline md:text-[17px]">
                    {project.slug}/
                </div>
                {project.summary && (
                    <div className="text-[13px] text-mac-soft md:text-sm">
                        {project.summary}
                    </div>
                )}
                {project.skills.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
                        {project.skills.map((s) => (
                            <Chip key={s.id}>{s.name}</Chip>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

type ContactProfile = Pick<Profile, 'email' | 'github_url'>;

export function ContactBlock({ profile }: { profile: ContactProfile }) {
    const { form, submit } = useContactForm();

    return (
        <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:gap-14 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="flex flex-col gap-3.5">
                <div className="text-lg font-bold text-mac-bright md:text-xl">
                    Let's build something.
                </div>
                <div className="text-mac-soft">
                    Have a project or a role in mind? Send a message, or reach
                    me directly.
                </div>
                <div className="mt-2 flex flex-col gap-1.5 text-sm">
                    {profile.email && (
                        <div className="truncate">
                            <span className="text-mac-muted">email </span>{' '}
                            <a
                                href={`mailto:${profile.email}`}
                                className="text-mac-blue hover:underline"
                            >
                                {profile.email}
                            </a>
                        </div>
                    )}
                    {profile.github_url && (
                        <div className="truncate">
                            <span className="text-mac-muted">github</span>{' '}
                            <a
                                href={profile.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-mac-blue hover:underline"
                            >
                                {profile.github_url.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="c-name" className={macLabel}>
                            ? name
                        </label>
                        <input
                            id="c-name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="your name"
                            required
                            className={macInput}
                        />
                        <FieldError message={form.errors.name} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="c-email" className={macLabel}>
                            ? email
                        </label>
                        <input
                            id="c-email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            placeholder="you@domain.com"
                            required
                            className={macInput}
                        />
                        <FieldError message={form.errors.email} />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-msg" className={macLabel}>
                        ? message
                    </label>
                    <textarea
                        id="c-msg"
                        rows={4}
                        value={form.data.body}
                        onChange={(e) => form.setData('body', e.target.value)}
                        placeholder="hello..."
                        required
                        className={`${macInput} resize-y`}
                    />
                    <FieldError message={form.errors.body} />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className={`${macBtnPrimary} w-full sm:w-auto`}
                    >
                        {form.processing ? 'sending…' : 'send ↵'}
                    </button>
                </div>
            </form>
        </div>
    );
}
