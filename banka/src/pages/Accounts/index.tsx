import React, { useContext, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { Form, Button, Container, Row } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import { Messages } from "../../localization/tr/messages/type";
import { toast } from "react-toastify";
import { Context } from "../GlobalContext";
import {
  IAccountsByNameRequest,
  IAccountsByNumberRequest,
  IAccountsResponse,
} from "../../model/Accounts/type";
import AccountsTable from "./AccountsTable";
import AccountsModal from "../../modals/AccountDetailModal";
import TransactionHistoryModal from "../../modals/TransactionHistoryModal";
import AccountUpdateModal from "../../modals/AccountUpdateModal";
import NavbarPage from "../Navbar";

const Accounts: React.FC = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  //ContextApi ile id alındı, security yapılmadığından bu yöntem uygulandı
  const userId = useContext(Context);
  const [accountsData, setAccountsData] = useState<IAccountsResponse[]>();
  const [accountId, setAccountId] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalTransaction, setOpenModalTransaction] =
    useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const { handleSubmit, getValues, control, reset } = useForm<IQueryFormValues>(
    {
      defaultValues: { nameORNumber: "" },
    }
  );
  const searchTypeVal = useWatch({
    control,
    name: "searchType",
  });

  const [, accountByNameServiceCall] = useAxios<
    IAccountsResponse[],
    IAccountsByNameRequest
  >(
    {
      url: "/accounts/search/name",
      method: "POST",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        name: getValues("nameORNumber"),
        id: userId,
      },
    },
    { manual: true }
  );

  const [, accountByNumberServiceCall] = useAxios<
    IAccountsResponse[],
    IAccountsByNumberRequest
  >(
    {
      url: "/accounts/search/number",
      method: "POST",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        number: getValues("nameORNumber"),
        id: userId,
      },
    },
    { manual: true }
  );

  const name = async () => {
    const response = await accountByNameServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      setAccountsData(response?.data);
      toast("" + response?.data);
    } else {
      setAccountsData([]);
      toast(Messages.NoData);
    }
  };

  const number = async () => {
    const response = await accountByNumberServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      setAccountsData(response?.data);
      toast("" + response?.data);
    } else {
      setAccountsData([]);
      toast(Messages.NoData);
    }
  };

  const resetFields = () => {
    reset();
    setAccountsData([]);
  };

  return (
    <>
      <NavbarPage />
      <Container>
        <Row>
          <Form>
            <Form.Label className=" d-flex justify-content-center mt-5">
              {FormTexts.Accounts}
            </Form.Label>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                {searchTypeVal === true
                  ? FormTexts.AccountName
                  : FormTexts.AccountNumber}
              </Form.Label>
              <Controller
                control={control}
                name="nameORNumber"
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Control
                    type="text"
                    placeholder={
                      searchTypeVal === true
                        ? FormTexts.AccountName
                        : FormTexts.AccountNumber
                    }
                    onChange={onChange}
                    value={value}
                    ref={ref}
                  />
                )}
              />
            </Form.Group>
            <Form.Group>
              <Controller
                control={control}
                name="searchType"
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Check
                    inline
                    label={FormTexts.AccountByNameSearch}
                    name="searchType"
                    type="checkbox"
                    onChange={onChange}
                    ref={ref}
                  />
                )}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                className="mt-2"
                variant="success"
                type="submit"
                onClick={
                  searchTypeVal === true
                    ? handleSubmit(name)
                    : handleSubmit(number)
                }
              >
                {FormTexts.Search}
              </Button>
            </div>
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="secondary"
                type="submit"
                onClick={() => resetFields()}
              >
                {FormTexts.Reset}
              </Button>
            </div>
          </Form>
        </Row>
        <Row className="mt-sm-5">
          <AccountsTable
            accountData={accountsData || []}
            setAccountId={setAccountId}
            setAccountsData={setAccountsData}
            accountId={accountId}
            name={name}
            number={number}
            searchTypeVal={searchTypeVal}
            setOpenModalTransaction={setOpenModalTransaction}
            setOpenModal={setOpenModal}
            setOpenModalUpdate={setOpenModalUpdate}
          />
        </Row>
      </Container>
      <AccountsModal
        open={openModal}
        accountId={accountId}
        setOpenModal={setOpenModal}
      />
      <TransactionHistoryModal
        open={openModalTransaction}
        accountId={accountId}
        setOpenModal={setOpenModalTransaction}
      />
      <AccountUpdateModal
        open={openModalUpdate}
        accountId={accountId}
        setOpenModal={setOpenModalUpdate}
      />
    </>
  );
};

export default Accounts;
