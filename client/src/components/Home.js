import React from "react";
import NavbarComponent from "./NavbarComponent";
import QuickAdd from "./QuickAdd";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

export function Home() {
  const BASE_CLASS = "homepage";

  return (
    <>
      <NavbarComponent pageTitle="Food Tracker" />
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}--image`}>
          <img
            src="https://images.unsplash.com/photo-1595853035070-59a39fe84de3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3250&q=80"
            alt="welcome img with tag line"
          />
        </div>
        <br />
        <div className="wrapper">
          <QuickAdd />
        </div>
        {/* <div className="wrapper"> */}
        {/* <button type="button">Find Past</button> */}
        {/* <div>OR register</div> */}
        {/* </div> */}
        <br />
        <br />
        <br />
      </div>
    </>
  );
}
