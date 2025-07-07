import React, { useEffect, useState } from "react";

import DataTable from "react-data-table-component";
import { Button, Container, Modal } from "react-bootstrap";
import { TableTexts } from "../../localization/tr/tableTexts/type";
import useAxios, { configure } from "axios-hooks";
import {
  IAccountDetailRequest,
  IAccountDetailResponse,
} from "../../model/AccountDetail/type";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import { Messages } from "../../localization/tr/messages/type";
import { ITransactionHistoryModalProps } from "./type";
import {
  ITransactionHistoryRequest,
  ITransactionHistoryResponse,
} from "../../model/TransactionHistory/type";

const TransactionHistoryModal: React.FC<ITransactionHistoryModalProps> = ({
  accountId,
  open,
  setOpenModal,
}) => {
  const [transactionHistoryData, setTransactionHistoryData] =
    useState<ITransactionHistoryResponse[]>();
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  const handleClose = () => setOpenModal(false);

  const [, transactionHistoryCall] = useAxios<
    ITransactionHistoryResponse[],
    ITransactionHistoryRequest
  >(
    {
      url: "/transactions/account",
      method: "GET",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        id: accountId,
      },
    },
    { manual: true }
  );
  const transactionHistory = async () => {
    const response = await transactionHistoryCall();
    if (response?.status === HttpStatusCode.Ok) {
      setTransactionHistoryData(response?.data);
    } else {
      toast(Messages.NoData);
    }
  };
  useEffect(() => {
    open && transactionHistory();
  }, [open]);

  const columns = [
    {
      name: TableTexts.TransactionAmount,
      selector: (row: any) => row.amount,
    },
    {
      name: TableTexts.TransactionStatus,
      selector: (row: any) => row.status,
    },
    {
      name: TableTexts.TransactionSender,
      selector: (row: any) => row.senderNumber,
    },
    {
      name: TableTexts.TransactionReceiver,
      selector: (row: any) => row.receiverNumber,
    },
    {
      name: TableTexts.TransactionDate,
      selector: (row: any) => row.transactionDate,
    },
  ];
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{Messages.TransactionHistory}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <DataTable columns={columns} data={transactionHistoryData || []} />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {Messages.Close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default TransactionHistoryModal;
