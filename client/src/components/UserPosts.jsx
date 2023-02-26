import axios from "axios";
import { useEffect, useState, useContext } from "react";
import CreateArea from "./CreateArea";
import Note from "./Note";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "./Header";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

function UserPosts(props) {
  let origin = window.location.origin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postId, setPostId] = useState();
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState();
  const refreshToken = async () => {
    const res = await axios
      .post(origin + "/refresh", {
        withCredentials: true,
      })
      .catch((err) => {
        //console.log(err);
        navigate("/");
      });

    const data = await res.data;
    return data;
  };
  useEffect(() => {
    setNotes([]);
    refreshToken()
      .then((data) => {
        setUserName(data.userName);
      })
      .then(() => {
        dispatch(authActions.login());
      })
      .catch((err) => {
        //console.log("err ", err);
      });
    //console.log("useEffect NOtes userposts ");
    axios
      .post(origin + "/post_user123", {
        withCredentials: true,
      })
      .then((response) => {
        setUserName(response.data.userdetailsbackend.userName);
        response.data.existdetails.forEach((element) => {
          setNotes((prevValue) => {
            return [...prevValue, element];
          });
        });
        //console.log(notes);
      })
      .catch((err) => {
        //console.log(err);
        dispatch(authActions.logout());
        navigate("/");
      });
    let interval = setInterval(() => {
      refreshToken().then((data) => setUserName(data.userName));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);
  function addNote() {
    setNotes([]);
    //console.log("addNote function");
    axios
      .post(origin + "/post_user123", {
        withCredentials: true,
      })
      .then((response) => {
        response.data.existdetails.forEach((element) => {
          setNotes((prevValue) => {
            return [...prevValue, element];
          });
        });
        //console.log(notes);
      })
      .catch((err) => {
        //console.log(err);
      });
  }
  // function deleteNote(id) {
  //   console.log(id);
  // }

  function getPostId(id) {
    setPostId(id);
  }
  return (
    <div>
      <Header userName={userName} />
      <Container fluid>
        <CreateArea userName={userName} onAdd={addNote} />
        <Row className="justify-content-md-center">
          {notes.map((noteItem, index) => {
            return noteItem.userName === userName ? (
              <Col sm={6} md={6} lg={6} xl={4}>
                <Note
                  propsname="userposts"
                  key={index}
                  count={index}
                  id={noteItem._id}
                  title={noteItem.userPostTitle}
                  content={noteItem.userPostContent}
                  date={noteItem.userPostCreate}
                  userName={noteItem.userName}
                  onAdd={addNote}
                  onPostClick={getPostId}
                />
              </Col>
            ) : null;
          })}
        </Row>
      </Container>
    </div>
  );
}

export default UserPosts;
