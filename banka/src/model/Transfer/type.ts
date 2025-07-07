export interface ITransferResponse{
    transactionDate: string;
    status: string;
    amount: number;
}
export interface ITransferRequest {
    receiver: string; 
    sender: string;
    balance: number;
}