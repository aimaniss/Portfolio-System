import { Link } from '@inertiajs/react';
import { ChevronDown, Download, Github, Linkedin, MapPin } from 'lucide-react';
import { useState } from 'react';
import {
    duration,
    jobProjectsUrl,
    levelLabel,
    monthYear,
} from '@/lib/portfolio';
import { TechIcon, techIcon, techLabel } from '@/lib/tech-icons';
import { cn } from '@/lib/utils';
import type { HomeProps, Skill } from '@/types/portfolio';
import {
    Empty,
    ProContact,
    ProProjectCard,
    ProShell,
    proBtnGhost,
    proBtnPrimary,
    Section,
} from './shell';

/** "5+ | Years experience", "12 | Projects", "18 | Technologies" */
function heroFacts(
    experiences: HomeProps['experiences'],
    projectCount: number,
    categories: HomeProps['categories'],
): [string, string][] {
    const facts: [string, string][] = [];
    const starts = experiences.map((e) => new Date(e.start_date).getTime());

    if (starts.length) {
        const years = Math.floor(
            (Date.now() - Math.min(...starts)) / (365.25 * 24 * 3600 * 1000),
        );
        facts.push([years < 1 ? '<1' : `${years}+`, 'Years experience']);
    }

    if (projectCount) {
        facts.push([String(projectCount), 'Projects']);
    }

    const skills = categories.reduce((n, c) => n + c.skills.length, 0);

    if (skills) {
        facts.push([String(skills), 'Technologies']);
    }

    return facts;
}

const socialPill =
    'inline-flex items-center gap-2 rounded-full border border-pro-line bg-pro-surface px-4 py-2.5 text-[15px] font-medium text-pro-soft transition-colors hover:border-pro-muted hover:text-pro-ink';

/**
 * One tile per logo for the compact view: skills that share a logo
 * (Laravel + Blade, React + React Native) are merged into one tooltip.
 */
