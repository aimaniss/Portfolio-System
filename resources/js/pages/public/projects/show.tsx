import { Head } from '@inertiajs/react';
import MacProject from '@/themes/mac/project';
import PsProject from '@/themes/powershell/project';
import ProProject from '@/themes/professional/project';
import type { ProjectShowProps } from '@/types/portfolio';

export default function ProjectShow({ theme, ...props }: ProjectShowProps) {
    return (
        <>
            <Head title={props.project.title}>
                {props.project.summary && (
                    <meta name="description" content={props.project.summary} />
                )}
            </Head>
            {theme === 'powershell' ? (
                <PsProject {...props} />
            ) : theme === 'professional' ? (
                <ProProject {...props} />
            ) : (
                <MacProject {...props} />
            )}
        </>
    );
}
