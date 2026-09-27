import {
    siAlpinedotjs,
    siAngular,
    siAnsible,
    siApache,
    siApachekafka,
    siBootstrap,
    siBun,
    siC,
    siCloudflare,
    siComposer,
    siCplusplus,
    siCss,
    siCypress,
    siDart,
    siDeno,
    siDjango,
    siDocker,
    siDotnet,
    siElasticsearch,
    siExpress,
    siFigma,
    siFirebase,
    siFlutter,
    siGit,
    siGithub,
    siGithubactions,
    siGitlab,
    siGo,
    siGooglecloud,
    siGrafana,
    siGraphql,
    siHtml5,
    siInertia,
    siJavascript,
    siJenkins,
    siJest,
    siJquery,
    siKotlin,
    siKubernetes,
    siLaravel,
    siLinux,
    siLivewire,
    siMariadb,
    siMongodb,
    siMysql,
    siNestjs,
    siNetlify,
    siNextdotjs,
    siNginx,
    siNodedotjs,
    siNpm,
    siNuxt,
    siPhp,
    siPnpm,
    siPostgresql,
    siPostman,
    siPrisma,
    siPrometheus,
    siPython,
    siRabbitmq,
    siReact,
    siRedis,
    siRust,
    siSass,
    siShopify,
    siSpring,
    siSqlite,
    siStripe,
    siSupabase,
    siSvelte,
    siSwift,
    siTailwindcss,
    siTerraform,
    siTypescript,
    siUbuntu,
    siUptimekuma,
    siVercel,
    siVite,
    siVitest,
    siVuedotjs,
    siWordpress,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
import { cn } from '@/lib/utils';

/**
 * Logos for common skill names (simple-icons, CC0). Keys are normalised:
 * lower case with spaces, dots and dashes removed ("node.js" → "nodejs").
 * Only these icons are bundled; anything else falls back to a monogram.
 */
const ICONS: Record<string, SimpleIcon> = {
    alpine: siAlpinedotjs,
    alpinejs: siAlpinedotjs,
    angular: siAngular,
    ansible: siAnsible,
    apache: siApache,
    kafka: siApachekafka,
    blade: siLaravel,
    bootstrap: siBootstrap,
    bun: siBun,
    c: siC,
    cloudflare: siCloudflare,
    composer: siComposer,
    cpp: siCplusplus,
    'c++': siCplusplus,
    css: siCss,
    css3: siCss,
    cypress: siCypress,
    dart: siDart,
    deno: siDeno,
    django: siDjango,
    docker: siDocker,
    dotnet: siDotnet,
    net: siDotnet,
    elasticsearch: siElasticsearch,
    express: siExpress,
    expressjs: siExpress,
    figma: siFigma,
    firebase: siFirebase,
    flutter: siFlutter,
    git: siGit,
    github: siGithub,
    githubactions: siGithubactions,
    gitlab: siGitlab,
    go: siGo,
    golang: siGo,
    gcp: siGooglecloud,
    googlecloud: siGooglecloud,
    grafana: siGrafana,
    graphql: siGraphql,
    html: siHtml5,
    html5: siHtml5,
    inertia: siInertia,
    inertiajs: siInertia,
    javascript: siJavascript,
    js: siJavascript,
    jenkins: siJenkins,
    jest: siJest,
    jquery: siJquery,
    kotlin: siKotlin,
    kubernetes: siKubernetes,
    k8s: siKubernetes,
    laravel: siLaravel,
    linux: siLinux,
    livewire: siLivewire,
    mariadb: siMariadb,
    mongodb: siMongodb,
    mysql: siMysql,
    nestjs: siNestjs,
    netlify: siNetlify,
    nextjs: siNextdotjs,
    nginx: siNginx,
    node: siNodedotjs,
    nodejs: siNodedotjs,
    npm: siNpm,
    nuxt: siNuxt,
    nuxtjs: siNuxt,
    php: siPhp,
    pnpm: siPnpm,
    postgres: siPostgresql,
    postgresql: siPostgresql,
    postman: siPostman,
    prisma: siPrisma,
    prometheus: siPrometheus,
    python: siPython,
    rabbitmq: siRabbitmq,
    react: siReact,
    reactjs: siReact,
    reactnative: siReact,
    redis: siRedis,
    rust: siRust,
    sass: siSass,
    scss: siSass,
    shopify: siShopify,
    spring: siSpring,
    springboot: siSpring,
    sqlite: siSqlite,
    stripe: siStripe,
    supabase: siSupabase,
    svelte: siSvelte,
    swift: siSwift,
    tailwind: siTailwindcss,
    tailwindcss: siTailwindcss,
    terraform: siTerraform,
    typescript: siTypescript,
    ts: siTypescript,
    ubuntu: siUbuntu,
    uptimekuma: siUptimekuma,
    vercel: siVercel,
    vite: siVite,
    vitest: siVitest,
    vue: siVuedotjs,
    vuejs: siVuedotjs,
    wordpress: siWordpress,
};

export function techIcon(name: string): SimpleIcon | null {
    return ICONS[name.toLowerCase().replace(/[\s.\-_]/g, '')] ?? null;
}

/** Brand logo for a skill, or a two-letter monogram when there is none. */
export function TechIcon({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const icon = techIcon(name);

    if (!icon) {
        return (
            <span
                aria-hidden
                className={cn(
                    'flex items-center justify-center rounded-md bg-pro-accent-soft text-[11px] font-semibold text-pro-accent uppercase',
                    className,
                )}
            >
                {name.replace(/[^a-z0-9]/gi, '').slice(0, 2)}
            </span>
        );
    }

    return (
        <svg
            role="img"
            aria-hidden
            viewBox="0 0 24 24"
            fill={`#${icon.hex}`}
            className={className}
        >
            <path d={icon.path} />
        </svg>
    );
}

const normalise = (s: string) => s.toLowerCase().replace(/[\s.\-_]/g, '');

/**
 * Display name for a skill: the official spelling when the logo matches it
 * ("node.js" → "Node.js", "github-actions" → "GitHub Actions"), otherwise the
 * stored name in title case ("react-native" → "React Native").
 */
export function techLabel(name: string): string {
    const icon = techIcon(name);

    if (icon && normalise(icon.title) === normalise(name)) {
        return icon.title;
    }

    return name
        .split(/[\s-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
