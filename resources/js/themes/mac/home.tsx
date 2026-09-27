import { Link } from '@inertiajs/react';
import { allSkillCount, duration, levelBlocks, ym } from '@/lib/portfolio';
import type { HomeProps, Skill } from '@/types/portfolio';
import { ContactBlock, ProjectCard, ShellError } from './parts';
import {
    Chip,
    Cursor,
    MacShell,
    macBtnGhost,
    macBtnPrimary,
    Placeholder,
    Prompt,
    SectionHead,
    shellUser,
} from './ui';

/** "Sat Sep 26 21:06:14" — mimics the zsh login banner. */
function lastLogin(): string {
    const d = new Date();
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const time = d.toTimeString().slice(0, 8);

    return `${day} ${month} ${String(d.getDate()).padStart(2, ' ')} ${time}`;
}

/** "├─ laravel ········ █████████░ 90%" */
function SkillLine({ skill, last }: { skill: Skill; last: boolean }) {
    const [filled, empty] =
        skill.level === null ? ['', ''] : levelBlocks(skill.level);

    return (
        <div className="flex items-center gap-2 text-mac-dim">
            <span className="shrink-0">{last ? '└─' : '├─'}</span>
            <span className="min-w-0 flex-1 truncate text-mac-text">
                {skill.name}
            </span>
            {skill.level !== null && (
                <span
                    className="flex shrink-0 items-center gap-2 text-xs md:text-[13px]"
                    title={`${skill.level}%`}
                >
                    <span className="tracking-[-0.05em]">
                        <span className="text-mac-green">{filled}</span>
                        <span className="text-mac-line">{empty}</span>
                    </span>
                    <span className="w-9 text-right text-mac-muted">
                        {skill.level}%
                    </span>
                </span>
            )}
        </div>
    );
}

