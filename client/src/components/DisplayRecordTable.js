import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

export default function DisplayRecordTable(props) {
  const { userData: user, displayRecords, setDisplayRecords } = props;
  const { accessToken } = useAuthToken();
  const { isLoading } = useAuth0();

  useEffect(() => {
    async function getRecords() {
      const res = await fetch(`http://localhost:8000/foodtracks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch((error) => {
        console.error("Error:", error);
      });
      const data = await res.json();
      if (data && data.length) {
        setDisplayRecords(data);
      }
    }

    if (!!user) {
      getRecords();
    }
  }, [accessToken, setDisplayRecords]);

  const onDeleteRecord = async (recordId) => {
    await fetch(`http://localhost:8000/foodtracks/${recordId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setDisplayRecords((prev) => {
          return prev.filter((record) => record.id !== recordId);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  if (!!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!!user ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Store</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[...displayRecords].reverse().map((record) => {
              return (
                <tr className="food-track" key={`record-${record.id}`}>
                  <td>{record.productName}</td>
                  <td>{record.store}</td>
                  <td>$ {record.price}</td>
                  <td>{record.shopDate}</td>
                  <td>
                    <Link to={`/records/${record.id}`}>Details</Link>
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        onDeleteRecord(record.id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <>Register and Log in to view history records! </>
      )}
    </div>
  );
}
