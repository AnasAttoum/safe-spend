"use client";

import React from 'react'
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { headerlinks } from '@/config/header-links'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PoundSterling } from 'lucide-react';
import { routes } from '@/config/routes';
import { Separator } from '../ui/separator';

export default function Menu({ SYPCurrency }: { SYPCurrency: boolean }) {

    const pathname = usePathname();

    return (
        <SidebarMenu>
            {headerlinks.map(({ icon: Icon, label, link }) => {
                const isActive = link === pathname;
                return link
                    ? (
                        <div key={label} className='flex flex-col gap-1'>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={cn(
                                    "relative w-full text-center text-white hover:text-white rounded-md transition-all duration-200 py-7",
                                    isActive && "font-bold bg-safeSpend-light hover:bg-safeSpend-secondary dark:hover:bg-safeSpend-primary"
                                )}>
                                    <Link href={link}>
                                        <Icon color="#fff" />
                                        <span>{label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {/* {index !== headerlinks.length - 1 && <Separator />} */}
                        </div>
                    ) : (
                        <div key={label}>
                            <Separator />
                            <SidebarGroupLabel className="mt-1 text-gray-300 uppercase">
                                {label}
                            </SidebarGroupLabel>
                        </div>
                    )
            })}
            {SYPCurrency &&
                <>
                    <Separator className='!h-[.5px]' />
                    <SidebarGroupLabel className="text-gray-300 uppercase">
                        Exchange rates
                    </SidebarGroupLabel>
                    <div className='flex flex-col gap-1'>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild className={cn(
                                "relative w-full text-center text-white hover:text-white rounded-md transition-all duration-200 py-7",
                                routes.syrianPoundToday === pathname && "font-bold bg-safeSpend-light hover:bg-safeSpend-secondary dark:hover:bg-safeSpend-primary"
                            )}>
                                <Link href={routes.syrianPoundToday}>
                                    <PoundSterling color="#fff" />
                                    <span>Syrian Pound Today</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        {/* {index !== headerlinks.length - 1 && <Separator />} */}
                    </div>
                </>}
        </SidebarMenu>
    )
}