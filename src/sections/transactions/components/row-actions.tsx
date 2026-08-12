import { getTransactionsHistoryDataResponseType } from '@/app/[locale]/api/transactions/route';
import { DeleteDialog } from '@/components/dialog/delete-dialog';
import { MoreTransactionDialog } from '@/components/dialog/more-transaction-dialog';
import { TransactionDialog } from '@/components/dialog/transaction-dialog';
import Icon from '@/components/icon/icon';
import MoreIcon from '@/components/icon/lib/more-icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

export const RowActions = ({
    transaction,
}: {
    transaction: getTransactionsHistoryDataResponseType[0];
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
                <TransactionDialog
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-[auto_1fr]">
                            <div className="flex justify-center">
                                <Icon icon="pen" />
                            </div>
                            {t("edit")}
                        </Button>
                    }
                    type={transaction.type as "income" | "expense"}
                    transaction={transaction}
                    closeMenu={() => setOpenMenu(false)}
                />
                <MoreTransactionDialog
                    transaction={transaction}
                    closeMenu={() => setOpenMenu(false)}
                />
                <DeleteDialog
                    item="transaction"
                    id={transaction.id}
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-[auto_1fr]">
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
