import { render, screen } from "@testing-library/react";
import Records from "../components/Records";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();
let mockUser = { sub: "foobar", nickname: "foobar", name: "xxx@xxx.com" };

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      user: mockUser,
      isAuthenticated: mockIsAuthenticated,
      loginWithRedirect: mockLoginWithRedirect,
    };
  },
}));

jest.mock("../AuthTokenContext", () => ({
  ...jest.requireActual("../AuthTokenContext"),
  useAuthToken: () => {
    return {
      accessToken: "",
    };
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockUseNavigate;
  },
}));

test("renders Records page with correct info", () => {
  render(<Records />);

  expect(screen.getByText("Product Name")).toBeInTheDocument();
  expect(screen.getByText("Store")).toBeInTheDocument();
  expect(screen.getByText("Price")).toBeInTheDocument();
  expect(screen.getByText("Date")).toBeInTheDocument();
});

test("renders no Records page if no login", () => {
  mockUser = false;
  render(<Records />);

  expect(
    screen.getByText("Register and Log in to add records!")
  ).toBeInTheDocument();
});
