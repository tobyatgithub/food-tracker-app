import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: { sub: "foobar" },
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: mockLoginWithRedirect,
    };
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockUseNavigate;
  },
}));

test("renders App page with Login Button", () => {
  render(<App />);

  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByText("Tracker")).toBeInTheDocument();
});

test("login button calls loginWithRedirect", () => {
  render(<App />);

  const loginButton = screen.getByText("Login");
  userEvent.click(loginButton);

  expect(mockLoginWithRedirect).toHaveBeenCalled();
});
