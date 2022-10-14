import React, { useState } from "react";
import NavbarComponent from "./NavbarComponent";
import QuickAdd from "./QuickAdd";
import DisplayRecordTable from "./DisplayRecordTable";
import { useAuth0 } from "@auth0/auth0-react";

import "./Records.css";

export default function Records({}) {
  // TODO: add user as input

  const BASE_CLASS = "records-page";
  const [displayRecords, setDisplayRecords] = useState([]);
  const { user, isLoading } = useAuth0();

  if (!!isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NavbarComponent pageTitle="{Records}" />
      <div className={`${BASE_CLASS}`}>
        {/* <p>TODO: add a search bar</p> */}

        <div className="wrapper">
          <QuickAdd setDisplayRecords={setDisplayRecords} />
        </div>
        <div className={`${BASE_CLASS}--records wrapper`}>
          <DisplayRecordTable
            userData={user}
            displayRecords={displayRecords}
            setDisplayRecords={setDisplayRecords}
          />
          {displayRecords.length <= 0 ?? (
            <>There is no record. Create a new one by adding! </>
          )}
        </div>
      </div>
    </>
  );
}
