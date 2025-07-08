export interface ITransferModalProps{
    accountId: string;
    open: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
 }
export interface IQueryFormValues{
    receiver: string;
    balance: number;
}