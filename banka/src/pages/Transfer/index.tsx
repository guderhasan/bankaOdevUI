import axios, { HttpStatusCode } from "axios";
import useAxios, { configure } from "axios-hooks";
import { Controller, useForm } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { ITransferRequest, ITransferResponse } from "../../model/Transfer/type";
import { Messages } from "../../localization/tr/messages/type";
import { toast } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import { useContext } from "react";
import { ContextAccountNumber } from "../GlobalContext";
import NavbarPage from "../Navbar";

const Transfer: React.FC = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  configure({ axios });

  //ContextApi ile id alındı, security yapılmadığından bu öntem uygulandı
  const senderAccountNumber = useContext(ContextAccountNumber);

  const { handleSubmit, getValues, control, reset } = useForm<IQueryFormValues>(
    {
      defaultValues: { balance: 0, receiver: "" },
    }
  );

  const [, trasferServiceCall] = useAxios<ITransferResponse, ITransferRequest>(
    {
      url: "/transactions/transfer",
      method: "POST",
      // Normalde data kullanılmalı fakat data payload okunamadığından dolayı params kullanıldı
      params: {
        receiver: getValues("receiver"),
        sender: senderAccountNumber,
        balance: getValues("balance"),
      },
    },
    { manual: true }
  );

  const transfer = async () => {
    const response = await trasferServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      toast(Messages.TransferSuccessMessage + response?.data);
    } else {
      toast(Messages.TransferErrorMessage);
    }
  };

  return (
    <>
      <NavbarPage />
      <Container>
        <Form>
          <Form.Label className=" d-flex justify-content-center mt-5">
            {FormTexts.MoneyTransfer}
          </Form.Label>
          <Form.Group className="mb-3" controlId="receiver">
            <Form.Label>{FormTexts.Receiver}</Form.Label>
            <Controller
              control={control}
              name="receiver"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="text"
                  placeholder={FormTexts.EnterReceiver}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="balance">
            <Form.Label>{FormTexts.Balance}</Form.Label>
            <Controller
              control={control}
              name="balance"
              render={({ field: { onChange, value, ref } }) => (
                <Form.Control
                  type="number"
                  placeholder={FormTexts.EnterBalance}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                />
              )}
            />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="success"
              type="submit"
              onClick={handleSubmit(transfer)}
            >
              {FormTexts.Transfer}
            </Button>
          </div>
          <div className="d-flex gap-2 mt-2">
            <Button variant="secondary" type="submit" onClick={() => reset}>
              {FormTexts.Reset}
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default Transfer;
