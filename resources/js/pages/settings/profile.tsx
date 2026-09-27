import { Form, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import SettingsTabs from '@/components/settings-tabs';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import { cn } from '@/lib/utils';
import { Field, Panel } from '@/themes/mac/admin-ui';
import { macBtnPrimary, macInput } from '@/themes/mac/ui';
import type { Auth } from '@/types';

/** The admin's login identity (not the public profile). */
export default function AccountSettings() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const term = useTerm();

    return (
        <AdminLayout
            title="Account settings"
            cwd="~/admin/settings"
            command="whoami --account"
        >
            <SettingsTabs />

            <Panel
                head="$ account # login name and email"
                plain="Account"
                className="max-w-2xl"
            >
                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="flex flex-col gap-4.5 p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <p className="text-[13px] text-mac-muted">
                                {term(
                                    '# used to sign in; the public profile lives under profile/',
                                    'Used to sign in. Your public profile is edited under Profile.',
                                )}
                            </p>
                            <Field
                                label="name"
                                htmlFor="name"
                                error={errors.name}
                            >
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    className={macInput}
                                />
                            </Field>
                            <Field
                                label="email"
                                hint={term('login email', 'used to sign in')}
                                htmlFor="email"
                                error={errors.email}
                            >
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    className={macInput}
                                />
                            </Field>
                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className={cn(
                                        macBtnPrimary,
                                        'w-full sm:w-auto',
                                    )}
                                >
                                    {processing
                                        ? term('saving…', 'Saving…')
                                        : term(':w save', 'Save changes')}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </Panel>
        </AdminLayout>
    );
}
