import '@fontsource/cascadia-code/400.css';
import '@fontsource/cascadia-code/700.css';
import { usePage } from '@inertiajs/react';
import type { ThemeName } from '@/types/portfolio';

/** Active site theme, shared by HandleInertiaRequests. The admin follows it. */
export function useSkin(): ThemeName {
    return usePage<{ skin?: ThemeName }>().props.skin ?? 'mac';
}

/** Scope class that re-points the mac-* tokens (see portfolio.css). */
export function skinClass(skin: ThemeName): string {
    return skin === 'mac' ? '' : `skin-${skin}`;
}

/**
 * Terminal wording for the mac and PowerShell skins, plain wording for the
 * professional one: term(':w save', 'Save').
 */
export function useTerm() {
    const skin = useSkin();

    return <T>(terminal: T, plain: T): T =>
        skin === 'professional' ? plain : terminal;
}
