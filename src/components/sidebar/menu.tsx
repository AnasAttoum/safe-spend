"use client";

import React from 'react'
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { headerlinks } from '@/config/header-links'
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PoundSterling, Trophy } from 'lucide-react';
import { routes } from '@/config/routes';
import { Separator } from '../ui/separator';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/lib/localization/navigation';

export default function Menu(
    // { SYPCurrency }: { SYPCurrency: boolean }
) {
    const t = useTranslations();
    const pathname = usePathname();
    const locale = useLocale();
    const searchParams = useSearchParams();
    const params = searchParams.toString();

    const fullPath = params ? `${pathname}?${params}` : pathname;

    return (
        <SidebarMenu>
            {headerlinks.map(({ icon: Icon, label, link }) => {
                const isActive = `/${locale}${link !== "/" ? link : ""}` === fullPath;
                return link
                    ? (
                        <div key={label} className='flex flex-col gap-1'>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={cn(
                                    "relative w-full text-center text-white hover:text-white rounded-md transition-all duration-200 py-7",
                                    isActive && "font-bold bg-safeSpend-light hover:bg-safeSpend-secondary dark:hover:bg-safeSpend-primary"
                                )}>
                                    <Link href={link} className='z-10'>
                                        <Icon color="#fff" />
                                        <span>{t(label)}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* {index !== headerlinks.length - 1 && <Separator />} */}
                        </div>
                    ) : (
                        <div key={label}>
                            <Separator />
                            <SidebarGroupLabel className="mt-1 text-gray-300 uppercase">
                                {t(label)}
                            </SidebarGroupLabel>
                        </div>
                    )
            })}
            {/* {SYPCurrency && */}
            <>
                <Separator className='h-[.5px]!' />
                <SidebarGroupLabel className="mb-1 text-gray-300 uppercase">
                    {t("exchange-rates")}
                </SidebarGroupLabel>
                <div className='flex flex-col gap-1'>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className={cn(
                            "relative w-full text-center text-white hover:text-white rounded-md transition-all duration-200 py-7",
                            `/${locale}${routes.syrianPoundToday}` === pathname && "font-bold bg-safeSpend-light hover:bg-safeSpend-secondary dark:hover:bg-safeSpend-primary"
                        )}>
                            <Link href={routes.syrianPoundToday}>
                                <PoundSterling color="#fff" />
                                <span>{t("syrian-pound-today")}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className={cn(
                            "relative w-full text-center text-white hover:text-white rounded-md transition-all duration-200 py-7",
                            `/${locale}${routes.goldToday}` === pathname && "font-bold bg-safeSpend-light hover:bg-safeSpend-secondary dark:hover:bg-safeSpend-primary"
                        )}>
                            <Link href={routes.goldToday}>
                                <Trophy color="#fff" />
                                <span>{t("gold-today")}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </div>
            </>
            {/* } */}
        </SidebarMenu>
    )
}