export default function MacHome({
    profile,
    categories,
    experiences,
    projects,
}: Omit<HomeProps, 'theme'>) {
    const user = shellUser(profile.name);
    const skillCount = allSkillCount(categories);

    return (
        <MacShell
            title={`${user} — portfolio — zsh`}
            user={user}
            owner={profile.name}
        >
            {/* whoami */}
            <section id="about" className="flex flex-col gap-5 md:gap-7">
                <div className="text-[11px] text-mac-muted md:text-[13px]">
                    Last login: {lastLogin()} on ttys001
                </div>
                <SectionHead>whoami</SectionHead>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="size-24 shrink-0 rounded-[10px] border border-mac-line object-cover md:size-40"
                        />
                    ) : (
                        <Placeholder
                            label="[avatar]"
                            className="size-24 shrink-0 rounded-[10px] border border-mac-line bg-mac-chip md:size-40"
                        />
                    )}
                    <div className="flex flex-col gap-3.5 md:pt-1">
                        <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-mac-bright md:text-[56px] md:leading-[1.05]">
                            {profile.name}
                            <span className="animate-blink text-mac-green">
                                _
                            </span>
                        </h1>
                        {profile.headline && (
                            <div className="text-[13px] text-mac-amber md:text-base">
                                {profile.headline}
                            </div>
                        )}
                        {profile.bio && (
                            <p className="max-w-[700px] whitespace-pre-line text-mac-soft">
                                {profile.bio}
                            </p>
                        )}
                        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                            {profile.resume_url && (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`${macBtnPrimary} col-span-2`}
                                >
                                    resume.pdf ↓
                                </a>
                            )}
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={macBtnGhost}
                                >
                                    github ↗
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={macBtnGhost}
                                >
                                    linkedin ↗
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* tree skills/ */}
            <section id="skills" className="flex flex-col gap-5 md:gap-7">
                <SectionHead
                    aside={`# ${categories.length} ${categories.length === 1 ? 'directory' : 'directories'}, ${skillCount} ${skillCount === 1 ? 'file' : 'files'}`}
                >
                    tree skills/
                </SectionHead>
                {categories.length === 0 ? (
                    <ShellError>
                        tree: skills/: No such file or directory
                    </ShellError>
                ) : (
                    <div className="grid grid-cols-1 overflow-hidden rounded-[10px] border border-mac-rule bg-mac-panel text-[13px] sm:grid-cols-2 md:text-[15px] xl:grid-cols-3">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="flex flex-col gap-1 p-4 shadow-[1px_0_0_var(--color-mac-rule),0_1px_0_var(--color-mac-rule)] md:gap-2 md:px-7 md:py-6"
                            >
                                <div className="mb-1 font-bold text-mac-blue">
                                    {cat.name}/
                                </div>
                                {cat.skills.length === 0 && (
                                    <div className="text-mac-dim">
                                        └─ (empty)
                                    </div>
                                )}
                                {cat.skills.map((skill, i) => (
                                    <SkillLine
                                        key={skill.id}
                                        skill={skill}
                                        last={i === cat.skills.length - 1}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* cat experience.log */}
            <section id="experience" className="flex flex-col gap-1 md:gap-3">
                <div className="mb-2 md:mb-4">
                    <SectionHead aside="# newest first">
                        cat experience.log
                    </SectionHead>
                </div>
                {experiences.length === 0 ? (
                    <ShellError>
                        cat: experience.log: No such file or directory
                    </ShellError>
                ) : (
                    experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="flex flex-col gap-1.5 border-b border-dashed border-mac-rule py-4 last:border-b-0 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 md:py-5"
                        >
                            <div className="flex flex-wrap items-center gap-2.5 md:flex-col md:items-start md:gap-1.5">
                                <div className="text-xs text-mac-muted md:text-[13px]">
                                    [{ym(exp.start_date)}] →{' '}
                                    {exp.end_date
                                        ? `[${ym(exp.end_date)}]`
                                        : 'now'}
                                </div>
                                <div className="text-xs text-mac-dim md:text-[13px]">
                                    {duration(exp.start_date, exp.end_date)}
                                </div>
                                {!exp.end_date && (
                                    <span className="rounded border border-mac-green px-1.5 text-[11px] text-mac-green md:px-2 md:text-xs">
                                        ● current
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 md:gap-2">
                                <div className="text-[15px] font-bold text-mac-bright md:text-[17px]">
                                    {exp.position}{' '}
                                    <span className="block text-[13px] font-medium text-mac-amber md:inline md:text-[17px]">
                                        @ {exp.company}
                                    </span>
                                </div>
                                {exp.description && (
                                    <div className="whitespace-pre-line text-mac-soft">
                                        {exp.description}
                                    </div>
                                )}
                                {exp.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {exp.skills.map((s) => (
                                            <Chip key={s.id}>{s.name}</Chip>
                                        ))}
                                    </div>
                                )}
                                {!!exp.projects?.length && (
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px]">
                                        <span className="text-mac-dim">
                                            └─ projects:
                                        </span>
                                        {exp.projects.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/projects/${p.slug}`}
                                                title={p.summary ?? undefined}
                                                className="text-mac-blue hover:underline"
                                            >
                                                {p.slug}/
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* ls projects/ --featured */}
            <section id="projects" className="flex flex-col gap-5 md:gap-7">
                <div className="flex items-baseline gap-4 border-b border-mac-rule pb-3.5">
                    <Prompt>ls projects/personal/ --featured</Prompt>
                    <span className="flex-1" />
                    <Link
                        href="/projects"
                        className="shrink-0 text-xs text-mac-blue hover:underline md:text-[13px]"
                    >
                        view all →
                    </Link>
                </div>
                {projects.length === 0 ? (
                    <ShellError>total 0</ShellError>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* ./contact.sh */}
            <section id="contact" className="flex flex-col gap-5 md:gap-7">
                <SectionHead>./contact.sh</SectionHead>
                <ContactBlock profile={profile} />
            </section>

            <div className="mt-auto">
                <Prompt>
                    <Cursor />
                </Prompt>
            </div>
        </MacShell>
    );
}
