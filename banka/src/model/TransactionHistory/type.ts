export interface ITransactionHistoryRequest{ id : string}
export interface ITransactionHistoryResponse{
    receiverNumber: string;
    senderNumber: string;
    transactionDate: string;
    status: string;
    amount: string;
}