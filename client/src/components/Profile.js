import React from "react";
import NavbarComponent from "./NavbarComponent";
import { useAuth0 } from "@auth0/auth0-react";

import "./Profile.css";

export default function Profile() {
  const { user, isLoading } = useAuth0();
  const BASE_CLASS = "profile-page";

  if (!!isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NavbarComponent pageTitle="{Profile}" />
      {!!user ? (
        <div className={BASE_CLASS}>
          <div className={`${BASE_CLASS}--upper-container wrapper`}>
            <img
              className={`${BASE_CLASS}--profile-image`}
              src="https://images.unsplash.com/photo-1657299156528-2d50a9a6a444?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3387&q=80"
              alt=""
            />
            <div className={`${BASE_CLASS}--account-info`}>
              <div className={`${BASE_CLASS}--account-info-entry`}>
                <div>Name:</div>
                <div>{user.nickname}</div>
              </div>

              <div className={`${BASE_CLASS}--account-info-entry`}>
                <div>Email:</div>
                <div>{user.name}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${BASE_CLASS}--upper-container wrapper`}>
          You don't have a profile yet 😄
        </div>
      )}
      <br />
      <br />
      <br />
    </>
  );
}
