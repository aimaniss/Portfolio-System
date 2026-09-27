import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { cn } from '@/lib/utils';
import {
    btnSmallGhost,
    Check,
    Field,
    linkBlue,
    Panel,
    SkillPicker,
} from '@/themes/mac/admin-ui';
import { macBtnPrimary, macInput } from '@/themes/mac/ui';
import type { Experience, SkillCategory } from '@/types/portfolio';

export default function ExperienceForm({
    experience,
    categories,
}: {
    experience: Experience | null;
    categories: SkillCategory[];
}) {
    const form = useForm({
        company: experience?.company ?? '',
        position: experience?.position ?? '',
        start_date: experience?.start_date?.slice(0, 10) ?? '',
        end_date: experience?.end_date?.slice(0, 10) ?? '',
        description: experience?.description ?? '',
        skill_ids: experience?.skills.map((s) => s.id) ?? [],
    });
    const current = form.data.end_date === '';

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (experience) {
            form.put(`/admin/experiences/${experience.id}`);
        } else {
            form.post('/admin/experiences');
        }
    };

    return (
        <AdminLayout
            title={experience ? 'Edit experience' : 'New experience'}
            cwd="~/admin/experiences"
            command={
                experience ? `vim ${experience.company}` : 'touch new-entry'
            }
            actions={
                <Link
                    href="/admin/experiences"
                    className={cn(linkBlue, 'text-[13px]')}
                >
                    ← back
                </Link>
            }
        >
            <form
                onSubmit={submit}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7"
            >
                <div className="flex flex-col gap-4.5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="position"
                            htmlFor="position"
                            error={form.errors.position}
                        >
                            <input
                                id="position"
                                value={form.data.position}
                                onChange={(e) =>
                                    form.setData('position', e.target.value)
                                }
                                placeholder="Software Engineer"
                                className={macInput}
                            />
                        </Field>
                        <Field
                            label="company"
                            htmlFor="company"
                            error={form.errors.company}
                        >
                            <input
                                id="company"
                                value={form.data.company}
                                onChange={(e) =>
                                    form.setData('company', e.target.value)
                                }
                                placeholder="Acme Sdn Bhd"
                                className={macInput}
                            />
                        </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="start_date"
                            htmlFor="start_date"
                            error={form.errors.start_date}
                        >
                            <input
                                id="start_date"
                                type="date"
                                value={form.data.start_date}
                                onChange={(e) =>
                                    form.setData('start_date', e.target.value)
                                }
                                className={cn(macInput, '[color-scheme:dark]')}
                            />
                        </Field>
                        <Field
                            label="end_date"
                            htmlFor="end_date"
                            error={form.errors.end_date}
                        >
                            <input
                                id="end_date"
                                type="date"
                                value={form.data.end_date}
                                onChange={(e) =>
                                    form.setData('end_date', e.target.value)
                                }
                                disabled={current}
                                className={cn(
                                    macInput,
                                    '[color-scheme:dark] disabled:opacity-40',
                                )}
                            />
                            <Check
                                checked={current}
                                onChange={(on) =>
                                    form.setData(
                                        'end_date',
                                        on
                                            ? ''
                                            : new Date()
                                                  .toISOString()
                                                  .slice(0, 10),
                                    )
                                }
                            >
                                <span className="text-[13px] text-mac-soft">
                                    I work here now
                                </span>
                            </Check>
                        </Field>
                    </div>
                    <Field
                        label="description"
                        hint="what you built and owned"
                        htmlFor="description"
                        error={form.errors.description}
                    >
                        <textarea
                            id="description"
                            rows={6}
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            className={cn(macInput, 'resize-y')}
                        />
                    </Field>
                </div>

                <div className="flex flex-col gap-5">
                    <Panel head="$ stack # skills used">
                        <div className="p-4 md:p-5">
                            <SkillPicker
                                categories={categories}
                                value={form.data.skill_ids}
                                onChange={(ids) =>
                                    form.setData('skill_ids', ids)
                                }
                            />
                        </div>
                    </Panel>
                    <div className="flex gap-2.5">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className={cn(macBtnPrimary, 'flex-1')}
                        >
                            {form.processing ? 'saving…' : ':w save'}
                        </button>
                        <Link
                            href="/admin/experiences"
                            className={btnSmallGhost}
                        >
                            :q
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
