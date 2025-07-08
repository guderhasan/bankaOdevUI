import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { Form, Button, Container } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import { Messages } from "../../localization/tr/messages/type";
import { toast, ToastContainer } from "react-toastify";
import {
  IAccountCreateRequest,
  IAccountCreateResponse,
} from "../../model/AccountCretae/type";
import NavbarPage from "../Navbar";
import { AuthContext } from "../../AuthContext";

const AccountCreate = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  configure({ axios });

  const { userId } = useContext(AuthContext);

  const { handleSubmit, control, reset } = useForm<IQueryFormValues>({
    defaultValues: { name: "" },
  });

  const nameVal = useWatch({
    control,
    name: "name",
  });

  const [, createAccountServiceCall] = useAxios<
    IAccountCreateResponse,
    IAccountCreateRequest
  >(
    {
      url: "/accounts/create",
      method: "POST",

      params: {
        number: "Bank-" + (100 + Math.random() * 999).toFixed(),
        name: nameVal,
        id: userId,
      },
    },
    { manual: true }
  );

  const create = async () => {
    const response = await createAccountServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      toast(Messages.CreateSuccessMessage);
    } else {
      toast(Messages.CreateErrorMessage);
    }
  };

  return (
    <>
      <NavbarPage />
      <Container>
        <Form>
          <Form.Label className=" d-flex justify-content-center mt-5">
            {FormTexts.CreateAcoount}
          </Form.Label>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>{FormTexts.AccountName}</Form.Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="text"
                  placeholder={FormTexts.EnterAccountName}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
              rules={{ required: true }}
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="success"
              type="submit"
              onClick={handleSubmit(create)}
            >
              {FormTexts.Create}
            </Button>
          </div>
          <div className="d-flex gap-2 mt-2">
            <Button variant="secondary" type="submit" onClick={() => reset}>
              {FormTexts.Reset}
            </Button>
          </div>
        </Form>
      </Container>
      <ToastContainer />
    </>
  );
};

export default AccountCreate;
