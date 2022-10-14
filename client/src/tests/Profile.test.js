import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockUseNavigate;
  },
}));

test("renders Profile page with user info", () => {
  render(<Profile />);

  expect(screen.getByText("Name:")).toBeInTheDocument();
  expect(screen.getByText("Email:")).toBeInTheDocument();
  expect(screen.getByText("foobar")).toBeInTheDocument();
  expect(screen.getByText("xxx@xxx.com")).toBeInTheDocument();
});

test("renders no Profile page if no login", () => {
  mockUser = false;
  render(<Profile />);

  expect(
    screen.getByText("You don't have a profile yet 😄")
  ).toBeInTheDocument();
});
