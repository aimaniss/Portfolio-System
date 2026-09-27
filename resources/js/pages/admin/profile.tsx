import { useForm } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import {
    btnSmallGhost,
    Field,
    linkBlue,
    linkRed,
    Panel,
} from '@/themes/mac/admin-ui';
import { macBtnPrimary, macInput, Placeholder } from '@/themes/mac/ui';
import type { Profile } from '@/types/portfolio';

type ProfileForm = {
    name: string;
    headline: string;
    bio: string;
    email: string;
    location: string;
    github_url: string;
    linkedin_url: string;
    avatar: File | null;
    resume: File | null;
    remove_avatar: boolean;
    remove_resume: boolean;
};

export default function ProfilePage({ profile }: { profile: Profile }) {
    const term = useTerm();
    const form = useForm<ProfileForm>({
        name: profile.name ?? '',
        headline: profile.headline ?? '',
        bio: profile.bio ?? '',
        email: profile.email ?? '',
        location: profile.location ?? '',
        github_url: profile.github_url ?? '',
        linkedin_url: profile.linkedin_url ?? '',
        avatar: null,
        resume: null,
        remove_avatar: false,
        remove_resume: false,
    });

    const avatarPreview = useMemo(
        () => (form.data.avatar ? URL.createObjectURL(form.data.avatar) : null),
        [form.data.avatar],
    );

    useEffect(
        () => () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        },
        [avatarPreview],
    );

    const avatar = form.data.remove_avatar
        ? null
        : (avatarPreview ?? profile.avatar_url);
    const hasResume =
        !!form.data.resume ||
        (!!profile.resume_url && !form.data.remove_resume);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/admin/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () =>
                form.setData((d) => ({
                    ...d,
                    avatar: null,
                    resume: null,
                    remove_avatar: false,
                    remove_resume: false,
                })),
        });
    };

    const text = (key: keyof ProfileForm, type = 'text', placeholder = '') => (
        <input
            id={key}
            type={type}
            value={form.data[key] as string}
            onChange={(e) => form.setData(key, e.target.value)}
            placeholder={placeholder}
            className={macInput}
        />
    );

    return (
        <AdminLayout title="Profile" cwd="~/admin/profile" command="vim whoami">
            <form
                onSubmit={submit}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7"
            >
                <div className="flex flex-col gap-4.5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="name"
                            htmlFor="name"
                            error={form.errors.name}
                        >
                            {text('name')}
                        </Field>
                        <Field
                            label="location"
                            htmlFor="location"
                            error={form.errors.location}
                        >
                            {text('location', 'text', 'Kuala Lumpur, MY')}
                        </Field>
                    </div>
                    <Field
                        label="headline"
                        hint="shown under your name"
                        htmlFor="headline"
                        error={form.errors.headline}
                    >
                        {text(
                            'headline',
                            'text',
                            'Web Developer · Software Engineer',
                        )}
                    </Field>
                    <Field label="bio" htmlFor="bio" error={form.errors.bio}>
                        <textarea
                            id="bio"
                            rows={5}
                            value={form.data.bio}
                            onChange={(e) =>
                                form.setData('bio', e.target.value)
                            }
                            className={`${macInput} resize-y`}
                        />
                    </Field>
                    <Field
                        label="email"
                        hint="public contact address"
                        htmlFor="email"
                        error={form.errors.email}
                    >
                        {text('email', 'email', 'you@domain.com')}
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="github_url"
                            htmlFor="github_url"
                            error={form.errors.github_url}
                        >
                            {text('github_url', 'url', 'https://github.com/…')}
                        </Field>
                        <Field
                            label="linkedin_url"
                            htmlFor="linkedin_url"
                            error={form.errors.linkedin_url}
                        >
                            {text(
                                'linkedin_url',
                                'url',
                                'https://linkedin.com/in/…',
                            )}
                        </Field>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <Panel head="$ file avatar.png" plain="Avatar">
                        <div className="flex flex-col gap-3 p-4 md:p-5">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="size-32 rounded-[10px] border border-mac-line object-cover"
                                />
                            ) : (
                                <Placeholder
                                    label="[no avatar]"
                                    className="size-32 rounded-[10px] border border-mac-line bg-mac-chip"
                                />
                            )}
                            <div className="flex flex-wrap gap-4 text-[13px]">
                                <label className={`${linkBlue} cursor-pointer`}>
                                    {term('upload…', 'Upload')}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            form.setData((d) => ({
                                                ...d,
                                                avatar:
                                                    e.target.files?.[0] ?? null,
                                                remove_avatar: false,
                                            }));
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                                {avatar && (
                                    <button
                                        type="button"
                                        className={linkRed}
                                        onClick={() =>
                                            form.setData((d) => ({
                                                ...d,
                                                avatar: null,
                                                remove_avatar:
                                                    !!profile.avatar_url,
                                            }))
                                        }
                                    >
                                        {term('rm', 'Remove')}
                                    </button>
                                )}
                            </div>
                            <div className="text-xs text-mac-muted">
                                png / jpg · max 4MB
                            </div>
                            {form.errors.avatar && (
                                <div className="text-xs text-mac-red">
                                    ✗ {form.errors.avatar}
                                </div>
                            )}
                        </div>
                    </Panel>

                    <Panel head="$ file resume.pdf" plain="Résumé">
                        <div className="flex flex-col gap-3 p-4 md:p-5">
                            <div className="truncate text-[13px]">
                                {form.data.resume ? (
                                    <span className="text-mac-amber">
                                        + {form.data.resume.name} (unsaved)
                                    </span>
                                ) : hasResume ? (
                                    <a
                                        href={profile.resume_url!}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={linkBlue}
                                    >
                                        resume.pdf ↗
                                    </a>
                                ) : (
                                    <span className="text-mac-muted">
                                        {term(
                                            'No such file.',
                                            'No résumé uploaded.',
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-[13px]">
                                <label className={`${linkBlue} cursor-pointer`}>
                                    {term('upload…', 'Upload')}
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            form.setData((d) => ({
                                                ...d,
                                                resume:
                                                    e.target.files?.[0] ?? null,
                                                remove_resume: false,
                                            }));
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                                {hasResume && (
                                    <button
                                        type="button"
                                        className={linkRed}
                                        onClick={() =>
                                            form.setData((d) => ({
                                                ...d,
                                                resume: null,
                                                remove_resume:
                                                    !!profile.resume_url,
                                            }))
                                        }
                                    >
                                        {term('rm', 'Remove')}
                                    </button>
                                )}
                            </div>
                            <div className="text-xs text-mac-muted">
                                pdf · max 10MB
                            </div>
                            {form.errors.resume && (
                                <div className="text-xs text-mac-red">
                                    ✗ {form.errors.resume}
                                </div>
                            )}
                        </div>
                    </Panel>

                    <div className="flex gap-2.5">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={`${macBtnPrimary} flex-1`}
                        >
                            {form.processing
                                ? term('saving…', 'Saving…')
                                : term(':w save', 'Save changes')}
                        </button>
                        {form.isDirty && (
                            <button
                                type="button"
                                onClick={() => form.reset()}
                                className={btnSmallGhost}
                            >
                                {term('undo', 'Discard')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
