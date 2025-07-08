import React from "react";

import DataTable from "react-data-table-component";
import { IAccountsTableProps } from "../type";
import { Container } from "react-bootstrap";
import { TableTexts } from "../../../localization/tr/tableTexts/type";
import axios, { HttpStatusCode } from "axios";
import useAxios, { configure } from "axios-hooks";
import {
  IAccountDeleteRequest,
  IAccountDeleteResponse,
} from "../../../model/AccountDelete/type";
import { Messages } from "../../../localization/tr/messages/type";
import { toast } from "react-toastify";

const AccountsTable: React.FC<IAccountsTableProps> = ({
  accountData,
  setAccountId,
  setOpenModal,
  setOpenModalUpdate,
  setOpenModalTransaction,
  setOpenModalTransfer,
  accountId,
  name,
  number,
  searchTypeVal,
}) => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  configure({ axios });

  const columns = [
    {
      name: TableTexts.AccountName,
      selector: (row: any) => row.name,
    },
    {
      name: TableTexts.AccountNumber,
      selector: (row: any) => row.number,
    },
    {
      selector: (row: any) => row.id,
      omit: true,
    },
    {
      name: TableTexts.AccountDetail,
      button: true,
      cell: (row: any) => (
        <button
          className="btn btn-success btn-xs"
          onClick={(e) => handleButtonClickDetail(e, row?.id)}
        >
          {TableTexts.Detail}
        </button>
      ),
    },
    {
      name: TableTexts.AccountUpdate,
      button: true,
      cell: (row: any) => (
        <button
          className="btn btn-primary btn-xs"
          onClick={(e) => handleButtonClickUpdate(e, row?.id)}
        >
          {TableTexts.Update}
        </button>
      ),
    },
    {
      name: TableTexts.AccountDelete,
      button: true,
      cell: (row: any) => (
        <button
          className="btn btn-danger btn-xs"
          onClick={(e) => handleButtonClickDelete(e, row?.id)}
        >
          {TableTexts.Delete}
        </button>
      ),
    },
    {
      name: TableTexts.AccountTransactionHistory,
      button: true,
      cell: (row: any) => (
        <button
          className="btn btn-secondary btn-xs"
          onClick={(e) => handleButtonClickTransactionHistory(e, row?.id)}
        >
          {TableTexts.Transfer}
        </button>
      ),
    },
    {
      button: true,
      name: TableTexts.SendMoney,
      cell: (row: any) => (
        <button
          className="btn btn-info btn-xs"
          onClick={(e) => handleButtonClickTransfer(e, row?.number)}
        >
          {TableTexts.SendMoney}
        </button>
      ),
    },
  ];

  const [, accountDeleteCall] = useAxios<
    IAccountDeleteResponse,
    IAccountDeleteRequest
  >(
    {
      url: "/accounts/delete",
      method: "DELETE",

      params: {
        id: accountId,
      },
    },
    { manual: true }
  );
  const accountDelete = async () => {
    const response = await accountDeleteCall();
    if (response?.status === HttpStatusCode.Ok) {
      searchTypeVal ? name() : number();
      toast(Messages.DeleteSuccess);
    } else {
      toast(Messages.DeleteError);
    }
  };

  const handleButtonClickDetail = (e: any, id: any) => {
    e.preventDefault();
    setAccountId(id);
    setOpenModal(true);
  };
  const handleButtonClickDelete = (e: any, id: any) => {
    e.preventDefault();
    setAccountId(id);
    accountDelete();
  };
  const handleButtonClickUpdate = (e: any, id: any) => {
    e.preventDefault();
    setAccountId(id);
    setOpenModalUpdate(true);
  };
  const handleButtonClickTransactionHistory = (e: any, id: any) => {
    e.preventDefault();
    setAccountId(id);
    setOpenModalTransaction(true);
  };

  const handleButtonClickTransfer = (e: any, number: any) => {
    e.preventDefault();
    setAccountId(number);
    setOpenModalTransfer(true);
  };

  return (
    <Container>
      <DataTable columns={columns} data={accountData || []} />
    </Container>
  );
};
export default AccountsTable;
