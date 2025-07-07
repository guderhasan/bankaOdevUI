export interface IAccountDetailRequest{
    id: string;
}
export interface IAccountDetailResponse{
    updatedAt: string;
    createdAt: string;
    balance: string;
    name: string;
    number: string;
}