import { useState } from "react";
import { Link, useParams, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import axios from "axios";
import { authActions } from "../store";
axios.defaults.withCredentials = true;

function Header(props) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [registerPage, setRegisterPage] = useState(false);
  let pathName = window.location.pathname;

  useEffect(() => {
    //console.log("Params page name", pathName);
    if (pathName === "/register") {
      setRegisterPage(true);
    } else {
      setRegisterPage(false);
    }
  }, []);

  async function sendLogoutReq() {
    const res = await axios.post("https://pranayreddy-askquet.herokuapp.com/logout", {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res;
    }
    return new Error("Unable to logout, please try again");
  }

  function handleLogout() {
    sendLogoutReq().then(() => {
      dispatch(authActions.logout());
    });
  }

  return (
    <Navbar bg="secondary" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <h2>AskQuet</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Nav className="justify-content-end">
          {!isLoggedIn && (
            <>
              {" "}
              <Nav.Link
                as={Link}
                to="/"
                style={
                  registerPage
                    ? null
                    : { textDecoration: "underline", color: "white" }
                }
              >
                Login
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/register"
                style={
                  registerPage
                    ? { textDecoration: "underline", color: "white" }
                    : null
                }
              >
                Register
              </Nav.Link>
            </>
          )}
          {isLoggedIn && (
            <>
              {" "}
              <Nav.Link as={Link} to="/userposts" style={{ color: "white" }}>
                Add Post
              </Nav.Link>
              {/* <Nav.Link
                onClick={handleLogout}
                as={Link}
                to="/"
                style={{ color: "white" }}
              >
                Logout
              </Nav.Link>
              <Nav.Link as={Link} to="/userposts">
                <AccountCircleRoundedIcon />
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    paddingLeft: "2px",
                  }}
                >
                  {props.userName}
                </span>
              </Nav.Link> */}
              <NavDropdown
                title={
                  <>
                    <AccountCircleRoundedIcon />
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        paddingLeft: "2px",
                      }}
                    >
                      {props.userName}
                    </span>
                  </>
                }
                id="nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={handleLogout}
                  as={Link}
                  to="/"
                  style={{ border: "none" }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
