import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userRegister, setUserRegister] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
  });

  const [userRegisterInputFeild, setUserRegisterInputFeild] = useState({
    userName: false,
    userEmail: false,
    userPassword: false,
    userConfirmPassword: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    // let authToken = localStorage.getItem("Authtoken");
    axios
      .post("https://pranayreddy-askquet.herokuapp.com/dashboard", {
        withCredentials: true,
      })
      .then((response) => {
        //console.log(response);
        navigate("/home");
      })
      .catch((err) => {
        //console.log("Login axios error: " + err);
        navigate("/register");
      });
  }, []);

  useEffect(() => {
    let val = userRegister.userName;
    if (val === "" || /^((\d|\w)+){3,}$/.test(val)) {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userName: false,
        };
      });
    } else {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userName: true,
        };
      });
    }
  }, [userRegister.userName]);

  useEffect(() => {
    let val = userRegister.userEmail;
    if (
      val === "" ||
      /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(
        val
      )
    ) {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userEmail: false,
        };
      });
    } else {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userEmail: true,
        };
      });
    }
  }, [userRegister.userEmail]);

  useEffect(() => {
    let val = userRegister.userPassword;
    if (
      val === "" ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/.test(val)
    ) {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userPassword: false,
        };
      });
    } else {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userPassword: true,
        };
      });
    }
  }, [userRegister.userPassword]);

  useEffect(() => {
    let val = userRegister.userConfirmPassword;
    if (
      val === "" ||
      userRegister.userConfirmPassword === userRegister.userPassword
    ) {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userConfirmPassword: false,
        };
      });
    } else {
      setUserRegisterInputFeild((prevValue) => {
        return {
          ...prevValue,
          userConfirmPassword: true,
        };
      });
    }
  }, [userRegister.userConfirmPassword, userRegister.userPassword]);

  useEffect(() => {
    setErrorStatus(false);
  }, [
    userRegister.userName,
    userRegister.userEmail,
    userRegister.userPassword,
    userRegister.userConfirmPassword,
  ]);

  function handelChangeFormText(event) {
    const { name, value } = event.target;
    if (name === "userPassword" || name === "userConfirmPassword") {
      setUserRegister((prevValue) => {
        return {
          ...prevValue,
          [name]: value,
        };
      });
    } else {
      setUserRegister((prevValue) => {
        return {
          ...prevValue,
          [name]: value.toLowerCase().replace(/\s+/g, ""),
        };
      });
    }
  }

  function handleFormSubmit(event) {
    //console.log(userRegister);
    event.preventDefault();

    if (
      userRegisterInputFeild.userName === true ||
      userRegisterInputFeild.userEmail === true ||
      userRegisterInputFeild.userPassword === true ||
      userRegisterInputFeild.userConfirmPassword === true
    ) {
      setErrorMsg("Please enter valid Input feilds");
      setErrorStatus(true);
      //console.log("If error status: " + errorStatus);
    } else {
      setErrorMsg("");
      setErrorStatus(false);
      //console.log("Else error status: " + errorStatus);
      try {
        axios
          .post("https://pranayreddy-askquet.herokuapp.com/userRegistration", userRegister, {
            withCredentials: true,
          })
          .then(() => {
            dispatch(authActions.login());
          })
          .then((response) => {
            //console.log(response);

            setErrorMsg("");
            setErrorStatus(false);
            setUserRegister({
              userName: "",
              userEmail: "",
              userPassword: "",
              userConfirmPassword: "",
            });
            // localStorage.setItem("Authtoken", response.data.token);
            navigate("/home");
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
    <>
      <Header />
      <div className="askquetcard d-flex align-items-center justify-content-center text-center">
        <Card style={{ padding: "3%", minWidth: "30%", maxWidth: "30%" }}>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Enter UserName"
                name="userName"
                value={userRegister.userName}
                onChange={handelChangeFormText}
                required
              />
              {userRegisterInputFeild.userName ? (
                <Form.Text className="text-danger">
                  Minimun length 3, no space or characters are allowed.
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="userEmail"
                value={userRegister.userEmail}
                onChange={handelChangeFormText}
                required
              />
              {userRegisterInputFeild.userEmail ? (
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
                value={userRegister.userPassword}
                onChange={handelChangeFormText}
                required
              />
              {userRegisterInputFeild.userPassword ? (
                <Form.Text className="text-danger">
                  <ul style={{ textAlign: "left" }}>
                    <li> Minimum Length 8 </li>{" "}
                    <li>Should contain one capital letter </li>
                    <li> one small letter </li> <li> one number </li>
                    <li>and a special character </li>
                  </ul>
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="userConfirmPassword"
                value={userRegister.userConfirmPassword}
                onChange={handelChangeFormText}
                required
              />
              {userRegisterInputFeild.userConfirmPassword ? (
                <Form.Text className="text-danger">
                  Confrim Password Doesn't match
                </Form.Text>
              ) : null}
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
    </>
  );
}

export default Register;
