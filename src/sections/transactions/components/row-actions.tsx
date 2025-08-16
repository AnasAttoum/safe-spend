import { getTransactionsHistoryDataResponseType } from '@/app/api/transactions/route';
import { DeleteDialog } from '@/components/dialog/delete-dialog';
import { TransactionDialog } from '@/components/dialog/transaction-dialog';
import Icon from '@/components/icon/icon';
import MoreIcon from '@/components/icon/lib/more-icon';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { useState } from 'react'

export const RowActions = ({
    transaction,
}: {
    transaction: getTransactionsHistoryDataResponseType[0];
}) => {
    const [openMenu, setOpenMenu] = useState(false)
    return (
        <DropdownMenu open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <TransactionDialog
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-2">
                            <div className="flex justify-center">
                                <Icon icon="pen" />
                            </div>
                            Edit
                        </Button>
                    }
                    type={transaction.type as "income" | "expense"}
                    transaction={transaction}
                    closeMenu={() => setOpenMenu(false)}
                />
                <DeleteDialog
                    item="transaction"
                    id={transaction.id}
                    trigger={
                        <Button variant="ghost" className="w-full text-start grid grid-cols-2">
                            <div className="flex justify-center">
                                <Icon icon="trash" />
                            </div>
                            Delete
                        </Button>
                    }
                    closeMenu={() => setOpenMenu(false)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
