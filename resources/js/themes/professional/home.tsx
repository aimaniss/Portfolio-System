import { Link } from '@inertiajs/react';
import {
    Code,
    Container,
    Database,
    Download,
    Github,
    Layers,
    Linkedin,
    MapPin,
    Monitor,
    Server,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    duration,
    jobProjectsUrl,
    levelLabel,
    monthYear,
} from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import type { HomeProps } from '@/types/portfolio';
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
        facts.push([years < 1 ? '<1' : `${years}+`, 'years experience']);
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

const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
    [/lang/i, Code],
    [/front|ui|web|mobile/i, Monitor],
    [/back|api|server/i, Server],
    [/data|db|sql/i, Database],
    [/devops|cloud|infra|ops/i, Container],
];

function categoryIcon(name: string): LucideIcon {
    return CATEGORY_ICONS.find(([re]) => re.test(name))?.[1] ?? Layers;
}

/** Chip style per tier: expert solid, advanced tinted, the rest outlined. */
function skillTone(level: number | null): { chip: string; dot: string } {
    if (level === 4) {
        return { chip: 'bg-pro-accent text-white', dot: 'bg-pro-accent' };
    }

    if (level === 3) {
        return {
            chip: 'bg-pro-accent-soft text-pro-accent',
            dot: 'bg-pro-accent-soft ring-1 ring-pro-accent/30',
        };
    }

    return {
        chip: 'border border-pro-line bg-pro-surface text-pro-soft',
        dot: 'border border-pro-muted/50 bg-pro-surface',
    };
}

const LEGEND: [number | null, string][] = [
    [4, 'Expert'],
    [3, 'Advanced'],
    [2, 'Intermediate / beginner'],
];

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

    return (
        <ProShell name={profile.name} onHome>
            {/* hero */}
            <section
                id="about"
                className="scroll-mt-20 border-b border-pro-line"
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:px-8 md:py-16">
                    <div className="flex items-center gap-4 md:gap-5">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.name}
                                className="size-16 shrink-0 rounded-full object-cover ring-1 ring-pro-line md:size-20"
                            />
                        ) : (
                            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-pro-accent-soft text-lg font-semibold text-pro-accent md:size-20 md:text-xl">
                                {initials(profile.name)}
                            </div>
                        )}
                        <div className="flex min-w-0 flex-col gap-1">
                            <h1 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                                {profile.name}
                            </h1>
                            {profile.headline && (
                                <p className="text-[15px] text-pro-soft md:text-base">
                                    {profile.headline}
                                </p>
                            )}
                        </div>
                    </div>

                    {profile.bio && (
                        <p className="max-w-2xl leading-relaxed whitespace-pre-line text-pro-soft md:text-[17px]">
                            {profile.bio}
                        </p>
                    )}

                    {(profile.location || facts.length > 0) && (
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-pro-muted">
                            {profile.location && (
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="size-3.5" />
                                    {profile.location}
                                </span>
                            )}
                            {facts.map(([value, label]) => (
                                <span key={label}>
                                    <span className="font-semibold text-pro-ink">
                                        {value}
                                    </span>{' '}
                                    {label.toLowerCase()}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2.5">
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
                                aria-label="GitHub"
                                className={cn(proBtnGhost, 'px-3')}
                            >
                                <Github className="size-4" />
                            </a>
                        )}
                        {profile.linkedin_url && (
                            <a
                                href={profile.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className={cn(proBtnGhost, 'px-3')}
                            >
                                <Linkedin className="size-4" />
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <Section
                id="skills"
                eyebrow="Toolkit"
                title="Skills"
                aside={
                    categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-pro-muted">
                            {LEGEND.map(([level, label]) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <span
                                        className={cn(
                                            'size-2.5 rounded-full',
                                            skillTone(level).dot,
                                        )}
                                    />
                                    {label}
                                </span>
                            ))}
                        </div>
                    )
                }
            >
                {categories.length === 0 ? (
                    <Empty>Skills will appear here soon.</Empty>
                ) : (
                    <div className="divide-y divide-pro-line overflow-hidden rounded-2xl border border-pro-line bg-pro-surface">
                        {categories.map((cat) => {
                            const Icon = categoryIcon(cat.name);
                            const skills = [...cat.skills].sort(
                                (a, b) => (b.level ?? 0) - (a.level ?? 0),
                            );

                            return (
                                <div
                                    key={cat.id}
                                    className="grid gap-4 px-5 py-5 md:grid-cols-[220px_minmax(0,1fr)] md:items-center md:gap-8 md:px-7"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pro-accent-soft text-pro-accent">
                                            <Icon className="size-[18px]" />
                                        </span>
                                        <span className="font-semibold capitalize">
                                            {cat.name}
                                        </span>
                                        <span className="text-sm text-pro-muted">
                                            {cat.skills.length}
                                        </span>
                                    </div>
                                    <ul className="flex flex-wrap gap-2">
                                        {skills.length === 0 && (
                                            <li className="text-sm text-pro-muted">
                                                —
                                            </li>
                                        )}
                                        {skills.map((s) => {
                                            const level = levelLabel(s.level);

                                            return (
                                                <li
                                                    key={s.id}
                                                    title={level ?? undefined}
                                                    className={cn(
                                                        'rounded-full px-3.5 py-1.5 text-sm',
                                                        skillTone(s.level).chip,
                                                    )}
                                                >
                                                    {s.name}
                                                    {level && (
                                                        <span className="sr-only">
                                                            , {level}
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
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
