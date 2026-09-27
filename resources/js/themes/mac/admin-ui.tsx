import type { ReactNode } from 'react';
import { useSkin } from '@/lib/skin';
import { cn } from '@/lib/utils';
import type { SkillCategory } from '@/types/portfolio';
import { FieldError, macLabel } from './ui';

export const panel =
    'flex flex-col rounded-[10px] border border-mac-rule bg-mac-panel';
export const panelHead =
    'flex items-center gap-3 border-b border-mac-rule px-4 py-3 text-mac-muted md:px-5 md:py-3.5';
export const linkBlue = 'text-mac-blue hover:underline';
export const linkRed = 'text-mac-red hover:underline';
export const btnSmall =
    'inline-flex items-center justify-center rounded-md px-3.5 py-2 text-[13px] md:text-sm';
export const btnSmallPrimary = cn(
    btnSmall,
    'bg-mac-green font-bold text-mac-desktop hover:brightness-110 disabled:opacity-60',
);
export const btnSmallGhost = cn(
    btnSmall,
    'border border-mac-line text-mac-text hover:border-mac-muted',
);

/** "github_url" → "GitHub URL", "built_at" → "Built at" */
function humanize(label: string): string {
    const words = label.replace(/_/g, ' ');
    const text = words.charAt(0).toUpperCase() + words.slice(1);

    return text
        .replace(/url/i, 'URL')
        .replace(/^Github/, 'GitHub')
        .replace(/^Linkedin/, 'LinkedIn');
}

export function Panel({
    head,
    plain,
    aside,
    children,
    className,
}: {
    /** Terminal-style heading, e.g. "$ publish". */
    head?: ReactNode;
    /** Heading used by the professional skin, e.g. "Publish". */
    plain?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    const pro = useSkin() === 'professional';
    const title = pro ? (plain ?? head) : head;

    return (
        <div className={cn(panel, pro && 'rounded-xl shadow-sm', className)}>
            {title && (
                <div
                    className={cn(
                        panelHead,
                        pro && 'font-semibold text-mac-text md:py-4',
                    )}
                >
                    <span className="min-w-0 truncate">{title}</span>
                    <span className="flex-1" />
                    {aside}
                </div>
            )}
            {children}
        </div>
    );
}

export function Field({
    label,
    hint,
    error,
    htmlFor,
    children,
    className,
}: {
    label: string;
    hint?: string;
    error?: string;
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}) {
    const pro = useSkin() === 'professional';

    return (
        <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
            <label
                htmlFor={htmlFor}
                className={cn(macLabel, pro && 'text-sm font-medium')}
            >
                {pro ? humanize(label) : label}
                {hint && (
                    <span className="font-normal text-mac-muted">
                        {pro ? ` — ${hint}` : ` # ${hint}`}
                    </span>
                )}
            </label>
            {children}
            <FieldError message={error} />
        </div>
    );
}

export function Check({
    checked,
    onChange,
    children,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: ReactNode;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-4 accent-mac-green"
            />
            {children}
        </label>
    );
}

/** Toggleable skill chips, grouped by category. */
export function SkillPicker({
    categories,
    value,
    onChange,
}: {
    categories: SkillCategory[];
    value: number[];
    onChange: (ids: number[]) => void;
}) {
    const pro = useSkin() === 'professional';
    const toggle = (id: number) =>
        onChange(
            value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
        );

    if (categories.every((c) => c.skills.length === 0)) {
        return (
            <div className="text-[13px] text-mac-muted">
                No skills yet — add some under skills/.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {categories
                .filter((c) => c.skills.length > 0)
                .map((cat) => (
                    <div key={cat.id} className="flex flex-col gap-1.5">
                        <div
                            className={cn(
                                'text-xs',
                                pro
                                    ? 'font-medium text-mac-muted capitalize'
                                    : 'text-mac-blue',
                            )}
                        >
                            {pro ? cat.name : `${cat.name}/`}
                        </div>
                        <div className="flex flex-wrap gap-2 text-[13px]">
                            {cat.skills.map((skill) => {
                                const on = value.includes(skill.id);

                                return (
                                    <label
                                        key={skill.id}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1',
                                            on
                                                ? 'border-mac-green text-mac-bright'
                                                : 'border-mac-line text-mac-soft hover:border-mac-muted',
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={on}
                                            onChange={() => toggle(skill.id)}
                                            className="accent-mac-green"
                                        />
                                        {skill.name}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export function StatusDot({ published }: { published: boolean }) {
    if (useSkin() === 'professional') {
        return (
            <span
                className={cn(
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    published
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-mac-chip text-mac-muted',
                )}
            >
                {published ? 'Published' : 'Draft'}
            </span>
        );
    }

    return published ? (
        <span className="text-mac-green">● published</span>
    ) : (
        <span className="text-mac-muted">○ draft</span>
    );
}

export function EmptyRow({ children }: { children: ReactNode }) {
    return (
        <div className="px-4 py-6 text-center text-mac-muted md:px-5">
            {children}
        </div>
    );
}

export function confirmed(message: string): boolean {
    return window.confirm(message);
}
