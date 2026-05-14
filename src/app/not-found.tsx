import Header from '@/components/header/header';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/localization/navigation';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("404"),
  }
}

export default function Page() {
    const t = useTranslations()
    return (
        <>
            <Header />
            <div className="flex flex-col items-center">
                <div className="relative w-full h-120">
                    <Image src="/assets/pages/404.svg" alt="404" fill />
                </div>
                <Link href="/" className='w-full flex justify-center'>
                    <Button className="text-2xl p-5 w-full md:w-1/2">{t("go-to-main-page")}</Button>
                </Link>
            </div>
        </>
    );
}
