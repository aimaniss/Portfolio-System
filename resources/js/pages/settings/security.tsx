import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManageTwoFactor from '@/components/manage-two-factor';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import SettingsTabs from '@/components/settings-tabs';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import { cn } from '@/lib/utils';
import { Field, Panel } from '@/themes/mac/admin-ui';
import { macBtnPrimary, macInput } from '@/themes/mac/ui';

// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

export default function SecuritySettings(props: Props) {
    const term = useTerm();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AdminLayout
            title="Security settings"
            cwd="~/admin/settings"
            command="passwd"
        >
            <SettingsTabs />

            <div className="flex max-w-2xl flex-col gap-5">
                <Panel head="$ passwd # change password" plain="Password">
                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className="flex flex-col gap-4.5 p-4 md:p-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                <p className="text-[13px] text-mac-muted">
                                    {term(
                                        '# use a long, random password',
                                        'Use a long, random password to keep the admin secure.',
                                    )}
                                </p>
                                <Field
                                    label="current_password"
                                    htmlFor="current_password"
                                    error={errors.current_password}
                                >
                                    <input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        autoComplete="current-password"
                                        className={macInput}
                                    />
                                </Field>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field
                                        label="new_password"
                                        htmlFor="password"
                                        error={errors.password}
                                    >
                                        <input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            autoComplete="new-password"
                                            {...{
                                                passwordrules:
                                                    props.passwordRules,
                                            }}
                                            className={macInput}
                                        />
                                    </Field>
                                    <Field
                                        label="confirm_password"
                                        htmlFor="password_confirmation"
                                        error={errors.password_confirmation}
                                    >
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            autoComplete="new-password"
                                            {...{
                                                passwordrules:
                                                    props.passwordRules,
                                            }}
                                            className={macInput}
                                        />
                                    </Field>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className={cn(
                                            macBtnPrimary,
                                            'w-full sm:w-auto',
                                        )}
                                    >
                                        {processing
                                            ? term('updating…', 'Updating…')
                                            : term(
                                                  'passwd --update',
                                                  'Update password',
                                              )}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </Panel>

                {props.canManageTwoFactor && (
                    <Panel className="p-4 md:p-5">
                        <ManageTwoFactor
                            canManageTwoFactor={props.canManageTwoFactor}
                            requiresConfirmation={props.requiresConfirmation}
                            twoFactorEnabled={props.twoFactorEnabled}
                        />
                    </Panel>
                )}

                {props.canManagePasskeys && (
                    <Panel className="p-4 md:p-5">
                        <ManagePasskeys
                            canManagePasskeys={props.canManagePasskeys}
                            passkeys={props.passkeys}
                        />
                    </Panel>
                )}
            </div>
        </AdminLayout>
    );
}
