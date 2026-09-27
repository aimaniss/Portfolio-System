import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { levelLabel, SKILL_LEVELS } from '@/lib/portfolio';
import { cn } from '@/lib/utils';
import {
    btnSmallGhost,
    btnSmallPrimary,
    confirmed,
    EmptyRow,
    linkBlue,
    linkRed,
    Panel,
} from '@/themes/mac/admin-ui';
import { FieldError, macInput } from '@/themes/mac/ui';
import type { Skill, SkillCategory } from '@/types/portfolio';

const smallInput = cn(macInput, 'py-1.5 text-[13px]');
const opts = { preserveScroll: true };

/** Optional proficiency tier; blank shows no level on the site. */
function LevelInput({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Level"
            className={cn(smallInput, 'w-auto shrink-0 pr-7')}
        >
            <option value="">no level</option>
            {Object.entries(SKILL_LEVELS).map(([v, label]) => (
                <option key={v} value={v}>
                    {label.toLowerCase()}
                </option>
            ))}
        </select>
    );
}

function SkillChip({
    skill,
    categories,
}: {
    skill: Skill;
    categories: SkillCategory[];
}) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        name: skill.name,
        level: skill.level === null ? '' : String(skill.level),
        skill_category_id: skill.skill_category_id,
    });

    const save = (e: FormEvent) => {
        e.preventDefault();
        form.put(`/admin/skills/${skill.id}`, {
            ...opts,
            onSuccess: () => setEditing(false),
        });
    };

    const destroy = () => {
        if (confirmed(`rm ${skill.name}?`)) {
            router.delete(`/admin/skills/${skill.id}`, opts);
        }
    };

    if (editing) {
        return (
            <form
                onSubmit={save}
                className="flex w-full flex-wrap items-center gap-2 rounded-md border border-mac-line p-2 sm:w-auto"
            >
                <input
                    autoFocus
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className={cn(smallInput, 'w-36 flex-1 sm:flex-none')}
                />
                <LevelInput
                    value={form.data.level}
                    onChange={(v) => form.setData('level', v)}
                />
                <select
                    value={form.data.skill_category_id}
                    onChange={(e) =>
                        form.setData(
                            'skill_category_id',
                            Number(e.target.value),
                        )
                    }
                    className={cn(smallInput, 'w-auto')}
                >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}/
                        </option>
                    ))}
                </select>
                <button type="submit" className={cn(linkBlue, 'text-[13px]')}>
                    save
                </button>
                <button
                    type="button"
                    onClick={() => {
                        form.reset();
                        setEditing(false);
                    }}
                    className="text-[13px] text-mac-muted hover:text-mac-text"
                >
                    esc
                </button>
                <FieldError message={form.errors.name ?? form.errors.level} />
            </form>
        );
    }

    return (
        <span className="group flex items-center overflow-hidden rounded border border-mac-line text-[13px]">
            <button
                type="button"
                onClick={() => setEditing(true)}
                title="Edit"
                className="px-2.5 py-1 text-mac-text hover:text-mac-bright"
            >
                {skill.name}
                {skill.level !== null && (
                    <span className="ml-1.5 text-mac-muted">
                        · {levelLabel(skill.level)?.toLowerCase()}
                    </span>
                )}
            </button>
            <button
                type="button"
                onClick={destroy}
                aria-label={`Delete ${skill.name}`}
                className="border-l border-mac-line px-2 py-1 text-mac-dim hover:text-mac-red"
            >
                ×
            </button>
        </span>
    );
}

