import axios from "axios";
import React from "react";
import { useEffect, useState, createContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import Header from "./Header";
import Notes from "./Notes";
axios.defaults.withCredentials = true;

function Dashboard(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [firstRender, setFirstRender] = useState(true);
  const [userDetails, setUserDetails] = useState({
    userName: "",
    userEmail: "",
  });
  const refreshToken = async () => {
    const res = await axios
      .post("https://pranayreddy-askquet.herokuapp.com/refresh", {
        withCredentials: true,
      })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        //console.log(err)
      });

    // const data = await res.data;
    // return data;
  };
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      axios
        .post("https://pranayreddy-askquet.herokuapp.com/dashboard", {
          withCredentials: true,
        })
        .then((response) => {
          //console.log("response " + response);
          setUserDetails(() => {
            return {
              userName: response.data.userName,
              userEmail: response.data.userEmail,
            };
          });
          //console.log("userDashboard: ");
          //console.log(userDetails);
        })
        .catch((err) => {
          //console.log("Catch error " + err);
          dispatch(authActions.logout());
          navigate("/");
        });
      refreshToken().then(() => {
        dispatch(authActions.login());
      });
    }
    let interval = setInterval(() => {
      refreshToken();
      // .then((data) =>
      //   setUserDetails(() => {
      //     return {
      //       userName: data.userName,
      //       userEmail: data.userEmail,
      //     };
      //   })
      // );
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <Header userName={userDetails.userName} />
      {/* <h1> Welcome to {userDetails.userName}</h1> */}
      <Notes userName={userDetails.userName} />
    </div>
  );
}

export default Dashboard;
