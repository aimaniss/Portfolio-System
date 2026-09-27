import '@fontsource/cascadia-code/400.css';
import '@fontsource/cascadia-code/700.css';
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { cn } from '@/lib/utils';

const PsUser = createContext('guest');

/** "Aiman Ismail" → "aiman" */
export function psUser(name: string | null | undefined): string {
    return (name ?? '').trim().split(/\s+/)[0]?.toLowerCase() || 'guest';
}

/** Windows 11 Terminal window with one PowerShell tab. */
export function PsShell({
    user,
    owner,
    children,
}: {
    user: string;
    owner?: string;
    children: ReactNode;
}) {
    useFlashToast();

    return (
        <PsUser.Provider value={user}>
            <div className="min-h-screen bg-ps-desktop font-ps text-ps-text md:px-10 md:py-12 lg:px-16">
                <div className="mx-auto flex min-h-screen max-w-6xl flex-col overflow-hidden bg-ps-bg md:min-h-[calc(100vh-6rem)] md:rounded-lg md:border md:border-ps-line md:shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                    <div className="sticky top-0 z-10 flex h-10 items-end bg-ps-bar font-sans">
                        <div className="ml-2 flex h-8 w-[180px] items-center gap-2.5 rounded-t-lg bg-ps-bg px-3 text-xs text-white sm:w-[220px]">
                            <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#012456] font-mono text-[9px] text-white">
                                &gt;_
                            </span>
                            <span className="flex-1 truncate">
                                {user} — PowerShell
                            </span>
                            <span className="text-[#9d9d9d]">✕</span>
                        </div>
                        <div className="hidden h-8 items-center gap-3.5 px-2.5 text-sm text-[#9d9d9d] sm:flex">
                            <span>+</span>
                            <span className="text-[10px]">⌄</span>
                        </div>
                        <div className="flex-1" />
                        <div className="flex self-stretch text-[13px] text-white">
                            {['─', '☐', '✕'].map((c) => (
                                <span
                                    key={c}
                                    className="flex w-9 items-center justify-center sm:w-[46px]"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>

                    <main className="flex flex-1 flex-col gap-14 px-5 py-7 text-sm leading-relaxed [font-variant-ligatures:none] md:gap-20 md:px-16 md:py-10 md:text-[15px]">
                        {children}
                    </main>

                    <div className="flex h-[30px] items-center gap-5 border-t border-ps-rule bg-ps-bar px-4 font-sans text-xs text-[#9d9d9d]">
                        {owner && (
                            <span>
                                © {new Date().getFullYear()} {owner}
                            </span>
                        )}
                        <span className="flex-1" />
                        <span className="max-sm:hidden">
                            built with laravel + inertia
                        </span>
                    </div>
                </div>
            </div>
        </PsUser.Provider>
    );
}

/** PS C:\Users\aiman> <Cmd>…</Cmd> */
export function PsPrompt({
    path,
    children,
}: {
    path?: string;
    children?: ReactNode;
}) {
    const user = useContext(PsUser);

    return (
        <span className="break-words">
            <span>PS</span>{' '}
            <span className="text-ps-cyan">
                C:\Users\{user}
                {path ? `\\${path}` : ''}&gt;
            </span>{' '}
            {children}
        </span>
    );
}

/** A cmdlet name in the prompt. */
export function Cmd({ children }: { children: ReactNode }) {
    return <span className="text-ps-yellow">{children}</span>;
}

/** A -Parameter or pipe, muted. */
export function Arg({ children }: { children: ReactNode }) {
    return <span className="text-ps-muted">{children}</span>;
}

export function PsHead({
    children,
    aside,
    path,
}: {
    children: ReactNode;
    aside?: ReactNode;
    path?: string;
}) {
    return (
        <div className="flex items-baseline gap-4 border-b border-ps-rule pb-3">
            <PsPrompt path={path}>{children}</PsPrompt>
            <span className="flex-1" />
            {aside && (
                <span className="hidden shrink-0 text-[13px] text-ps-muted sm:inline">
                    {aside}
                </span>
            )}
        </div>
    );
}

export function PsChip({ children }: { children: ReactNode }) {
    return (
        <span className="rounded-[3px] bg-ps-chip px-2.5 py-px text-ps-chip-text">
            {children}
        </span>
    );
}

export function PsCursor() {
    return (
        <span className="inline-block h-[3px] w-[9px] animate-blink bg-ps-text align-[-2px]" />
    );
}

/** Two-column "Key : Value" list, like Format-List. */
export function PsList({
    rows,
    keyWidth = 'grid-cols-[90px_minmax(0,1fr)]',
    className,
}: {
    rows: [string, ReactNode][];
    keyWidth?: string;
    className?: string;
}) {
    return (
        <div className={cn('grid gap-x-1.5 gap-y-1', keyWidth, className)}>
            {rows.map(([k, v]) => (
                <div key={k} className="contents">
                    <span className="text-ps-cyan">{k}</span>
                    <span className="min-w-0 break-words">: {v}</span>
                </div>
            ))}
        </div>
    );
}

export function PsError({ message }: { message?: string }) {
    return message ? <p className="text-xs text-[#f14c4c]">{message}</p> : null;
}

/** Red PowerShell error block, used for empty states. */
export function PsNotFound({ children }: { children: ReactNode }) {
    return <div className="text-[#f14c4c]">{children}</div>;
}

export const psBtnPrimary =
    'inline-flex items-center justify-center rounded bg-ps-accent px-[18px] py-2 text-sm font-bold text-ps-accent-ink hover:brightness-110 disabled:opacity-60';
export const psBtnGhost =
    'inline-flex items-center justify-center rounded border border-ps-line bg-[#2b2b2b] px-[18px] py-2 text-sm text-white hover:bg-[#333]';
export const psInput =
    'w-full rounded border border-ps-line bg-ps-input px-3 py-2.5 text-white placeholder:text-ps-muted focus:border-b-2 focus:border-b-ps-accent focus:outline-none';
export const psLabel = 'text-[13px] text-ps-soft';
export const psLink = 'text-ps-accent hover:underline';
