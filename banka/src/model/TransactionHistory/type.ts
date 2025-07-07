export interface ITransactionHistoryRequest{ accountId : string}
export interface ITransactionHistoryResponse{
    receiverNumber: string;
    senderNumber: string;
    transactionDate: string;
    status: string;
    amount: string;
}