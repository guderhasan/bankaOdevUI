import { IAccountsResponse } from "../../model/Accounts/type";

export interface IAccountsTableProps {
    accountData: IAccountsResponse[],
    setAccountId: React.Dispatch<React.SetStateAction<string>>
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalTransaction: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalUpdate: React.Dispatch<React.SetStateAction<boolean>>
    setOpenModalTransfer: React.Dispatch<React.SetStateAction<boolean>>
    setAccountsData: React.Dispatch<React.SetStateAction<IAccountsResponse[] | undefined>>
    accountId: string;
    name: () => Promise<void>;
    number: () => Promise<void>;
    searchTypeVal: boolean;
}

export interface IQueryFormValues{
    nameORNumber: string;
    searchType: boolean;
} 