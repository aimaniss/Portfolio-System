import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProjectImage } from '@/types/portfolio';

const arrow =
    'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-pro-ink shadow-md backdrop-blur transition hover:bg-white';

/** Main image with arrows and a counter, a thumbnail grid and a lightbox. */
export default function ProGallery({
    images,
    title,
}: {
    images: ProjectImage[];
    title: string;
}) {
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(false);
    const count = images.length;
    const current = images[active];

    const go = useCallback(
        (step: number) => setActive((i) => (i + step + count) % count),
        [count],
    );

    // Arrow keys and Esc while the lightbox is open.
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            } else if (e.key === 'ArrowRight') {
                go(1);
            } else if (e.key === 'ArrowLeft') {
                go(-1);
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [open, go]);

    if (!current) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="group relative overflow-hidden rounded-2xl border border-pro-line bg-pro-surface shadow-[0_12px_40px_rgba(22,24,29,0.06)]">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open full screen"
                    className="block w-full cursor-zoom-in"
                >
                    <img
                        src={current.url}
                        alt={current.caption ?? title}
                        className="aspect-video w-full object-cover object-top"
                    />
                </button>

                <span className="pointer-events-none absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-pro-ink opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    <Expand className="size-4" />
                </span>

                {count > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous image"
                            className={cn(arrow, 'left-3')}
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next image"
                            className={cn(arrow, 'right-3')}
                        >
                            <ChevronRight className="size-5" />
                        </button>
                        <span className="absolute right-3 bottom-3 rounded-full bg-pro-ink/75 px-2.5 py-1 text-xs font-medium text-white tabular-nums">
                            {active + 1} / {count}
                        </span>
                    </>
                )}
            </div>

            {current.caption && (
                <p className="text-sm text-pro-muted">{current.caption}</p>
            )}

            {count > 1 && (
                <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={`Show image ${i + 1}`}
                            aria-current={i === active}
                            className={cn(
                                'overflow-hidden rounded-lg ring-2 transition',
                                i === active
                                    ? 'ring-pro-accent'
                                    : 'opacity-60 ring-transparent hover:opacity-100',
                            )}
                        >
                            <img
                                src={img.url}
                                alt=""
                                loading="lazy"
                                className="aspect-video w-full object-cover object-top"
                            />
                        </button>
                    ))}
                </div>
            )}

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-pro-ink/90 p-4 backdrop-blur-sm md:p-10"
                >
                    <img
                        src={current.url}
                        alt={current.caption ?? title}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                    />
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                        <X className="size-5" />
                    </button>
                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    go(-1);
                                }}
                                aria-label="Previous image"
                                className="absolute left-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <ChevronLeft className="size-6" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    go(1);
                                }}
                                aria-label="Next image"
                                className="absolute right-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <ChevronRight className="size-6" />
                            </button>
                            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80 tabular-nums">
                                {active + 1} / {count}
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