function groupByLogo(skills: Skill[]) {
    const tiles = new Map<
        string,
        { key: string; skill: Skill; label: string }
    >();

    for (const s of skills) {
        const key = techIcon(s.name)?.slug ?? `skill-${s.id}`;
        const text = [techLabel(s.name), levelLabel(s.level)]
            .filter(Boolean)
            .join(' · ');
        const tile = tiles.get(key);

        if (tile) {
            tile.label += `, ${text}`;
        } else {
            tiles.set(key, { key, skill: s, label: text });
        }
    }

    return [...tiles.values()];
}

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
    projectCount,
}: Omit<HomeProps, 'theme'>) {
    const facts = heroFacts(experiences, projectCount, categories);
    const [skillsOpen, setSkillsOpen] = useState(false);
    const allSkills = categories
        .flatMap((c) => c.skills)
        .sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
    const logoTiles = groupByLogo(allSkills);

    return (
        <ProShell name={profile.name} onHome>
            {/* hero */}
            <section
                id="about"
                className="scroll-mt-20 border-b border-pro-line bg-pro-surface"
            >
                <div className="mx-auto flex max-w-6xl items-start gap-4 px-5 py-8 sm:gap-7 md:px-8 md:py-12">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="size-16 shrink-0 rounded-2xl object-cover shadow-[0_8px_24px_rgba(22,24,29,0.10)] ring-4 ring-pro-bg sm:size-24 md:size-28"
                        />
                    ) : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pro-accent to-indigo-400 text-xl font-semibold text-white shadow-[0_8px_24px_rgba(36,71,214,0.25)] sm:size-24 sm:text-2xl md:size-28 md:text-3xl">
                            {initials(profile.name)}
                        </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-[34px]">
                                {profile.name}
                            </h1>
                            {profile.headline && (
                                <p className="text-sm font-medium text-pro-accent sm:text-base">
                                    {profile.headline}
                                </p>
                            )}
                            {(profile.location || facts.length > 0) && (
                                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-pro-muted">
                                    {profile.location && (
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="size-3.5" />
                                            {profile.location}
                                        </span>
                                    )}
                                    {facts.map(([value, label], i) => (
                                        <span
                                            key={label}
                                            className="inline-flex items-center gap-2"
                                        >
                                            {(i > 0 || profile.location) && (
                                                <span className="text-pro-line">
                                                    •
                                                </span>
                                            )}
                                            <span>
                                                <span className="font-semibold text-pro-ink">
                                                    {value}
                                                </span>{' '}
                                                {label.toLowerCase()}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {profile.bio && (
                            <p className="max-w-2xl text-[15px] leading-relaxed whitespace-pre-line text-pro-soft">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
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
                                    <Download className="mr-1.5 size-4" />
                                    Résumé
                                </a>
                            )}
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={socialPill}
                                >
                                    <Github className="size-4" />
                                    GitHub
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={socialPill}
                                >
                                    <Linkedin className="size-4" />
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Section
                id="skills"
                eyebrow="Toolkit"
                title="Skills & tools"
                aside={
                    allSkills.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setSkillsOpen((o) => !o)}
                            aria-expanded={skillsOpen}
                            className="inline-flex items-center gap-1.5 rounded-full border border-pro-line bg-pro-surface px-4 py-2 text-sm font-medium text-pro-soft transition-colors hover:border-pro-muted hover:text-pro-ink"
                        >
                            {skillsOpen ? 'Show less' : 'Show details'}
                            <ChevronDown
                                className={cn(
                                    'size-4 transition-transform',
                                    skillsOpen && 'rotate-180',
                                )}
                            />
                        </button>
                    )
                }
            >
                {categories.length === 0 ? (
                    <Empty>Skills will appear here soon.</Empty>
                ) : !skillsOpen ? (
                    <ul className="flex flex-wrap gap-2.5">
                        {logoTiles.map(({ key, skill: s, label }) => {
                            return (
                                <li
                                    key={key}
                                    title={label}
                                    className="group relative flex size-12 items-center justify-center rounded-xl border border-pro-line bg-pro-surface transition hover:-translate-y-0.5 hover:border-pro-accent/30 hover:shadow-[0_6px_18px_rgba(22,24,29,0.08)] md:size-14"
                                >
                                    <TechIcon
                                        name={s.name}
                                        className="size-6 md:size-7"
                                    />
                                    <span className="sr-only">{label}</span>
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-md bg-pro-ink px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        {label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col gap-7">
                        {categories
                            .filter((cat) => cat.skills.length > 0)
                            .map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex flex-col gap-3 lg:grid lg:grid-cols-[140px_minmax(0,1fr)] lg:gap-6"
                                >
                                    <h3 className="text-xs font-semibold tracking-[0.14em] text-pro-muted uppercase lg:pt-2.5">
                                        {cat.name}
                                    </h3>
                                    <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
                                        {[...cat.skills]
                                            .sort(
                                                (a, b) =>
                                                    (b.level ?? 0) -
                                                    (a.level ?? 0),
                                            )
                                            .map((s) => (
                                                <li
                                                    key={s.id}
                                                    className="flex flex-col items-center gap-1.5 rounded-xl border border-pro-line bg-pro-surface px-1.5 py-3 text-center transition hover:-translate-y-0.5 hover:border-pro-accent/30 hover:shadow-[0_8px_24px_rgba(22,24,29,0.06)]"
                                                >
                                                    <TechIcon
                                                        name={s.name}
                                                        className="size-6"
                                                    />
                                                    <span className="text-xs leading-tight font-medium">
                                                        {techLabel(s.name)}
                                                    </span>
                                                    {s.level !== null && (
                                                        <span className="-mt-0.5 text-[10px] text-pro-muted">
                                                            {levelLabel(
                                                                s.level,
                                                            )}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
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
                                <div className="flex items-start gap-3.5">
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-pro-line bg-pro-bg text-base font-semibold text-pro-accent">
                                        {initials(exp.company)}
                                    </span>
                                    <div className="flex min-w-0 flex-col">
                                        <h3 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-lg font-semibold tracking-tight">
                                            {exp.position}
                                            {!exp.end_date && (
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium tracking-normal text-emerald-700">
                                                    Current
                                                </span>
                                            )}
                                        </h3>
                                        <span className="text-[15px] text-pro-accent">
                                            {exp.company}
                                        </span>
                                    </div>
                                </div>
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
                                {(exp.published_projects_count ?? 0) >
                                    (exp.projects?.length ?? 0) && (
                                    <Link
                                        href={jobProjectsUrl(exp.id)}
                                        className="mt-1 self-start text-sm font-medium text-pro-accent hover:underline"
                                    >
                                        View all {exp.published_projects_count}{' '}
                                        projects at {exp.company} →
                                    </Link>
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
