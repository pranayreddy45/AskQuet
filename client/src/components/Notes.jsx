import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
import Note from "./Note";
import Post from "./Post";
import UserPosts from "./UserPosts";
axios.defaults.withCredentials = true;
function Notes(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let origin = window.location.origin;
  const [postId, setPostId] = useState();
  const [notes, setNotes] = useState([]);
  const [comments, setComments] = useState([]);
  // let authToken = localStorage.getItem("Authtoken");
  useEffect(() => {
    setNotes([]);
    //console.log("useEffect NOtes");
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
        dispatch(authActions.logout());
        navigate("/");
      });
  }, []);

  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }
  function getPostId(id) {
    setPostId(id);
  }
  return (
    <div>
      <Container fluid>
        <Row className="justify-content-md-center">
          {notes.map((noteItem, index) => {
            return noteItem.userName !== props.userName ? (
              <Col sm={6} md={6} lg={6} xl={4}>
                <Note
                  key={index}
                  count={index}
                  id={noteItem._id}
                  title={noteItem.userPostTitle}
                  content={noteItem.userPostContent}
                  userName={noteItem.userName}
                  date={noteItem.userPostCreate}
                  onDelete={deleteNote}
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

export default Notes;
