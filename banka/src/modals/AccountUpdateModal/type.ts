export interface IAccountUpdateModalProps{
    accountId: string;
    open: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}
export interface IQueryFormValues{
    name: string;
}