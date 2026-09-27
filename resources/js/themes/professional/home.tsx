import { Link } from '@inertiajs/react';
import { duration, monthYear } from '@/lib/portfolio';
import type { HomeProps } from '@/types/portfolio';
import {
    Empty,
    ProChip,
    ProContact,
    ProProjectCard,
    ProShell,
    proBtnGhost,
    proBtnPrimary,
    Section,
} from './shell';

function initials(name: string): string {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');
}

export default function ProHome({
    profile,
    categories,
    experiences,
    projects,
}: Omit<HomeProps, 'theme'>) {
    return (
        <ProShell name={profile.name} onHome>
            {/* hero */}
            <section
                id="about"
                className="scroll-mt-20 border-b border-pro-line"
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:gap-14 md:px-8 md:py-24">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="size-28 shrink-0 rounded-full object-cover ring-4 ring-pro-surface md:order-2 md:size-56"
                        />
                    ) : (
                        <div className="flex size-28 shrink-0 items-center justify-center rounded-full bg-pro-accent-soft text-3xl font-semibold text-pro-accent md:order-2 md:size-56 md:text-6xl">
                            {initials(profile.name)}
                        </div>
                    )}
                    <div className="flex flex-1 flex-col gap-5">
                        {profile.location && (
                            <div className="flex items-center gap-2 text-sm text-pro-muted">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                {profile.location}
                            </div>
                        )}
                        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl">
                            {profile.name}
                        </h1>
                        {profile.headline && (
                            <p className="text-lg text-pro-accent md:text-xl">
                                {profile.headline}
                            </p>
                        )}
                        {profile.bio && (
                            <p className="max-w-2xl text-base leading-relaxed whitespace-pre-line text-pro-soft md:text-lg">
                                {profile.bio}
                            </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3">
                            <a href="#contact" className={proBtnPrimary}>
                                Get in touch
                            </a>
                            {profile.resume_url && (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={proBtnGhost}
                                >
                                    Download résumé
                                </a>
                            )}
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={proBtnGhost}
                                >
                                    GitHub
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={proBtnGhost}
                                >
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Section id="skills" eyebrow="Toolkit" title="Skills">
                {categories.length === 0 ? (
                    <Empty>Skills will appear here soon.</Empty>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((cat) => {
                            const rated = cat.skills.filter(
                                (s) => s.level !== null,
                            );
                            const plain = cat.skills.filter(
                                (s) => s.level === null,
                            );

                            return (
                                <div
                                    key={cat.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-pro-line bg-pro-surface p-5 md:p-6"
                                >
                                    <div className="text-sm font-semibold capitalize">
                                        {cat.name}
                                    </div>
                                    {cat.skills.length === 0 && (
                                        <span className="text-sm text-pro-muted">
                                            —
                                        </span>
                                    )}
                                    {rated.map((s) => (
                                        <div
                                            key={s.id}
                                            className="flex flex-col gap-1.5"
                                        >
                                            <div className="flex items-baseline justify-between text-sm">
                                                <span className="text-pro-soft">
                                                    {s.name}
                                                </span>
                                                <span className="text-xs text-pro-muted tabular-nums">
                                                    {s.level}%
                                                </span>
                                            </div>
                                            <div
                                                role="meter"
                                                aria-label={s.name}
                                                aria-valuenow={s.level ?? 0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                className="h-1.5 overflow-hidden rounded-full bg-pro-accent-soft"
                                            >
                                                <div
                                                    className="h-full rounded-full bg-pro-accent"
                                                    style={{
                                                        width: `${s.level}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {plain.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {plain.map((s) => (
                                                <ProChip key={s.id}>
                                                    {s.name}
                                                </ProChip>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Section>

            <Section
                id="experience"
                eyebrow="Career"
                title="Experience"
                className="border-y border-pro-line bg-pro-surface"
            >
                {experiences.length === 0 ? (
                    <Empty>No experience listed yet.</Empty>
                ) : (
                    <ol className="relative flex flex-col gap-10 border-l border-pro-line pl-6 md:ml-[200px] md:pl-10">
                        {experiences.map((exp) => (
                            <li
                                key={exp.id}
                                className="relative flex flex-col gap-2"
                            >
                                <span
                                    className={
                                        exp.end_date
                                            ? 'absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-pro-line bg-pro-surface md:-left-[47px]'
                                            : 'absolute top-1.5 -left-[31px] size-3 rounded-full bg-pro-accent ring-4 ring-pro-accent-soft md:-left-[47px]'
                                    }
                                />
                                <div className="text-sm text-pro-muted md:absolute md:top-0.5 md:-left-[240px] md:w-[170px] md:text-right">
                                    {monthYear(exp.start_date)} —{' '}
                                    {exp.end_date
                                        ? monthYear(exp.end_date)
                                        : 'Present'}
                                    <div className="text-xs text-pro-muted/80">
                                        {duration(exp.start_date, exp.end_date)}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold tracking-tight">
                                    {exp.position}{' '}
                                    <span className="font-normal text-pro-muted">
                                        ·
                                    </span>{' '}
                                    <span className="text-pro-accent">
                                        {exp.company}
                                    </span>
                                </h3>
                                {exp.description && (
                                    <p className="max-w-3xl leading-relaxed whitespace-pre-line text-pro-soft">
                                        {exp.description}
                                    </p>
                                )}
                                {exp.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {exp.skills.map((s) => (
                                            <span
                                                key={s.id}
                                                className="rounded-md bg-pro-bg px-2 py-0.5 text-xs text-pro-muted"
                                            >
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {!!exp.projects?.length && (
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {exp.projects.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/projects/${p.slug}`}
                                                className="group flex flex-col rounded-xl border border-pro-line bg-pro-bg px-4 py-3 transition-colors hover:border-pro-accent"
                                            >
                                                <span className="text-sm font-medium group-hover:text-pro-accent">
                                                    {p.title} →
                                                </span>
                                                {p.summary && (
                                                    <span className="line-clamp-1 text-xs text-pro-muted">
                                                        {p.summary}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </Section>

            <Section
                id="projects"
                eyebrow="Side projects"
                title="Personal projects"
                aside={
                    <Link
                        href="/projects"
                        className="text-[15px] font-medium text-pro-accent hover:underline"
                    >
                        View all projects →
                    </Link>
                }
            >
                {projects.length === 0 ? (
                    <Empty>Featured projects will appear here soon.</Empty>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((p) => (
                            <ProProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </Section>

            <Section
                id="contact"
                eyebrow="Contact"
                title="Let's work together"
                className="border-t border-pro-line"
            >
                <ProContact profile={profile} />
            </Section>
        </ProShell>
    );
}
