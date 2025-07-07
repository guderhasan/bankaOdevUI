export interface IAccountsByNameRequest{
    name: string;
    id: string;
}
export interface IAccountsByNumberRequest{
    number: string;
    id: string;
}
export interface IAccountsResponse{
    number: string;
    name: string;
    balance: string;
    createdAt: string;
    id: string;
}
