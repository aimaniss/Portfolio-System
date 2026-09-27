import { Link } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useSkin } from '@/lib/skin';
import { cn } from '@/lib/utils';

const tabs = [
    { href: '/settings/profile', terminal: 'account', plain: 'Account' },
    { href: '/settings/security', terminal: 'security', plain: 'Security' },
];

/** Sub-navigation shared by the settings pages. */
export default function SettingsTabs() {
    const { currentUrl } = useCurrentUrl();
    const pro = useSkin() === 'professional';

    return (
        <nav
            className={cn(
                'flex gap-1 self-start rounded-lg border border-mac-rule bg-mac-panel p-1',
                pro && 'rounded-full',
            )}
        >
            {tabs.map((tab) => {
                const active = currentUrl.startsWith(tab.href);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            'rounded-md px-4 py-1.5 text-[13px] transition-colors md:text-sm',
                            pro && 'rounded-full font-medium',
                            active
                                ? pro
                                    ? 'bg-pro-ink text-white'
                                    : 'bg-mac-chip text-mac-bright'
                                : 'text-mac-muted hover:text-mac-text',
                        )}
                    >
                        {pro
                            ? tab.plain
                            : `${active ? '▸ ' : ''}${tab.terminal}`}
                    </Link>
                );
            })}
        </nav>
    );
}
