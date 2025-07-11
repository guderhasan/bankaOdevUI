import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { Form, Button, Container } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import {
  IUserRegisterRequest,
  IUserRegisterResponse,
} from "../../model/UserRegister/type";
import { Messages } from "../../localization/tr/messages/type";
import { toast, ToastContainer } from "react-toastify";
import NavbarPage from "../Navbar";

const UserRegister = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  configure({ axios });

  const { handleSubmit, control, reset } = useForm<IQueryFormValues>({
    defaultValues: { email: "", password: "", userName: "" },
  });
  const [userNameVal, passwordVal, emailVal] = useWatch({
    control,
    name: ["userName", "password", "email"],
  });
  const [, registerServiceCall] = useAxios<
    IUserRegisterResponse,
    IUserRegisterRequest
  >(
    {
      url: "/users/register",
      method: "POST",
      params: {
        email: emailVal,
        password: passwordVal,
        userName: userNameVal,
      },
    },
    { manual: true }
  );

  const register = async () => {
    const response = await registerServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      toast(Messages.RegisterSuccessMessage);
    } else {
      toast(Messages.RegisterErrorMessage);
    }
  };

  return (
    <>
      <NavbarPage />
      <Container>
        <Form>
          <Form.Label className=" d-flex justify-content-center mt-5">
            {FormTexts.RegisterMessage}
          </Form.Label>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>{FormTexts.Email}</Form.Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="email"
                  placeholder={FormTexts.Email}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
              rules={{ required: true }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>{FormTexts.Password}</Form.Label>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="password"
                  placeholder={FormTexts.Password}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
              rules={{ required: true }}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>{FormTexts.UserName}</Form.Label>
            <Controller
              control={control}
              name="userName"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="text"
                  placeholder={FormTexts.UserName}
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
              onClick={handleSubmit(register)}
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

export default UserRegister;
