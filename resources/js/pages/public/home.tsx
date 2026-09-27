import { Head } from '@inertiajs/react';
import MacHome from '@/themes/mac/home';
import PsHome from '@/themes/powershell/home';
import ProHome from '@/themes/professional/home';
import type { HomeProps } from '@/types/portfolio';

export default function Home({ theme, ...props }: HomeProps) {
    return (
        <>
            <Head title="Portfolio">
                {props.profile.headline && (
                    <meta name="description" content={props.profile.headline} />
                )}
            </Head>
            {theme === 'powershell' ? (
                <PsHome {...props} />
            ) : theme === 'professional' ? (
                <ProHome {...props} />
            ) : (
                <MacHome {...props} />
            )}
        </>
    );
}
