import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useAdminChrome } from '@/lib/skin';
import { cn } from '@/lib/utils';
import { TrafficLights } from '@/themes/mac/ui';

/**
 * Shell for the Fortify pages other than login (confirm password, two-factor
 * challenge, forgot/reset password). Follows the active theme like the admin.
 */
export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: ReactNode;
}) {
    const skin = useAdminChrome();

    if (skin === 'professional') {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-mac-bg px-5 py-12 font-mac text-mac-text">
                <Link href="/" className="mb-8 flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-mac-green font-semibold text-white">
                        A
                    </span>
                    <span className="text-lg font-semibold tracking-tight">
                        Portfolio admin
                    </span>
                </Link>
                <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-mac-rule bg-mac-panel p-7 shadow-[0_12px_40px_rgba(22,24,29,0.06)]">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-mac-muted">
                                {description}
                            </p>
                        )}
                    </div>
                    {children}
                </div>
                <Link
                    href="/admin"
                    className="mt-6 text-sm text-mac-muted hover:text-mac-text"
                >
                    ← Back
                </Link>
            </div>
        );
    }

    const ps = skin === 'powershell';

    return (
        <div className="flex min-h-screen items-start justify-center bg-mac-desktop font-mac text-mac-text sm:items-center sm:p-10">
            <div
                className={cn(
                    'flex w-full max-w-[560px] flex-col overflow-hidden bg-mac-bg max-sm:min-h-screen sm:border sm:border-mac-line sm:shadow-[0_30px_80px_rgba(0,0,0,0.55)]',
                    ps ? 'sm:rounded-lg' : 'sm:rounded-xl',
                )}
            >
                <div className="flex h-10 items-center gap-4 border-b border-mac-line bg-mac-bar px-3.5">
                    {ps ? (
                        <span className="text-mac-green">&gt;_</span>
                    ) : (
                        <TrafficLights />
                    )}
                    <div className="flex-1 truncate text-center text-xs text-mac-soft">
                        {ps ? 'admin — PowerShell' : 'ssh admin@portfolio'}
                    </div>
                    <div className="w-[52px]" />
                </div>
                <div className="flex flex-col gap-6 px-5 py-7 text-sm sm:px-9 sm:py-8">
                    <div className="flex flex-col gap-1.5">
                        <div className="text-[15px] text-mac-bright">
                            {ps ? (
                                <>
                                    PS{' '}
                                    <span className="text-mac-blue">
                                        C:\&gt;
                                    </span>{' '}
                                </>
                            ) : (
                                <span className="text-mac-green">
                                    admin@portfolio{' '}
                                    <span className="text-mac-muted">
                                        %
                                    </span>{' '}
                                </span>
                            )}
                            {title}
                        </div>
                        {description && (
                            <div className="text-[13px] text-mac-muted">
                                {'# '}
                                {description}
                            </div>
                        )}
                    </div>
                    {children}
                    <Link
                        href="/admin"
                        className="self-start text-[13px] text-mac-muted hover:text-mac-text"
                    >
                        ← {ps ? 'Set-Location ~' : 'cd ~'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
