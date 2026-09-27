import { Head, Link, router, useForm } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import type { FormEvent } from 'react';
import {
    FieldError,
    macBtnGhost,
    macBtnPrimary,
    macInput,
    TrafficLights,
} from '@/themes/mac/ui';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

function PasskeyLogin() {
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        onSuccess: (response) => router.visit(response.redirect ?? '/admin'),
    });

    if (!isSupported) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                onClick={verify}
                disabled={isLoading}
                className={macBtnGhost}
            >
                {isLoading ? 'waiting for key…' : '--passkey'}
            </button>
            {error && <FieldError message={error} />}
        </>
    );
}

export default function Login({ status, canResetPassword }: Props) {
    const form = useForm({ email: '', password: '', remember: false });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/login', { onFinish: () => form.reset('password') });
    };

    const row = 'flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3';
    const label = 'shrink-0 text-mac-amber sm:w-[100px]';

    return (
        <>
            <Head title="Log in" />

            <div className="flex min-h-screen items-start justify-center bg-mac-desktop font-mac text-mac-text sm:items-center sm:p-10">
                <div className="flex w-full max-w-[660px] flex-col overflow-hidden bg-mac-bg max-sm:min-h-screen sm:rounded-xl sm:border sm:border-mac-line sm:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                    <div className="flex h-10 items-center gap-4 border-b border-mac-line bg-mac-bar px-3.5">
                        <TrafficLights />
                        <div className="flex-1 text-center text-xs text-[#a3aab4]">
                            ssh admin@portfolio
                        </div>
                        <div className="w-[52px]" />
                    </div>

                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-4 px-5 py-7 text-sm leading-relaxed sm:px-9 sm:py-8"
                    >
                        <div>
                            <span className="text-mac-green">
                                guest@portfolio
                            </span>{' '}
                            <span className="text-mac-muted">%</span> sudo login
                            --admin
                        </div>
                        <div className="text-[13px] text-mac-muted">
                            Authorized personnel only. Registration is disabled.
                        </div>

                        {status && (
                            <div className="text-[13px] text-mac-green">
                                {status}
                            </div>
                        )}

                        <div className={row}>
                            <label htmlFor="email" className={label}>
                                email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoFocus
                                required
                                autoComplete="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                placeholder="admin@domain.com"
                                className={macInput}
                            />
                        </div>
                        <div className={row}>
                            <label htmlFor="password" className={label}>
                                password:
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                placeholder="••••••••"
                                className={macInput}
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:pl-[112px]">
                            <FieldError
                                message={
                                    form.errors.email ?? form.errors.password
                                }
                            />
                            <label className="flex items-center gap-2.5 text-[13px] text-mac-soft">
                                <input
                                    type="checkbox"
                                    checked={form.data.remember}
                                    onChange={(e) =>
                                        form.setData(
                                            'remember',
                                            e.target.checked,
                                        )
                                    }
                                    className="accent-mac-green"
                                />
                                remember this session
                            </label>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className={macBtnPrimary}
                                >
                                    {form.processing
                                        ? 'authenticating…'
                                        : 'login ↵'}
                                </button>
                                <PasskeyLogin />
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-mac-blue hover:underline"
                                    >
                                        forgot password?
                                    </Link>
                                )}
                                <Link
                                    href="/"
                                    className="text-mac-muted hover:text-mac-text"
                                >
                                    ← exit
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
