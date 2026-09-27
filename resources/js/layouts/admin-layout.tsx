import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    ExternalLink,
    FolderGit2,
    LayoutDashboard,
    Mail,
    Menu,
    Wrench,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { TrafficLights } from '@/themes/mac/ui';
import type { Auth } from '@/types';

type NavItem = { href: string; label: string; exact?: boolean };

const nav: NavItem[] = [
    { href: '/admin', label: 'dashboard', exact: true },
    { href: '/admin/profile', label: 'profile' },
    { href: '/admin/theme', label: 'theme' },
    { href: '/admin/skills', label: 'skills' },
    { href: '/admin/experiences', label: 'experiences' },
    { href: '/admin/projects', label: 'projects' },
    { href: '/admin/messages', label: 'messages' },
    { href: '/settings/profile', label: 'settings' },
];

const tabs = [
    { href: '/admin', label: 'dash', icon: LayoutDashboard, exact: true },
    { href: '/admin/projects', label: 'projects', icon: FolderGit2 },
    { href: '/admin/skills', label: 'skills', icon: Wrench },
    { href: '/admin/experiences', label: 'exp', icon: Briefcase },
    { href: '/admin/messages', label: 'msgs', icon: Mail },
];

function useIsActive() {
    const { currentUrl } = useCurrentUrl();
    const path = currentUrl.split('?')[0];

    return (href: string, exact = false) =>
        exact ? path === href : path === href || path.startsWith(`${href}/`);
}

function logout() {
    router.flushAll();
    router.post('/logout');
}

export default function AdminLayout({
    title,
    cwd = '~/admin',
    command,
    actions,
    children,
}: {
    title: string;
    cwd?: string;
    command: ReactNode;
    actions?: ReactNode;
    children: ReactNode;
}) {
    const { auth, unread } = usePage<{ auth: Auth; unread: number }>().props;
    const isActive = useIsActive();
    const [menuOpen, setMenuOpen] = useState(false);

    useFlashToast();

    return (
        <>
            <Head title={`${title} · admin`} />

            <div className="min-h-screen bg-mac-desktop font-mac text-mac-text lg:p-8">
                <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col bg-mac-bg lg:min-h-[calc(100vh-4rem)] lg:overflow-hidden lg:rounded-xl lg:border lg:border-mac-line lg:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                    {/* title bar */}
                    <div className="sticky top-0 z-30 flex h-11 items-center gap-3 border-b border-mac-line bg-mac-bar px-4">
                        <TrafficLights small />
                        <div className="flex-1 truncate text-center text-xs text-[#a3aab4] md:text-[13px]">
                            <span className="max-md:hidden">
                                admin@portfolio —{' '}
                            </span>
                            {cwd}
                        </div>
                        <div className="flex items-center md:w-[52px]">
                            <a
                                href="/"
                                target="_blank"
                                aria-label="View site"
                                className="flex size-9 items-center justify-center text-mac-soft md:hidden"
                            >
                                <ExternalLink className="size-4" />
                            </a>
                            <button
                                type="button"
                                aria-label="Menu"
                                onClick={() => setMenuOpen((o) => !o)}
                                className="flex size-9 items-center justify-center text-mac-soft md:hidden"
                            >
                                {menuOpen ? (
                                    <X className="size-4" />
                                ) : (
                                    <Menu className="size-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* mobile menu (everything that isn't in the tab bar) */}
                    {menuOpen && (
                        <div className="sticky top-11 z-20 flex flex-col border-b border-mac-line bg-mac-side px-4 py-3 text-sm md:hidden">
                            {nav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'rounded-md px-3 py-2.5',
                                        isActive(item.href, item.exact)
                                            ? 'bg-mac-chip text-mac-bright'
                                            : 'text-mac-soft',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-md px-3 py-2.5 text-left text-mac-red"
                            >
                                exit (logout)
                            </button>
                        </div>
                    )}

                    <div className="flex min-h-0 flex-1">
                        {/* sidebar */}
                        <aside className="hidden w-[230px] shrink-0 flex-col gap-1 border-r border-mac-rule bg-mac-side px-3.5 py-6 text-sm md:flex">
                            <div className="px-3 pb-3 text-xs text-mac-muted">
                                ~/admin/
                            </div>
                            {nav.map((item) => {
                                const active = isActive(item.href, item.exact);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center rounded-md px-3 py-2 transition-colors',
                                            active
                                                ? 'bg-mac-chip text-mac-bright'
                                                : 'text-mac-soft hover:bg-mac-chip/60 hover:text-mac-bright',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'mr-1.5',
                                                active
                                                    ? 'text-mac-green'
                                                    : 'text-mac-dim',
                                            )}
                                        >
                                            ▸
                                        </span>
                                        {item.label}
                                        {item.label === 'messages' &&
                                            unread > 0 && (
                                                <span className="ml-auto rounded bg-mac-amber px-1.5 text-[11px] font-bold text-mac-desktop">
                                                    {unread}
                                                </span>
                                            )}
                                    </Link>
                                );
                            })}
                            <div className="flex-1" />
                            <a
                                href="/"
                                target="_blank"
                                className="px-3 py-2 text-mac-soft hover:text-mac-bright"
                            >
                                view site ↗
                            </a>
                            <button
                                type="button"
                                onClick={logout}
                                className="px-3 py-2 text-left text-mac-red hover:brightness-125"
                            >
                                exit (logout)
                            </button>
                        </aside>

                        {/* main */}
                        <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-5 pb-24 text-[13px] leading-relaxed md:gap-7 md:px-10 md:py-8 md:pb-8 md:text-sm">
                            <div className="flex flex-wrap items-center gap-3 border-b border-mac-rule pb-3.5 md:gap-4">
                                <div className="min-w-0 text-[13px] break-words md:text-[15px]">
                                    <span className="text-mac-green">
                                        admin
                                        <span className="max-md:hidden">
                                            @portfolio
                                        </span>
                                    </span>{' '}
                                    <span className="text-mac-blue">{cwd}</span>{' '}
                                    <span className="text-mac-muted">%</span>{' '}
                                    {command}
                                </div>
                                <span className="flex-1" />
                                {actions && (
                                    <div className="flex flex-wrap gap-2 md:gap-3">
                                        {actions}
                                    </div>
                                )}
                            </div>
                            {children}
                        </main>
                    </div>

                    {/* status bar (desktop) */}
                    <div className="hidden h-8 items-center gap-5 border-t border-mac-line bg-mac-bar px-4 text-xs text-mac-muted md:flex">
                        <span className="text-mac-green">
                            ● logged in as {auth.user.email}
                        </span>
                        <span className="flex-1" />
                        <span>
                            {unread > 0
                                ? `${unread} unread message${unread === 1 ? '' : 's'}`
                                : 'inbox zero'}
                        </span>
                    </div>
                </div>

                {/* bottom tab bar (mobile) */}
                <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-mac-line bg-mac-side text-[10px] md:hidden">
                    {tabs.map(({ href, label, icon: Icon, exact }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'relative flex flex-col items-center justify-center gap-1',
                                isActive(href, exact)
                                    ? 'text-mac-green'
                                    : 'text-mac-muted',
                            )}
                        >
                            <Icon className="size-[18px]" />
                            {label}
                            {label === 'msgs' && unread > 0 && (
                                <span className="absolute top-2 right-[calc(50%-18px)] size-2 rounded-full bg-mac-amber" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
