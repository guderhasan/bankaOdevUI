import axios, { HttpStatusCode } from "axios";
import useAxios, { configure } from "axios-hooks";
import { Controller, useForm, useWatch } from "react-hook-form";
import { IQueryFormValues } from "./type";
import { ITransferRequest, ITransferResponse } from "../../model/Transfer/type";
import { Messages } from "../../localization/tr/messages/type";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Form } from "react-bootstrap";
import { FormTexts } from "../../localization/tr/formTexts/type";
import NavbarPage from "../Navbar";

//Transfer Önceden Bir Sayfa İdi. Sonrasında Modal Şeklinde Değiştirdim. Bu Sayfa Yerine TransferModal Sayfası Kullanılıyor.

const Transfer: React.FC = () => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  configure({ axios });

  const { handleSubmit, control, reset } = useForm<IQueryFormValues>({
    defaultValues: { balance: 0, receiver: "" },
  });

  const [receiverVal, balanceVal] = useWatch({
    control,
    name: ["receiver", "balance"],
  });

  const [, trasferServiceCall] = useAxios<ITransferResponse, ITransferRequest>(
    {
      url: "/transactions/transfer",
      method: "POST",

      data: {
        receiver: receiverVal,
        sender: "sil",
        balance: balanceVal,
      },
    },
    { manual: true }
  );

  const transfer = async () => {
    const response = await trasferServiceCall();
    if (response?.status === HttpStatusCode.Ok) {
      if (response?.data?.status === "SUCCESS") {
        toast(Messages.TransferSuccessMessage);
      } else {
        toast(Messages.TransferErrorMessage);
      }
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
              rules={{ required: true }}
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
              rules={{ required: true }}
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
      <ToastContainer />
    </>
  );
};
export default Transfer;
