import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./CSS/note.css";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin, setuserLogin] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [userLoginInputFeild, setuserLoginInputFeild] = useState({
    userEmail: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    // let authToken = localStorage.getItem("Authtoken");
    axios
      .post("http://localhost:4000/dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response);
        navigate("/home");
      })
      .catch((err) => {
        //console.log("Login axios error: " + err);
        navigate("/");
      });
  }, []);

  useEffect(() => {
    let val = userLogin.userEmail;
    if (
      val === "" ||
      /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(
        val
      )
    ) {
      setuserLoginInputFeild((prevValue) => {
        return {
          ...prevValue,
          userEmail: false,
        };
      });
    } else {
      setuserLoginInputFeild((prevValue) => {
        return {
          ...prevValue,
          userEmail: true,
        };
      });
    }
  }, [userLogin.userEmail]);

  useEffect(() => {
    setErrorStatus(false);
  }, [userLogin.userEmail, userLogin.userPassword]);

  function handelChangeFormText(event) {
    const { name, value } = event.target;
    if (name === "userPassword") {
      setuserLogin((prevValue) => {
        return {
          ...prevValue,
          [name]: value,
        };
      });
    } else {
      setuserLogin((prevValue) => {
        return {
          ...prevValue,
          [name]: value.toLowerCase().replace(/\s+/g, ""),
        };
      });
    }
  }

  function handleFormSubmit(event) {
    //console.log(userLogin);
    event.preventDefault();

    if (userLoginInputFeild.userEmail === true) {
      setErrorMsg("Please enter valid Input feilds");
      setErrorStatus(true);
      //console.log("If error status: " + errorStatus);
    } else {
      setErrorMsg("");
      setErrorStatus(false);
      //console.log("Else error status: " + errorStatus);
      try {
        axios
          .post("http://localhost:4000/userLogin", userLogin, {
            withCredentials: true,
          })
          .then((response) => {
            //console.log(response);

            setErrorMsg("");
            setErrorStatus(false);
            setuserLogin({
              userEmail: "",
              userPassword: "",
            });
            // localStorage.setItem("Authtoken", response.data.token);
            navigate("/home");
          })
          .then(() => {
            dispatch(authActions.login());
          })
          .catch((err) => {
            setErrorMsg(err.response.data);
            setErrorStatus(true);
            //console.log("Axios Catch Error:" + err);
          });
      } catch (err) {
        //console.log("Try Catch Error: err");
      }
    }
  }

  return (
    <div>
      <Header />
      <div className="askquetcard d-flex align-items-center justify-content-center text-center">
        <Card
          style={{
            padding: "3%",
            minWidth: "30%",
            maxWidth: "30%",
          }}
        >
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="userEmail"
                value={userLogin.userEmail}
                onChange={handelChangeFormText}
                required
              />
              {userLoginInputFeild.userEmail ? (
                <Form.Text className="text-danger">
                  Please enter valid email example@domain.com
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                name="userPassword"
                value={userLogin.userPassword}
                onChange={handelChangeFormText}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
            <p>
              {errorStatus ? (
                <Form.Text className="text-danger">{errorMsg}</Form.Text>
              ) : null}
            </p>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
