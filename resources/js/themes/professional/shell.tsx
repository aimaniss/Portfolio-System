import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { cn } from '@/lib/utils';
import { useContactForm, year } from '@/lib/portfolio';
import type { Profile, Project } from '@/types/portfolio';

const sections = [
    ['about', 'About'],
    ['skills', 'Skills'],
    ['experience', 'Experience'],
    ['projects', 'Projects'],
    ['contact', 'Contact'],
] as const;

/** Anchor links point at the home page so they work from every page. */
export function ProShell({
    name,
    onHome = false,
    children,
}: {
    name: string;
    onHome?: boolean;
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);

    useFlashToast();

    const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

    return (
        <div className="min-h-screen scroll-smooth bg-pro-bg font-pro text-pro-ink antialiased">
            <header className="sticky top-0 z-20 border-b border-pro-line bg-pro-bg/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:px-8">
                    <Link
                        href="/"
                        className="text-[17px] font-semibold tracking-tight"
                    >
                        {name}
                    </Link>
                    <span className="flex-1" />
                    <nav className="hidden items-center gap-7 text-sm text-pro-soft md:flex">
                        {sections.map(([id, label]) =>
                            id === 'projects' && !onHome ? (
                                <Link
                                    key={id}
                                    href="/projects"
                                    className="hover:text-pro-ink"
                                >
                                    {label}
                                </Link>
                            ) : (
                                <a
                                    key={id}
                                    href={href(id)}
                                    className="hover:text-pro-ink"
                                >
                                    {label}
                                </a>
                            ),
                        )}
                    </nav>
                    <a
                        href={href('contact')}
                        className="hidden rounded-full bg-pro-ink px-4 py-2 text-sm font-medium text-white hover:bg-pro-soft md:inline-flex"
                    >
                        Get in touch
                    </a>
                    <button
                        type="button"
                        aria-label="Menu"
                        onClick={() => setOpen((o) => !o)}
                        className="flex size-10 items-center justify-center rounded-full text-pro-soft hover:bg-pro-line/60 md:hidden"
                    >
                        {open ? (
                            <X className="size-5" />
                        ) : (
                            <Menu className="size-5" />
                        )}
                    </button>
                </div>
                {open && (
                    <nav className="flex flex-col border-t border-pro-line px-5 py-2 md:hidden">
                        {sections.map(([id, label]) => (
                            <a
                                key={id}
                                href={href(id)}
                                onClick={() => setOpen(false)}
                                className="py-3 text-[15px] text-pro-soft"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            <main>{children}</main>

            <footer className="border-t border-pro-line">
                <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-8 text-sm text-pro-muted sm:flex-row md:px-8">
                    <span>
                        © {new Date().getFullYear()} {name}
                    </span>
                    <span className="flex-1" />
                    <span>Built with Laravel & Inertia</span>
                </div>
            </footer>
        </div>
    );
}

export function Section({
    id,
    eyebrow,
    title,
    aside,
    children,
    className,
}: {
    id?: string;
    eyebrow: string;
    title: string;
    aside?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            id={id}
            className={cn('scroll-mt-20 py-14 md:py-20', className)}
        >
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:gap-10 md:px-8">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-semibold tracking-[0.14em] text-pro-accent uppercase">
                            {eyebrow}
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                            {title}
                        </h2>
                    </div>
                    <span className="flex-1" />
                    {aside}
                </div>
                {children}
            </div>
        </section>
    );
}

export function ProChip({
    children,
    active = false,
}: {
    children: ReactNode;
    active?: boolean;
}) {
    return (
        <span
            className={cn(
                'rounded-full border px-3 py-1 text-[13px]',
                active
                    ? 'border-pro-accent bg-pro-accent text-white'
                    : 'border-pro-line bg-pro-surface text-pro-soft',
            )}
        >
            {children}
        </span>
    );
}

export function Empty({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-2xl border border-dashed border-pro-line px-6 py-10 text-center text-pro-muted">
            {children}
        </div>
    );
}

export function ProProjectCard({ project }: { project: Project }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-pro-line bg-pro-surface transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(22,24,29,0.08)]"
        >
            {project.cover ? (
                <img
                    src={project.cover.url}
                    alt={project.title}
                    loading="lazy"
                    className="aspect-[16/10] w-full bg-pro-line/40 object-cover"
                />
            ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-pro-accent-soft text-3xl font-semibold text-pro-accent/60">
                    {project.title.slice(0, 1).toUpperCase()}
                </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-pro-accent">
                        {project.title}
                    </h3>
                    <span className="flex-1" />
                    {project.built_at && (
                        <span className="text-sm text-pro-muted">
                            {year(project.built_at)}
                        </span>
                    )}
                </div>
                {project.summary && (
                    <p className="text-[15px] leading-relaxed text-pro-soft">
                        {project.summary}
                    </p>
                )}
                {project.skills.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                        {project.skills.map((s) => (
                            <span
                                key={s.id}
                                className="rounded-md bg-pro-bg px-2 py-0.5 text-xs text-pro-muted"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

export const proBtnPrimary =
    'inline-flex items-center justify-center rounded-full bg-pro-accent px-5 py-2.5 text-[15px] font-medium text-white hover:brightness-110 disabled:opacity-60';
export const proBtnGhost =
    'inline-flex items-center justify-center rounded-full border border-pro-line bg-pro-surface px-5 py-2.5 text-[15px] font-medium text-pro-ink hover:border-pro-muted';
const proInput =
    'w-full rounded-xl border border-pro-line bg-pro-surface px-4 py-3 text-[15px] text-pro-ink placeholder:text-pro-muted/70 focus:border-pro-accent focus:ring-4 focus:ring-pro-accent-soft focus:outline-none';

function ProError({ message }: { message?: string }) {
    return message ? <p className="text-sm text-red-600">{message}</p> : null;
}

export function ProContact({
    profile,
}: {
    profile: Pick<Profile, 'email' | 'github_url' | 'linkedin_url'>;
}) {
    const { form, submit } = useContactForm();

    return (
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-14">
            <div className="flex flex-col gap-4">
                <p className="text-lg leading-relaxed text-pro-soft">
                    Have a project or a role in mind? Send a message and I'll
                    get back to you.
                </p>
                <div className="flex flex-col gap-2 text-[15px]">
                    {profile.email && (
                        <a
                            href={`mailto:${profile.email}`}
                            className="text-pro-accent hover:underline"
                        >
                            {profile.email}
                        </a>
                    )}
                    {profile.github_url && (
                        <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pro-soft hover:text-pro-ink"
                        >
                            GitHub ↗
                        </a>
                    )}
                    {profile.linkedin_url && (
                        <a
                            href={profile.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-pro-soft hover:text-pro-ink"
                        >
                            LinkedIn ↗
                        </a>
                    )}
                </div>
            </div>
            <form
                onSubmit={submit}
                className="flex flex-col gap-4 rounded-2xl border border-pro-line bg-pro-surface p-5 md:p-7"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                        Name
                        <input
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="Your name"
                            required
                            className={proInput}
                        />
                        <ProError message={form.errors.name} />
                    </label>
                    <label className="flex flex-col gap-1.5 text-sm font-medium">
                        Email
                        <input
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            placeholder="you@company.com"
                            required
                            className={proInput}
                        />
                        <ProError message={form.errors.email} />
                    </label>
                </div>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                    Message
                    <textarea
                        rows={5}
                        value={form.data.body}
                        onChange={(e) => form.setData('body', e.target.value)}
                        placeholder="Tell me a little about what you have in mind…"
                        required
                        className={cn(proInput, 'resize-y')}
                    />
                    <ProError message={form.errors.body} />
                </label>
                <div>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className={cn(proBtnPrimary, 'w-full sm:w-auto')}
                    >
                        {form.processing ? 'Sending…' : 'Send message'}
                    </button>
                </div>
            </form>
        </div>
    );
}
