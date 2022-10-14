import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

import "./QuickAdd.css";

export default function QuickAdd(props) {
  const { accessToken } = useAuthToken();
  const { user, isLoading } = useAuth0();
  const shortFields = [
    { id: 1, name: "Product Name", type: "text", required: false },
    { id: 2, name: "Date", type: "text", required: false },
    { id: 3, name: "Price", type: "number", required: false },
    { id: 4, name: "Store", type: "string", required: false },
  ];

  const { setDisplayRecords } = props;

  const postOneTrack = async (newTrack) => {
    await fetch("http://localhost:8000/foodtracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newTrack),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmit = (e) => {
    console.log("toby debug, e = ", e.target);
    console.log("toby debug, e.product name = ", e.target["Product Name"]);
    console.log("toby debug, e.data = ", e.target["Date"]);
    e.preventDefault();
    const newData = {
      productName: e.target["Product Name"]?.value || "",
      shopDate: e.target["Date"]?.value || "",
      price: parseFloat(e.target["Price"].value) || -1,
      store: e.target["Store"].value || "",
      discounted: false,
      auth0Id: user.sub,
    };
    postOneTrack(newData);
    setDisplayRecords((prev) => {
      return [...prev, newData];
    });
    e.target.reset();
  };

  if (!!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!!user ? (
        <>
          <div className="quick-add__title">
            Quickly add a brief record here:
          </div>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <div className="quick-add__input-row">
              {shortFields.map((inputField) => {
                const { id, name, type, required } = inputField;
                return (
                  // <div
                  //   key={`form-control-${name}`}
                  //   className={"quick-add__input-element"}
                  // >
                  <Form.Group
                    className="quick-add__input-row"
                    controlId={name}
                    key={id}
                  >
                    <Form.Label>{name}:</Form.Label>
                    <Form.Control
                      as="textarea"
                      type={type}
                      required={required}
                      rows="1"
                    />
                  </Form.Group>
                );
              })}
              <Button className="submitButton" type="submit">
                Add!
              </Button>
            </div>
          </Form>
        </>
      ) : (
        <div>Register and Log in to add records!</div>
      )}
    </div>
  );
}
