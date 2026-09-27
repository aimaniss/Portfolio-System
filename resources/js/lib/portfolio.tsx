import { useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

/** "2024-03-01" → "2024-03" */
export function ym(date: string | null | undefined): string {
    return date ? date.slice(0, 7) : '';
}

/** "2024-03-01" → "Mar 2024" */
export function monthYear(date: string | null | undefined): string {
    if (!date) {
        return '';
    }

    const d = new Date(`${date.slice(0, 10)}T00:00:00`);

    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function year(date: string | null | undefined): string {
    return date ? date.slice(0, 4) : '';
}

export function allSkillCount(categories: { skills: unknown[] }[]): number {
    return categories.reduce((n, c) => n + c.skills.length, 0);
}

/** Shared contact form state; each theme renders its own markup. */
export function useContactForm() {
    const form = useForm({ name: '', email: '', body: '' });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/contact', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return { form, submit };
}

type MdClasses = {
    h2?: string;
    h3?: string;
    p?: string;
    ul?: string;
    li?: string;
    bullet?: ReactNode;
    headingPrefix?: ReactNode;
};

/**
 * Tiny markdown renderer for project descriptions:
 * supports ## / ### headings, "- " bullet lists and paragraphs.
 */
export function Markdown({
    source,
    classes = {},
}: {
    source: string | null;
    classes?: MdClasses;
}) {
    if (!source) {
        return null;
    }

    const blocks: ReactNode[] = [];
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    let para: string[] = [];
    let list: string[] = [];

    const flushPara = () => {
        if (para.length) {
            blocks.push(
                <p key={blocks.length} className={classes.p}>
                    {para.join(' ')}
                </p>,
            );
            para = [];
        }
    };

    const flushList = () => {
        if (list.length) {
            blocks.push(
                <ul key={blocks.length} className={classes.ul}>
                    {list.map((item, i) => (
                        <li key={i} className={classes.li}>
                            {classes.bullet}
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>,
            );
            list = [];
        }
    };

    for (const raw of lines) {
        const line = raw.trimEnd();

        if (/^#{2,3}\s/.test(line)) {
            flushPara();
            flushList();
            const level = line.startsWith('###') ? 3 : 2;
            const text = line.replace(/^#{2,3}\s+/, '');
            blocks.push(
                level === 2 ? (
                    <h2 key={blocks.length} className={classes.h2}>
                        {classes.headingPrefix}
                        {text}
                    </h2>
                ) : (
                    <h3 key={blocks.length} className={classes.h3}>
                        {text}
                    </h3>
                ),
            );
        } else if (/^[-*]\s/.test(line)) {
            flushPara();
            list.push(line.replace(/^[-*]\s+/, ''));
        } else if (line.trim() === '') {
            flushPara();
            flushList();
        } else {
            flushList();
            para.push(line.trim());
        }
    }

    flushPara();
    flushList();

    return <>{blocks}</>;
}

/** 80 → "████████░░" (terminal-style proficiency bar). */
export function levelBlocks(level: number, width = 10): [string, string] {
    const filled = Math.round(
        (Math.min(Math.max(level, 0), 100) / 100) * width,
    );

    return ['█'.repeat(filled), '░'.repeat(width - filled)];
}
