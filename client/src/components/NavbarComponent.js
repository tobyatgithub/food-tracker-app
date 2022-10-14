import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./Navbar.css";

export default function NavbarComponent({ pageTitle }) {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  if (!!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar
        bg="primary"
        variant="dark"
        collapseOnSelect
        fixed="top"
        expand="sm"
      >
        <Container fluid>
          <Navbar.Brand href="/">{pageTitle}</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" title="Go Back to Home Page">
                Home
              </Nav.Link>
              <Nav.Link href="/records" title="Show All Records">
                Records
              </Nav.Link>
              <Nav.Link href="/profile" title="Your Profile">
                Profile
              </Nav.Link>
            </Nav>
            <div className="d-flex Navbar--register-button">
              {!isAuthenticated ? (
                <Button onClick={signUp}>Register</Button>
              ) : (
                <Button
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Logout
                </Button>
              )}
              {isAuthenticated ? (
                <div className="Navbar--welcome-name">
                  Welcome 👋 {user.nickname}!
                </div>
              ) : (
                <Button onClick={() => loginWithRedirect({ returnTo: "/" })}>
                  Login
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
