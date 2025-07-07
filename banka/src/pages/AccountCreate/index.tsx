import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Controller, useForm } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { Form, Button, Container, Row, FormText } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import { Messages } from "../../localization/tr/messages/type";
import { toast } from "react-toastify";
import { Context } from "../GlobalContext";
import {
  IAccountCreateRequest,
  IAccountCreateResponse,
} from "../../model/AccountCretae/type";

const AccountCreate = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  //ContextApi ile id alındı, security yapılmadığından bu öntem uygulandı
  const userId = useContext(Context);
  const { handleSubmit, getValues, control } = useForm<IQueryFormValues>({
    defaultValues: { name: "" },
  });

  const [, createAccountServiceCall] = useAxios<
    IAccountCreateResponse,
    IAccountCreateRequest
  >(
    {
      url: "/accounts/create",
      method: "POST",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        number: Math.random(),
        name: getValues("name"),
        id: userId,
      },
    },
    { manual: true }
  );

  const create = async () => {
    const response = await createAccountServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      toast(Messages.CreateSuccessMessage + response?.data);
    } else {
      toast(Messages.CreateSuccessMessage);
    }
  };

  return (
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
          />
        </Form.Group>
        <Button variant="success" type="submit" onClick={handleSubmit(create)}>
          {FormTexts.Create}
        </Button>
      </Form>
    </Container>
  );
};

export default AccountCreate;
