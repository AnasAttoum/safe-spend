"use client";

import React from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { headerlinks } from '@/config/header-links'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Menu() {

    const pathname = usePathname();

    return (
        <SidebarMenu>
            {headerlinks.map(({ icon: Icon, label, link }) => {
                const isActive = link === pathname;
                return (
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
                )
            })}
        </SidebarMenu>
    )
}