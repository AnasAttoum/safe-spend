import Header from '@/components/header/header';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: `404 page not found! ` };

export default function Page() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center">
                <div className="relative w-full h-[30rem]">
                    <Image src="/assets/pages/404.svg" alt="404" fill />
                </div>
                <Link href="/" className='w-full flex justify-center'>
                    <Button className="text-2xl p-5 w-full md:w-1/2">Go to Main Page</Button>
                </Link>
            </div>
        </>
    );
}
