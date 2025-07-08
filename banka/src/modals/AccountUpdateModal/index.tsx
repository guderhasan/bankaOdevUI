import React from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import {} from "../../localization/tr/tableTexts/type";
import { IAccountUpdateModalProps, IQueryFormValues } from "./type";
import useAxios, { configure } from "axios-hooks";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import { Messages } from "../../localization/tr/messages/type";
import {
  IAccountUpdateRequest,
  IAccountUpdateResponse,
} from "../../model/AccountUpdate/type";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FormTexts } from "../../localization/tr/formTexts/type";

const AccountUpdateModal: React.FC<IAccountUpdateModalProps> = ({
  accountId,
  open,
  setOpenModal,
}) => {
  //Farklı dosyalarda konfigurasyonları yapılabilir.
  const BASE_API_URL = "http://localhost:8080/api";
  axios.defaults.baseURL = BASE_API_URL;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  configure({ axios });

  const { handleSubmit, control, reset } = useForm<IQueryFormValues>({
    defaultValues: { name: "" },
  });

  const nameVal = useWatch({
    control,
    name: "name",
  });

  const handleClose = () => {
    setOpenModal(false);
    reset();
  };

  const [, accountUpdateCall] = useAxios<
    IAccountUpdateResponse,
    IAccountUpdateRequest
  >(
    {
      url: "/accounts/update",
      method: "PUT",

      params: {
        id: accountId,
        name: nameVal,
      },
    },
    { manual: true }
  );
  const accountUpdate = async () => {
    const response = await accountUpdateCall();
    if (response?.status === HttpStatusCode.Ok) {
      toast(Messages.UpdateSuccessMessage);
    } else {
      toast(Messages.UpdateErrorMessage);
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{Messages.UpdateAccount}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
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
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {Messages.Close}
          </Button>
          <Button variant="success" onClick={handleSubmit(accountUpdate)}>
            {Messages.Update}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AccountUpdateModal;
