import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ym } from '@/lib/portfolio';
import type { HomeProps } from '@/types/portfolio';
import { PsContact, PsProjectCard } from './parts';
import {
    Arg,
    Cmd,
    PsChip,
    PsCursor,
    PsHead,
    PsList,
    PsNotFound,
    PsPrompt,
    PsShell,
    psBtnGhost,
    psBtnPrimary,
    psLink,
    psUser,
} from './ui';

export default function PsHome({
    profile,
    categories,
    experiences,
    projects,
}: Omit<HomeProps, 'theme'>) {
    const user = psUser(profile.name);
    const profileRows: [string, ReactNode][] = [];

    if (profile.headline) {
        profileRows.push([
            'Role',
            profile.headline.split(/\s*·\s*/).join(', '),
        ]);
    }

    if (profile.location) {
        profileRows.push(['Location', profile.location]);
    }

    if (profile.bio) {
        profileRows.push([
            'About',
            <span key="b" className="whitespace-pre-line text-ps-soft">
                {profile.bio}
            </span>,
        ]);
    }

    return (
        <PsShell user={user} owner={profile.name}>
            {/* Get-Profile */}
            <section className="flex flex-col gap-5 md:gap-6">
                <div className="text-xs text-ps-muted md:text-[13px]">
                    PowerShell 7.4.5
                    <br />
                    Loading personal and system profiles took 312ms.
                </div>
                <PsHead>
                    <Cmd>Get-Profile</Cmd> <Arg>-Name</Arg> {user}
                </PsHead>
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.name}
                            className="size-24 shrink-0 rounded-md border border-ps-line object-cover md:size-40"
                        />
                    ) : (
                        <div className="flex size-24 shrink-0 items-center justify-center rounded-md border border-ps-line bg-ps-input text-xs text-ps-muted md:size-40">
                            [avatar]
                        </div>
                    )}
                    <div className="flex min-w-0 flex-col gap-3.5">
                        <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-[56px] md:leading-[1.05]">
                            {profile.name}
                            <span className="animate-blink text-ps-accent">
                                _
                            </span>
                        </h1>
                        {profileRows.length > 0 && (
                            <PsList
                                rows={profileRows}
                                keyWidth="grid-cols-[80px_minmax(0,1fr)] md:grid-cols-[110px_minmax(0,1fr)]"
                                className="max-w-[760px]"
                            />
                        )}
                        <div className="mt-2 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
                            {profile.resume_url && (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(psBtnPrimary, 'col-span-2')}
                                >
                                    resume.pdf ↓
                                </a>
                            )}
                            {profile.github_url && (
                                <a
                                    href={profile.github_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={psBtnGhost}
                                >
                                    github ↗
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={psBtnGhost}
                                >
                                    linkedin ↗
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* skills */}
            <section className="flex flex-col gap-5">
                <PsHead>
                    <Cmd>Get-ChildItem</Cmd> .\skills <Arg>|</Arg>{' '}
                    <Cmd>Format-Table</Cmd>
                </PsHead>
                {categories.length === 0 ? (
                    <PsNotFound>
                        {`Get-ChildItem: Cannot find path 'C:\\Users\\${user}\\skills' because it does not exist.`}
                    </PsNotFound>
                ) : (
                    <div className="grid grid-cols-[minmax(84px,auto)_minmax(0,1fr)] gap-x-4 gap-y-2.5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-x-6">
                        <span className="text-ps-green">Category</span>
                        <span className="text-ps-green">Name</span>
                        <span className="text-ps-green">--------</span>
                        <span className="text-ps-green">----</span>
                        {categories.map((cat) => (
                            <div key={cat.id} className="contents">
                                <span className="text-white">{cat.name}</span>
                                <div className="flex flex-wrap gap-2">
                                    {cat.skills.length === 0 && (
                                        <span className="text-ps-muted">
                                            {'{}'}
                                        </span>
                                    )}
                                    {cat.skills.map((s) => (
                                        <PsChip key={s.id}>{s.name}</PsChip>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* experience */}
            <section className="flex flex-col gap-5">
                <PsHead aside="# newest first">
                    <Cmd>Get-Content</Cmd> .\experience.json <Arg>|</Arg>{' '}
                    <Cmd>Format-List</Cmd>
                </PsHead>
                {experiences.length === 0 ? (
                    <PsNotFound>
                        {`Get-Content: Cannot find path 'C:\\Users\\${user}\\experience.json' because it does not exist.`}
                    </PsNotFound>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className={cn(
                                    'rounded-md border border-t-2 border-ps-rule bg-ps-panel p-4 text-[13px] md:p-5 md:text-sm',
                                    exp.end_date
                                        ? 'border-t-ps-line'
                                        : 'border-t-ps-accent',
                                )}
                            >
                                <PsList
                                    rows={[
                                        [
                                            'Period',
                                            <>
                                                {ym(exp.start_date)} →{' '}
                                                {exp.end_date ? (
                                                    ym(exp.end_date)
                                                ) : (
                                                    <span className="text-ps-green">
                                                        now
                                                    </span>
                                                )}
                                            </>,
                                        ],
                                        [
                                            'Position',
                                            <span
                                                key="p"
                                                className="font-bold text-white"
                                            >
                                                {exp.position}
                                            </span>,
                                        ],
                                        [
                                            'Company',
                                            <span
                                                key="c"
                                                className="text-ps-yellow"
                                            >
                                                {exp.company}
                                            </span>,
                                        ],
                                        ...(exp.skills.length
                                            ? ([
                                                  [
                                                      'Stack',
                                                      `{${exp.skills.map((s) => s.name).join(', ')}}`,
                                                  ],
                                              ] as [string, ReactNode][])
                                            : []),
                                        ...(exp.description
                                            ? ([
                                                  [
                                                      'Notes',
                                                      <span
                                                          key="n"
                                                          className="whitespace-pre-line text-ps-soft"
                                                      >
                                                          {exp.description}
                                                      </span>,
                                                  ],
                                              ] as [string, ReactNode][])
                                            : []),
                                    ]}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* projects */}
            <section className="flex flex-col gap-5">
                <div className="flex items-baseline gap-4 border-b border-ps-rule pb-3">
                    <PsPrompt>
                        <Cmd>Get-ChildItem</Cmd> .\projects <Arg>-Featured</Arg>
                    </PsPrompt>
                    <span className="flex-1" />
                    <Link
                        href="/projects"
                        className={cn(
                            psLink,
                            'shrink-0 text-xs md:text-[13px]',
                        )}
                    >
                        view all →
                    </Link>
                </div>
                <div className="text-xs whitespace-pre text-ps-muted md:text-[13px]">
                    {'    '}Directory: C:\Users\{user}\projects
                </div>
                {projects.length === 0 ? (
                    <div className="text-ps-muted">(no featured projects)</div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((p) => (
                            <PsProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* contact */}
            <section className="flex flex-col gap-5">
                <PsHead>
                    <Cmd>.\Send-Message.ps1</Cmd>
                </PsHead>
                <PsContact profile={profile} />
            </section>

            <div className="mt-auto">
                <PsPrompt>
                    <PsCursor />
                </PsPrompt>
            </div>
        </PsShell>
    );
}
