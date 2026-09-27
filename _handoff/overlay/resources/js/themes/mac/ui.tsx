import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import type { ReactNode } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { cn } from '@/lib/utils';

export function TrafficLights({ small = false }: { small?: boolean }) {
    const size = small ? 'size-2.5' : 'size-3';

    return (
        <div className="flex gap-2">
            <span className={cn(size, 'rounded-full bg-[#ff5f57]')} />
            <span className={cn(size, 'rounded-full bg-[#febc2e]')} />
            <span className={cn(size, 'rounded-full bg-[#28c840]')} />
        </div>
    );
}

/** A full-page macOS Terminal window. On phones it fills the screen. */
export function MacShell({
    title,
    children,
    status,
}: {
    title: string;
    children: ReactNode;
    status?: ReactNode;
}) {
    useFlashToast();

    return (
        <div className="min-h-screen bg-mac-desktop font-mac text-mac-text md:px-10 md:py-12 lg:px-16">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col overflow-hidden bg-mac-bg md:min-h-[calc(100vh-6rem)] md:rounded-xl md:border md:border-mac-line md:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="sticky top-0 z-10 flex h-11 items-center gap-4 border-b border-mac-line bg-mac-bar px-4">
                    <TrafficLights />
                    <div className="flex-1 truncate text-center text-xs text-[#a3aab4] md:text-[13px]">
                        {title}
                    </div>
                    <div className="w-[52px]" />
                </div>

                <main className="flex flex-1 flex-col gap-14 px-5 py-8 text-sm leading-relaxed md:gap-20 md:px-14 md:py-12 md:text-[15px]">
                    {children}
                </main>

                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t border-mac-line bg-mac-bar px-4 py-2 text-[11px] text-mac-muted md:justify-between md:text-xs">
                    <span className="hidden text-mac-green md:inline">
                        {status ?? '● online'}
                    </span>
                    <span>built with laravel + inertia</span>
                </div>
            </div>
        </div>
    );
}

export function Prompt({
    cwd = '~',
    user = 'guest',
    children,
}: {
    cwd?: string;
    user?: string;
    children?: ReactNode;
}) {
    return (
        <span>
            <span className="text-mac-green">{user}@portfolio</span>{' '}
            <span className="text-mac-blue">{cwd}</span>{' '}
            <span className="text-mac-muted">%</span> {children}
        </span>
    );
}

export function SectionHead({
    children,
    aside,
    cwd,
}: {
    children: ReactNode;
    aside?: ReactNode;
    cwd?: string;
}) {
    return (
        <div className="flex items-baseline gap-4 border-b border-mac-rule pb-3.5">
            <Prompt cwd={cwd}>{children}</Prompt>
            <span className="flex-1" />
            {aside && (
                <span className="hidden text-[13px] text-mac-muted sm:inline">
                    {aside}
                </span>
            )}
        </div>
    );
}

export function Chip({ children }: { children: ReactNode }) {
    return (
        <span className="rounded bg-mac-chip px-2 py-0.5 text-xs text-[#a3aab4]">
            {children}
        </span>
    );
}

export function Cursor() {
    return (
        <span className="inline-block h-[18px] w-[9px] animate-blink bg-mac-text align-[-3px]" />
    );
}

export function Placeholder({
    label,
    className,
}: {
    label: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'flex items-center justify-center bg-mac-shot text-xs text-mac-muted',
                className,
            )}
        >
            {label}
        </div>
    );
}

export const macBtnPrimary =
    'inline-flex items-center justify-center rounded-md bg-mac-green px-[18px] py-2.5 text-sm font-bold text-mac-desktop hover:brightness-110 disabled:opacity-60';
export const macBtnGhost =
    'inline-flex items-center justify-center rounded-md border border-mac-line px-[18px] py-2.5 text-sm text-mac-text hover:border-mac-muted';
export const macInput =
    'w-full rounded-md border border-mac-line bg-mac-input px-3 py-2.5 text-mac-bright placeholder:text-mac-dim focus:border-mac-green focus:outline-none';
export const macLabel = 'text-[13px] text-mac-amber';
