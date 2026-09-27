import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    ExternalLink,
    FolderGit2,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    Palette,
    Settings,
    User,
    Wrench,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { skinClass, useSkin } from '@/lib/skin';
import { cn } from '@/lib/utils';
import { TrafficLights } from '@/themes/mac/ui';
import type { Auth } from '@/types';
import type { ThemeName } from '@/types/portfolio';

type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    exact?: boolean;
};

const nav: NavItem[] = [
    { href: '/admin', label: 'dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/profile', label: 'profile', icon: User },
    { href: '/admin/theme', label: 'theme', icon: Palette },
    { href: '/admin/skills', label: 'skills', icon: Wrench },
    { href: '/admin/experiences', label: 'experiences', icon: Briefcase },
    { href: '/admin/projects', label: 'projects', icon: FolderGit2 },
    { href: '/admin/messages', label: 'messages', icon: Mail },
    { href: '/settings/profile', label: 'settings', icon: Settings },
];

const tabs = [
    { href: '/admin', label: 'dash', icon: LayoutDashboard, exact: true },
    { href: '/admin/projects', label: 'projects', icon: FolderGit2 },
    { href: '/admin/skills', label: 'skills', icon: Wrench },
    { href: '/admin/experiences', label: 'exp', icon: Briefcase },
    { href: '/admin/messages', label: 'msgs', icon: Mail },
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "~/admin/projects" → "C:\admin\projects" */
const winPath = (cwd: string) =>
    `C:${cwd.replace(/^~/, '').replace(/\//g, '\\')}`;

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

function TitleBar({
    skin,
    cwd,
    menuOpen,
    onMenu,
}: {
    skin: ThemeName;
    cwd: string;
    menuOpen: boolean;
    onMenu: () => void;
}) {
    const mobileButtons = (
        <>
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
                onClick={onMenu}
                className="flex size-9 items-center justify-center text-mac-soft md:hidden"
            >
                {menuOpen ? (
                    <X className="size-4" />
                ) : (
                    <Menu className="size-4" />
                )}
            </button>
        </>
    );

    if (skin === 'powershell') {
        return (
            <div className="sticky top-0 z-30 flex h-10 items-end bg-mac-bar font-sans">
                <div className="ml-2 flex h-8 w-[200px] items-center gap-2.5 rounded-t-lg bg-mac-bg px-3 text-xs text-white">
                    <span className="flex size-4 items-center justify-center rounded-[3px] bg-[#012456] font-mono text-[9px]">
                        &gt;_
                    </span>
                    <span className="flex-1 truncate">admin — PowerShell</span>
                    <span className="text-[#9d9d9d]">✕</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center self-stretch">
                    {mobileButtons}
                </div>
                <div className="hidden self-stretch text-[13px] text-white md:flex">
                    {['─', '☐', '✕'].map((c) => (
                        <span
                            key={c}
                            className="flex w-[46px] items-center justify-center"
                        >
                            {c}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    if (skin === 'professional') {
        return (
            <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-mac-rule bg-mac-bar px-5 md:px-8">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-mac-green text-sm font-semibold text-white">
                        A
                    </span>
                    <span className="text-[15px] font-semibold tracking-tight">
                        Portfolio admin
                    </span>
                </Link>
                <span className="flex-1" />
                <a
                    href="/"
                    target="_blank"
                    className="hidden items-center gap-1.5 rounded-full border border-mac-line px-4 py-1.5 text-sm font-medium hover:border-mac-muted md:inline-flex"
                >
                    View site <ExternalLink className="size-3.5" />
                </a>
                {mobileButtons}
            </div>
        );
    }

    return (
        <div className="sticky top-0 z-30 flex h-11 items-center gap-3 border-b border-mac-line bg-mac-bar px-4">
            <TrafficLights small />
            <div className="flex-1 truncate text-center text-xs text-mac-soft md:text-[13px]">
                <span className="max-md:hidden">admin@portfolio — </span>
                {cwd}
            </div>
            <div className="flex items-center md:w-[52px]">{mobileButtons}</div>
        </div>
    );
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
    const skin = useSkin();
    const pro = skin === 'professional';
    const isActive = useIsActive();
    const [menuOpen, setMenuOpen] = useState(false);
    const label = (s: string) => (skin === 'mac' ? s : capitalize(s));

    useFlashToast();

    const heading = pro ? (
        <h1 className="min-w-0 text-2xl font-semibold tracking-tight md:text-[28px]">
            {title}
        </h1>
    ) : (
        <div className="min-w-0 text-[13px] break-words md:text-[15px]">
            {skin === 'powershell' ? (
                <>
                    <span>PS</span>{' '}
                    <span className="text-mac-blue">{winPath(cwd)}&gt;</span>
                </>
            ) : (
                <>
                    <span className="text-mac-green">
                        admin<span className="max-md:hidden">@portfolio</span>
                    </span>{' '}
                    <span className="text-mac-blue">{cwd}</span>{' '}
                    <span className="text-mac-muted">%</span>
                </>
            )}{' '}
            {command}
        </div>
    );

    return (
        <>
            <Head title={`${title} · admin`} />

            <div
                className={cn(
                    skinClass(skin),
                    'min-h-screen bg-mac-desktop font-mac text-mac-text',
                    !pro && 'lg:p-8',
                )}
            >
                <div
                    className={cn(
                        'mx-auto flex min-h-screen flex-col bg-mac-bg',
                        pro
                            ? 'max-w-none'
                            : 'max-w-[1400px] lg:min-h-[calc(100vh-4rem)] lg:overflow-hidden lg:border lg:border-mac-line lg:shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
                        skin === 'mac' && 'lg:rounded-xl',
                        skin === 'powershell' && 'lg:rounded-lg',
                    )}
                >
                    <TitleBar
                        skin={skin}
                        cwd={cwd}
                        menuOpen={menuOpen}
                        onMenu={() => setMenuOpen((o) => !o)}
                    />

                    {/* mobile menu (everything that isn't in the tab bar) */}
                    {menuOpen && (
                        <div
                            className={cn(
                                'sticky z-20 flex flex-col border-b border-mac-line bg-mac-side px-4 py-3 text-sm md:hidden',
                                pro ? 'top-16' : 'top-11',
                            )}
                        >
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
                                    {label(item.label)}
                                </Link>
                            ))}
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-md px-3 py-2.5 text-left text-mac-red"
                            >
                                {pro ? 'Log out' : 'exit (logout)'}
                            </button>
                        </div>
                    )}

                    <div className="flex min-h-0 flex-1">
                        {/* sidebar */}
                        <aside
                            className={cn(
                                'hidden w-[230px] shrink-0 flex-col gap-1 border-r border-mac-rule bg-mac-side px-3.5 py-6 text-sm md:flex',
                                pro && 'w-[248px] px-4',
                            )}
                        >
                            {!pro && (
                                <div className="px-3 pb-3 text-xs text-mac-muted">
                                    {skin === 'powershell'
                                        ? 'C:\\admin'
                                        : '~/admin/'}
                                </div>
                            )}
                            {nav.map((item) => {
                                const active = isActive(item.href, item.exact);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center rounded-md px-3 py-2 transition-colors',
                                            active
                                                ? pro
                                                    ? 'bg-pro-accent-soft font-medium text-mac-green'
                                                    : 'bg-mac-chip text-mac-bright'
                                                : 'text-mac-soft hover:bg-mac-chip/60 hover:text-mac-bright',
                                            skin === 'powershell' &&
                                                'border-l-2 border-transparent',
                                            skin === 'powershell' &&
                                                active &&
                                                'border-mac-green',
                                        )}
                                    >
                                        {pro ? (
                                            <Icon className="mr-3 size-4" />
                                        ) : (
                                            <span
                                                className={cn(
                                                    'mr-1.5',
                                                    active
                                                        ? 'text-mac-green'
                                                        : 'text-mac-dim',
                                                )}
                                            >
                                                {skin === 'powershell'
                                                    ? '>'
                                                    : '▸'}
                                            </span>
                                        )}
                                        {label(item.label)}
                                        {item.label === 'messages' &&
                                            unread > 0 && (
                                                <span
                                                    className={cn(
                                                        'ml-auto px-1.5 text-[11px] font-bold',
                                                        pro
                                                            ? 'rounded-full bg-mac-green text-white'
                                                            : 'rounded bg-mac-amber text-mac-desktop',
                                                    )}
                                                >
                                                    {unread}
                                                </span>
                                            )}
                                    </Link>
                                );
                            })}
                            <div className="flex-1" />
                            {!pro && (
                                <a
                                    href="/"
                                    target="_blank"
                                    className="px-3 py-2 text-mac-soft hover:text-mac-bright"
                                >
                                    {label('view site')} ↗
                                </a>
                            )}
                            {pro && (
                                <div className="mb-2 truncate border-t border-mac-rule px-3 pt-4 text-xs text-mac-muted">
                                    Signed in as
                                    <div className="truncate text-sm text-mac-text">
                                        {auth.user.email}
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={logout}
                                className="flex items-center px-3 py-2 text-left text-mac-red hover:brightness-125"
                            >
                                {pro ? (
                                    <>
                                        <LogOut className="mr-3 size-4" /> Log
                                        out
                                    </>
                                ) : skin === 'powershell' ? (
                                    'Exit'
                                ) : (
                                    'exit (logout)'
                                )}
                            </button>
                        </aside>

                        {/* main */}
                        <main
                            className={cn(
                                'flex min-w-0 flex-1 flex-col gap-6 px-4 py-5 pb-24 text-[13px] leading-relaxed md:gap-7 md:px-10 md:py-8 md:pb-8 md:text-sm',
                                pro && 'md:text-[15px] lg:px-12 lg:py-10',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex flex-wrap items-center gap-3 md:gap-4',
                                    !pro && 'border-b border-mac-rule pb-3.5',
                                )}
                            >
                                {heading}
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
                    {!pro && (
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
                    )}
                </div>

                {/* bottom tab bar (mobile) */}
                <nav className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-5 border-t border-mac-line bg-mac-side text-[10px] md:hidden">
                    {tabs.map(({ href, label: tab, icon: Icon, exact }) => (
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
                            {label(tab)}
                            {tab === 'msgs' && unread > 0 && (
                                <span className="absolute top-2 right-[calc(50%-18px)] size-2 rounded-full bg-mac-amber" />
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
