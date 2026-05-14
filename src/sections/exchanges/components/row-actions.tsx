import { getExchangesHistoryDataResponseType } from '@/app/[locale]/api/exchanges/route';
import { DeleteDialog } from '@/components/dialog/delete-dialog';
import { ExchangeDialog } from '@/components/dialog/exchange-dialog';
import Icon from '@/components/icon/icon';
import MoreIcon from '@/components/icon/lib/more-icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

export const RowActions = ({
    exchange,
}: {
    exchange: getExchangesHistoryDataResponseType[0];
}) => {
    const t = useTranslations();
    const [openMenu, setOpenMenu] = useState(false)
    return (
        <DropdownMenu open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ExchangeDialog
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-2">
                            <div className="flex justify-center">
                                <Icon icon="pen" />
                            </div>
                            {t("edit")}
                        </Button>
                    }
                    exchange={exchange}
                    closeMenu={() => setOpenMenu(false)}
                />
                <DeleteDialog
                    item="exchange"
                    id={exchange.id}
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-2">
                            <div className="flex justify-center">
                                <Icon icon="trash" />
                            </div>
                            {t("delete")}
                        </Button>
                    }
                    closeMenu={() => setOpenMenu(false)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
