import { Head } from '@inertiajs/react';
import MacProjects from '@/themes/mac/projects';
import PsProjects from '@/themes/powershell/projects';
import ProProjects from '@/themes/professional/projects';
import type { ProjectsProps } from '@/types/portfolio';

export default function Projects({ theme, ...props }: ProjectsProps) {
    return (
        <>
            <Head title="Projects" />
            {theme === 'powershell' ? (
                <PsProjects {...props} />
            ) : theme === 'professional' ? (
                <ProProjects {...props} />
            ) : (
                <MacProjects {...props} />
            )}
        </>
    );
}
