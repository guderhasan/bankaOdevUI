import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { Form, Button, Container } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import { Messages } from "../../localization/tr/messages/type";
import { toast, ToastContainer } from "react-toastify";
import NavbarPage from "../Navbar";
import { ILoginRequest, ILoginResponse } from "../../model/Login/type";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router";
import { IUserRequest, IUserResponse } from "../../model/User/type";

const Login = () => {
  const { setUserId, setUserName } = useContext(AuthContext);
  const navigate = useNavigate();

  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  const { handleSubmit, control, reset } = useForm<IQueryFormValues>({
    defaultValues: { password: "", userName: "" },
  });
  const [userNameVal, passwordVal] = useWatch({
    control,
    name: ["userName", "password"],
  });

  const [, loginServiceCall] = useAxios<ILoginResponse, ILoginRequest>(
    {
      url: "/users/login",
      method: "POST",
      data: {
        password: passwordVal,
        username: userNameVal,
      },
    },
    { manual: true }
  );

  const [, userCall] = useAxios<IUserResponse, IUserRequest>(
    {
      url: "/users/search/findByUsername",
      method: "GET",
      params: {
        username: userNameVal,
      },
    },
    { manual: true }
  );

  const loginUser = async () => {
    const response = await loginServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      localStorage.setItem("token", response?.data?.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response?.data?.token}`;
      configure({ axios });
      userCall().then((result) => {
        setUserId(result?.data?.id);
        setUserName(result?.data?.username);
      });
      navigate("/");
      toast(Messages.LoginSuccessMessage);
    } else {
      toast(Messages.LoginErrorMessage);
    }
  };

  return (
    <>
      <NavbarPage />
      <Container>
        <Form>
          <Form.Label className=" d-flex justify-content-center mt-5">
            {FormTexts.LoginMessage}
          </Form.Label>
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
          <div className="d-grid gap-2">
            <Button
              variant="success"
              type="submit"
              onClick={handleSubmit(loginUser)}
            >
              {FormTexts.Login}
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

export default Login;