function CategoryPanel({
    category,
    categories,
}: {
    category: SkillCategory;
    categories: SkillCategory[];
}) {
    const [renaming, setRenaming] = useState(false);
    const rename = useForm({ name: category.name });
    const add = useForm({
        name: '',
        level: '',
        skill_category_id: category.id,
    });

    const saveName = (e: FormEvent) => {
        e.preventDefault();
        rename.put(`/admin/skill-categories/${category.id}`, {
            ...opts,
            onSuccess: () => setRenaming(false),
        });
    };

    const addSkill = (e: FormEvent) => {
        e.preventDefault();
        add.post('/admin/skills', {
            ...opts,
            onSuccess: () => add.reset('name', 'level'),
        });
    };

    const destroy = () => {
        if (
            confirmed(
                `rm -r ${category.name}/? This also deletes its ${category.skills.length} skill(s).`,
            )
        ) {
            router.delete(`/admin/skill-categories/${category.id}`, opts);
        }
    };

    return (
        <Panel
            head={
                renaming ? (
                    <form
                        onSubmit={saveName}
                        className="flex items-center gap-2"
                    >
                        <input
                            autoFocus
                            value={rename.data.name}
                            onChange={(e) =>
                                rename.setData('name', e.target.value)
                            }
                            className={cn(smallInput, 'w-40')}
                        />
                        <button
                            type="submit"
                            className={cn(linkBlue, 'text-[13px]')}
                        >
                            save
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                rename.reset();
                                setRenaming(false);
                            }}
                            className="text-[13px] text-mac-muted"
                        >
                            esc
                        </button>
                    </form>
                ) : (
                    <span className="font-bold text-mac-blue">
                        {category.name}/
                    </span>
                )
            }
            aside={
                !renaming && (
                    <span className="flex shrink-0 gap-3 text-[13px]">
                        <button
                            type="button"
                            onClick={() => setRenaming(true)}
                            className={linkBlue}
                        >
                            mv
                        </button>
                        <button
                            type="button"
                            onClick={destroy}
                            className={linkRed}
                        >
                            rm
                        </button>
                    </span>
                )
            }
        >
            <div className="flex flex-col gap-3.5 p-4 md:p-5">
                <FieldError message={rename.errors.name} />
                <div className="flex flex-wrap gap-2">
                    {category.skills.length === 0 && (
                        <span className="text-[13px] text-mac-muted">
                            (empty)
                        </span>
                    )}
                    {category.skills.map((skill) => (
                        <SkillChip
                            key={skill.id}
                            skill={skill}
                            categories={categories}
                        />
                    ))}
                </div>
                <form onSubmit={addSkill} className="flex gap-2">
                    <input
                        value={add.data.name}
                        onChange={(e) => add.setData('name', e.target.value)}
                        placeholder={`touch ${category.name}/…`}
                        className={cn(smallInput, 'min-w-0 flex-1')}
                    />
                    <LevelInput
                        value={add.data.level}
                        onChange={(v) => add.setData('level', v)}
                    />
                    <button
                        type="submit"
                        disabled={add.processing || !add.data.name.trim()}
                        className={cn(
                            btnSmallGhost,
                            'py-1.5 disabled:opacity-50',
                        )}
                    >
                        + add
                    </button>
                </form>
                <FieldError message={add.errors.name ?? add.errors.level} />
            </div>
        </Panel>
    );
}

export default function Skills({
    categories,
}: {
    categories: SkillCategory[];
}) {
    const form = useForm({ name: '' });

    const addCategory = (e: FormEvent) => {
        e.preventDefault();
        form.post('/admin/skill-categories', {
            ...opts,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AdminLayout title="Skills" cwd="~/admin/skills" command="tree skills/">
            <form
                onSubmit={addCategory}
                className="flex flex-col gap-2 sm:flex-row"
            >
                <input
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="mkdir new-category"
                    className={cn(macInput, 'sm:max-w-xs')}
                />
                <button
                    type="submit"
                    disabled={form.processing || !form.data.name.trim()}
                    className={cn(btnSmallPrimary, 'disabled:opacity-50')}
                >
                    + category
                </button>
                <FieldError message={form.errors.name} />
            </form>

            <div className="text-xs text-mac-muted">
                # click a skill to rename, move it or set its level · × deletes
                it
            </div>

            {categories.length === 0 ? (
                <Panel>
                    <EmptyRow>
                        tree: skills/: No such file or directory
                    </EmptyRow>
                </Panel>
            ) : (
                <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
                    {categories.map((c) => (
                        <CategoryPanel
                            key={c.id}
                            category={c}
                            categories={categories}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
