import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import NavbarComponent from "./NavbarComponent";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

import "./Records.css";

export default function RecordDetail() {
  const detailFields = [
    {
      id: 1,
      name: "Product Name",
      type: "text",
      required: false,
      dbName: "productName",
    },
    { id: 2, name: "Date", type: "date", required: false, dbName: "shopDate" },
    { id: 3, name: "Price", type: "number", required: false, dbName: "price" },
    { id: 4, name: "Store", type: "string", required: false, dbName: "store" },
    { id: 5, name: "User", type: "string", required: false, dbName: "userId" },
    {
      id: 6,
      name: "Is Discounted?",
      type: "boolean",
      required: false,
      dbName: "discounted",
    },
    {
      id: 7,
      name: "Quantity",
      type: "string",
      required: false,
      dbName: "quantity",
    },
    {
      id: 8,
      name: "Category",
      type: "string",
      required: false,
      dbName: "category",
    },
    {
      id: 9,
      name: "Unit Price",
      type: "string",
      required: false,
      dbName: "unitPrice",
    },
  ];
  const BASE_CLASS = "record-detail";
  const [recordDetail, setRecordDetail] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const recordId = useParams().recordId;
  const { accessToken } = useAuthToken();
  const { user, isLoading } = useAuth0();

  useEffect(() => {
    async function getThisRecordDetail(recordId) {
      const res = await fetch(`http://localhost:8000/foodtracks/${recordId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data && data.length) {
      }
      setRecordDetail(data);
      console.log("data =", data);
    }

    if (!!user) {
      getThisRecordDetail(recordId);
    }
  }, [accessToken, user, recordId]);

  const onSave = async (recordId) => {
    await fetch(`http://localhost:8000/foodtracks/${recordId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(recordDetail),
    })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onInput = (e) => {
    const newRecord = { ...recordDetail };
    newRecord[e.target.name] = e.target.value;

    setRecordDetail(newRecord);
  };

  if (!!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent pageTitle={`{Details}`} />
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}__title`}> RecordDetail</div>
        <div className={`${BASE_CLASS}__basic-info`}>
          <div className={`${BASE_CLASS}__image`}>
            <img
              alt="randomly generated"
              src={`https://source.unsplash.com/random/200x200?sig=${Math.floor(
                Math.random() * 100_000
              )}`}
            />
          </div>
          <div className={`${BASE_CLASS}__text-info`}>
            <Table responsive striped bordered hover>
              <tbody>
                {detailFields.map((inputField) => {
                  const { id, name, type, required, dbName } = inputField;
                  const fieldValue = recordDetail[dbName];
                  return (
                    <tr key={`record-${id}`}>
                      <td>{name}</td>
                      <td>{fieldValue || "No Data"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Button
              className={`${BASE_CLASS}__edit-button`}
              onClick={() => {
                setEditModalOpen(true);
              }}
            >
              Edit
            </Button>
          </div>
          <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit This Track</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Table striped bordered hover>
                  <tbody>
                    {detailFields.map((inputField) => {
                      const { id, name, type, required, dbName } = inputField;
                      // console.log("recordDetail = ", recordDetail);
                      const fieldValue = recordDetail[dbName];
                      return (
                        <tr key={`record-${id}`}>
                          <td>{name}</td>
                          <td>
                            <Form.Control
                              name={dbName}
                              type={type}
                              onChange={onInput}
                              required={required}
                              defaultValue={fieldValue || "No Data"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: update backend and frontend.
                  onSave(recordId);
                  setEditModalOpen(false);
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className={`${BASE_CLASS}__geo-info`}>
          <iframe
            title="geo-info"
            width="100%"
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=${
              process.env.REACT_APP_GOOGLE_API
            }
    &q=${recordDetail["store"]?.split(" ").join("+") || ""},Vancouver+BC`}
          ></iframe>
        </div>
        {/* <div className={`${BASE_CLASS}__notes`}>add notes</div> */}
        {/* <div className={`${BASE_CLASS}__history`}>update history</div> */}
        <br />
        <br />
        <br />
      </div>
    </>
  );
}
