import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { Button, Container, Modal } from "react-bootstrap";
import { TableTexts } from "../../localization/tr/tableTexts/type";
import { IAccountsModalProps } from "./type";
import useAxios, { configure } from "axios-hooks";
import { ToastContainer, toast } from "react-toastify";
import {
  IAccountDetailRequest,
  IAccountDetailResponse,
} from "../../model/AccountDetail/type";
import axios, { HttpStatusCode } from "axios";
import { Messages } from "../../localization/tr/messages/type";

const AccountsModal: React.FC<IAccountsModalProps> = ({
  accountId,
  open,
  setOpenModal,
}) => {
  const [accountData, setAccountData] = useState<IAccountDetailResponse[]>();
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  const handleClose = () => {
    setOpenModal(false);
    setAccountData([]);
  };

  const [, accountDetailCall] = useAxios<
    IAccountDetailResponse,
    IAccountDetailRequest
  >(
    {
      url: "/accounts/accountDetail",
      method: "GET",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        id: accountId,
      },
    },
    { manual: true }
  );
  const accountDetail = async () => {
    const response = await accountDetailCall();
    if (response?.status === HttpStatusCode.Ok) {
      if (response?.data) {
        setAccountData([response?.data]);
      } else {
        toast(Messages.NoData);
      }
    } else {
      toast(Messages.NoData);
    }
  };
  useEffect(() => {
    open && accountDetail();
  }, [open]);

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
      name: TableTexts.AccountBalance,
      selector: (row: any) => row.balance,
    },
    {
      name: TableTexts.AccountCeratedDate,
      selector: (row: any) => row.createdAt,
    },
    {
      name: TableTexts.AccountUpdatedDate,
      selector: (row: any) => row.updatedAt,
    },
  ];
  return (
    <>
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={open} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{Messages.AccountDetail}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <DataTable columns={columns} data={accountData || []} />
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {Messages.Close}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};
export default AccountsModal;
