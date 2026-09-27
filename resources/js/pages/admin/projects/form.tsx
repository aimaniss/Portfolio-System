import { Link, router, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import type { DragEvent, FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { useTerm } from '@/lib/skin';
import { cn } from '@/lib/utils';
import {
    btnSmallGhost,
    Check,
    confirmed,
    Field,
    linkBlue,
    linkRed,
    Panel,
    SkillPicker,
} from '@/themes/mac/admin-ui';
import { FieldError, macBtnPrimary, macInput } from '@/themes/mac/ui';
import type { Project, ProjectCompany, SkillCategory } from '@/types/portfolio';

type Props = {
    project: Project | null;
    categories: SkillCategory[];
    experiences: ProjectCompany[];
};

type ProjectFormData = {
    /** '' = personal project. */
    experience_id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    role: string;
    github_url: string;
    live_url: string;
    built_at: string;
    is_published: boolean;
    is_featured: boolean;
    sort_order: number;
    skill_ids: number[];
    images: File[];
};

const opts = { preserveScroll: true };

/** Object URLs for pending uploads, revoked when the list changes. */
function usePreviews(files: File[]): string[] {
    const urls = useMemo(
        () => files.map((f) => URL.createObjectURL(f)),
        [files],
    );

    useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);

    return urls;
}

function ProjectForm({ project, categories, experiences }: Props) {
    const term = useTerm();
    const form = useForm<ProjectFormData>({
        experience_id: project?.experience_id
            ? String(project.experience_id)
            : '',
        title: project?.title ?? '',
        slug: project?.slug ?? '',
        summary: project?.summary ?? '',
        description: project?.description ?? '',
        role: project?.role ?? '',
        github_url: project?.github_url ?? '',
        live_url: project?.live_url ?? '',
        built_at: project?.built_at?.slice(0, 10) ?? '',
        is_published: project?.is_published ?? false,
        is_featured: project?.is_featured ?? false,
        sort_order: project?.sort_order ?? 0,
        skill_ids: project?.skills.map((s) => s.id) ?? [],
        images: [],
    });
    const [dragging, setDragging] = useState(false);
    const previews = usePreviews(form.data.images);
    const images = project?.images ?? [];
    const imageErrors = Object.entries(form.errors)
        .filter(([key]) => key.startsWith('images'))
        .map(([, msg]) => msg);

    const addFiles = (files: FileList | null) => {
        const picked = Array.from(files ?? []).filter((f) =>
            f.type.startsWith('image/'),
        );

        if (picked.length) {
            form.setData('images', [...form.data.images, ...picked]);
        }
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(
            project ? `/admin/projects/${project.id}` : '/admin/projects',
            {
                ...opts,
                forceFormData: true,
                onSuccess: () => form.setData('images', []),
            },
        );
    };

    const destroy = () => {
        if (
            project &&
            confirmed(`rm -rf ${project.slug}? This cannot be undone.`)
        ) {
            router.delete(`/admin/projects/${project.id}`);
        }
    };

    const text = (
        key: 'title' | 'summary' | 'role' | 'github_url' | 'live_url',
        placeholder = '',
        type = 'text',
    ) => (
        <input
            id={key}
            type={type}
            value={form.data[key]}
            onChange={(e) => form.setData(key, e.target.value)}
            placeholder={placeholder}
            className={macInput}
        />
    );

    return (
        <AdminLayout
            title={project ? `Edit ${project.title}` : 'New project'}
            cwd="~/admin/projects"
            command={project ? `vim ${project.slug}` : 'vim new-project'}
            actions={
                <Link
                    href="/admin/projects"
                    className={cn(linkBlue, 'text-[13px]')}
                >
                    {term('← back', '← Back')}
                </Link>
            }
        >
            <form
                onSubmit={submit}
                className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7"
            >
                {/* left */}
                <div className="flex min-w-0 flex-col gap-4.5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="title"
                            htmlFor="title"
                            error={form.errors.title}
                        >
                            {text('title', 'portfolio-cms')}
                        </Field>
                        <Field
                            label="slug"
                            hint="blank = from title"
                            htmlFor="slug"
                            error={form.errors.slug}
                        >
                            <div className="flex items-center rounded-md border border-mac-line bg-mac-input focus-within:border-mac-green">
                                <span className="pl-3 text-mac-muted">
                                    projects/
                                </span>
                                <input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) =>
                                        form.setData('slug', e.target.value)
                                    }
                                    className="w-full min-w-0 bg-transparent py-2.5 pr-3 text-mac-bright focus:outline-none"
                                />
                            </div>
                        </Field>
                    </div>
                    <Field
                        label="summary"
                        hint="shown on cards"
                        htmlFor="summary"
                        error={form.errors.summary}
                    >
                        {text('summary', 'One line about the project')}
                    </Field>
                    <Field
                        label="description"
                        hint="markdown: ## heading, - list"
                        htmlFor="description"
                        error={form.errors.description}
                    >
                        <textarea
                            id="description"
                            rows={9}
                            value={form.data.description}
                            onChange={(e) =>
                                form.setData('description', e.target.value)
                            }
                            placeholder={
                                '## About\nThe problem, what you built, what you learned.\n\n## Highlights\n- …'
                            }
                            className={cn(macInput, 'resize-y')}
                        />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="github_url"
                            htmlFor="github_url"
                            error={form.errors.github_url}
                        >
                            {text('github_url', 'https://github.com/…', 'url')}
                        </Field>
                        <Field
                            label="live_url"
                            htmlFor="live_url"
                            error={form.errors.live_url}
                        >
                            {text('live_url', 'https://…', 'url')}
                        </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field
                            label="role"
                            htmlFor="role"
                            error={form.errors.role}
                        >
                            {text('role', 'solo developer')}
                        </Field>
                        <Field
                            label="built_at"
                            htmlFor="built_at"
                            error={form.errors.built_at}
                        >
                            <input
                                id="built_at"
                                type="date"
                                value={form.data.built_at}
                                onChange={(e) =>
                                    form.setData('built_at', e.target.value)
                                }
                                className={cn(macInput, '[color-scheme:dark]')}
                            />
                        </Field>
                        <Field
                            label="sort_order"
                            hint="lower first"
                            htmlFor="sort_order"
                            error={form.errors.sort_order}
                        >
                            <input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={form.data.sort_order}
                                onChange={(e) =>
                                    form.setData(
                                        'sort_order',
                                        Number(e.target.value) || 0,
                                    )
                                }
                                className={macInput}
                            />
                        </Field>
                    </div>

                    {/* images */}
                    <div className="flex flex-col gap-2.5">
                        <div className="text-[13px] text-mac-amber">
                            {term('images', 'Images')}{' '}
                            <span className="text-mac-muted">
                                {term(
                                    '# ★ = cover · new files upload on save',
                                    '— the starred image is the cover; new files upload when you save',
                                )}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className={cn(
                                        'flex flex-col overflow-hidden rounded-lg bg-mac-panel',
                                        img.is_cover
                                            ? 'border-2 border-mac-green'
                                            : 'border border-mac-line',
                                    )}
                                >
                                    <img
                                        src={img.url}
                                        alt=""
                                        className="h-24 w-full bg-mac-shot object-cover"
                                    />
                                    <div className="flex items-center px-2.5 py-1.5 text-xs">
                                        {img.is_cover ? (
                                            <span className="font-bold text-mac-green">
                                                ★ cover
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.post(
                                                        `/admin/projects/${project!.id}/images/${img.id}/cover`,
                                                        {},
                                                        opts,
                                                    )
                                                }
                                                className={linkBlue}
                                            >
                                                {term(
                                                    'set cover',
                                                    'Set as cover',
                                                )}
                                            </button>
                                        )}
                                        <span className="flex-1" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                confirmed('rm this image?') &&
                                                router.delete(
                                                    `/admin/projects/${project!.id}/images/${img.id}`,
                                                    opts,
                                                )
                                            }
                                            className={linkRed}
                                        >
                                            {term('rm', 'Remove')}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {form.data.images.map((file, i) => (
                                <div
                                    key={`${file.name}-${i}`}
                                    className="flex flex-col overflow-hidden rounded-lg border border-dashed border-mac-amber bg-mac-panel"
                                >
                                    <img
                                        src={previews[i]}
                                        alt=""
                                        className="h-24 w-full bg-mac-shot object-cover"
                                    />
                                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-xs">
                                        <span className="truncate text-mac-amber">
                                            + {file.name}
                                        </span>
                                        <span className="flex-1" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                form.setData(
                                                    'images',
                                                    form.data.images.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                )
                                            }
                                            className={linkRed}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={cn(
                                    'flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-2 text-center text-xs text-mac-muted',
                                    dragging
                                        ? 'border-mac-green bg-mac-green/5'
                                        : 'border-mac-dim hover:border-mac-muted',
                                )}
                            >
                                <span className="text-[22px] text-mac-soft">
                                    +
                                </span>
                                <span>
                                    drop images or{' '}
                                    <span className="text-mac-blue">
                                        browse
                                    </span>
                                </span>
                                <span>png, jpg · max 5MB</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        addFiles(e.target.files);
                                        e.target.value = '';
                                    }}
                                />
                            </label>
                        </div>
                        {imageErrors.map((msg, i) => (
                            <FieldError key={i} message={msg} />
                        ))}
                        {form.progress && (
                            <div className="text-xs text-mac-amber">
                                uploading… {form.progress.percentage}%
                            </div>
                        )}
                    </div>
                </div>

                {/* right */}
                <div className="flex flex-col gap-5">
                    <Panel head="$ owner" plain="Owner">
                        <div className="flex flex-col gap-2.5 p-4 md:p-5">
                            <select
                                id="experience_id"
                                value={form.data.experience_id}
                                onChange={(e) =>
                                    form.setData(
                                        'experience_id',
                                        e.target.value,
                                    )
                                }
                                className={macInput}
                            >
                                <option value="">
                                    {term(
                                        'personal — my own project',
                                        'Personal project',
                                    )}
                                </option>
                                {experiences.map((exp) => (
                                    <option key={exp.id} value={exp.id}>
                                        {term(
                                            `work @ ${exp.company} — ${exp.position}`,
                                            `${exp.company} (${exp.position})`,
                                        )}
                                    </option>
                                ))}
                            </select>
                            <div className="text-xs text-mac-muted">
                                {form.data.experience_id
                                    ? 'Listed under this job in work experience.'
                                    : 'Listed in the projects section.'}
                            </div>
                            {experiences.length === 0 && (
                                <div className="text-xs text-mac-muted">
                                    Add a job under experiences/ to file work
                                    projects.
                                </div>
                            )}
                            <FieldError message={form.errors.experience_id} />
                        </div>
                    </Panel>

                    <Panel head="$ publish" plain="Visibility">
                        <div className="flex flex-col gap-3.5 p-4 md:p-5">
                            <Check
                                checked={form.data.is_published}
                                onChange={(v) =>
                                    form.setData('is_published', v)
                                }
                            >
                                {term('published', 'Published')}
                            </Check>
                            <Check
                                checked={form.data.is_featured}
                                onChange={(v) => form.setData('is_featured', v)}
                            >
                                {term(
                                    'featured on home',
                                    'Featured on home page',
                                )}
                            </Check>
                            <div className="mt-1.5 flex gap-2.5">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className={cn(macBtnPrimary, 'flex-1')}
                                >
                                    {form.processing
                                        ? term('saving…', 'Saving…')
                                        : term(':w save', 'Save project')}
                                </button>
                                <Link
                                    href="/admin/projects"
                                    className={btnSmallGhost}
                                >
                                    {term(':q', 'Cancel')}
                                </Link>
                            </div>
                            {project && (
                                <a
                                    href={`/projects/${project.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={cn(linkBlue, 'text-[13px]')}
                                >
                                    {term('view on site ↗', 'View on site ↗')}
                                </a>
                            )}
                        </div>
                    </Panel>

                    <Panel head="$ stack # skills used" plain="Skills used">
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

                    {project && (
                        <div className="flex flex-col gap-2.5 rounded-[10px] border border-mac-red/40 bg-mac-red/5 p-4 md:p-5">
                            <div className="text-[13px] text-mac-red">
                                {term(
                                    `$ rm -rf ${project.slug}`,
                                    'Delete project',
                                )}
                            </div>
                            <div className="text-[13px] text-mac-soft">
                                Deletes the project and all its images.
                            </div>
                            <button
                                type="button"
                                onClick={destroy}
                                className="self-start rounded-md border border-mac-red px-3.5 py-2 text-[13px] text-mac-red hover:bg-mac-red/10"
                            >
                                {term('delete project', 'Delete this project')}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}

export default function ProjectFormPage(props: Props) {
    // Remount after each save so the form picks up server-normalised values.
    return <ProjectForm key={props.project?.updated_at ?? 'new'} {...props} />;
}
