/* eslint-disable jsx-a11y/anchor-is-valid */
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Moment from "react-moment";
import "moment-timezone";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/note.css";
import { useRef } from "react";
function Note(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [isExpanded1, setExpanded1] = useState(false);
  const [isExpandedText, setExpandedText] = useState("Read More");
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  useEffect(() => {
    axios
      .post("https://pranayreddy-askquet.herokuapp.com/getuser_comment123")
      .then((response) => {
        setCommentsCount(
          response.data.filter((item) => {
            return item.userPostId === props.id;
          }).length
        );
      })
      .catch((err) => {
        //console.log(err);
      });
    // count.current = comments.filter((item) => {
    //   return item.userPostId === props.id;
    // }).length;
  }, []);

  function handleClick() {
    //console.log("Delete Note Id: ", props.id);
    axios
      .post("https://pranayreddy-askquet.herokuapp.com/delete_post_user", {
        id: props.id,
      })
      .then((response) => {
        //console.log(response.message);
        props.onAdd();
        // props.onDelete(props.id);
      })
      .catch((err) => {
        //console.log("Delete err: ", err);
      });
  }
  function handleLinkClick() {
    props.onPostClick(props.id);
  }
  function expand() {
    setExpanded(!isExpanded);
    setExpandedText(isExpanded ? "Read More" : "Read Less");
  }
  const setLines = (
    <a onClick={expand} style={{ color: "blue", cursor: "pointer" }}>
      {isExpandedText}
    </a>
  );
  const ReadFullContext = (
    <Link
      style={{
        textDecoration: "none",
        color: "RGB(180, 180, 180)",
        fontWeight: "bold",
        fontFamily: "arial",
      }}
      to={`/post/${props.id}/${props.title}`}
      onClick={handleLinkClick}
    >
      {" "}
      Read full context
    </Link>
  );
  return (
    <div>
      <Card
        style={
          props.notename === "postusercomment"
            ? { width: "60%", maxHeight: "300px" }
            : { width: "100%", height: "500px" }
        }
        border="none"
        className="customeCard"
      >
        {props.notename === "postusercomment" ? null : (
          <Card.Header
            as="h1"
            style={
              props.title.length > 60
                ? { height: "120px", overflow: "scroll" }
                : null
            }
          >
            {" "}
            <Link
              style={{
                textDecoration: "none",
                color: "RGB(180, 180, 180)",
                fontWeight: "bold",
                fontFamily: "arial",
              }}
              to={`/post/${props.id}/${props.title}`}
              onClick={handleLinkClick}
            >
              {" "}
              {props.title.length > 50 ? (
                <h4>{props.title}</h4>
              ) : props.title.length > 35 ? (
                <h3>{props.title}</h3>
              ) : props.title.length > 15 ? (
                <h2>{props.title}</h2>
              ) : (
                <h1>{props.title}</h1>
              )}{" "}
            </Link>{" "}
          </Card.Header>
        )}
        <Card.Body style={isExpanded ? { overflow: "scroll" } : null}>
          <Card.Text
            style={{ textAlign: "justify", textJustify: "inter-word" }}
          >
            {/* <p>{props.id} </p> */}
            <p
              style={{
                whiteSpace: "pre-line",
              }}
            >
              {props.content.length > 200 ? (
                isExpanded ? (
                  <>
                    {props.content.length > 2000 ? (
                      <>
                        {props.content.substring(0, 2000) + ".............."}{" "}
                        {ReadFullContext} <p>{setLines}</p>
                      </>
                    ) : (
                      <>
                        {props.content} <p>{setLines}</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {props.content.substring(0, 250) + ".............."}{" "}
                    {setLines}
                  </>
                )
              ) : (
                props.content
              )}
            </p>

            <p>
              <footer
                className="blockquote-footer"
                style={{ marginTop: "10px", float: "right" }}
              >
                Posted by User{" "}
                <cite title="Source Title">
                  <span>{props.userName}</span>
                </cite>
              </footer>
            </p>

            <br></br>
            <br></br>
            <p>
              <footer className="blockquote-footer" style={{ float: "right" }}>
                {" "}
                <cite title="Source Title">
                  <span>
                    <Moment format="DD/MM/YYYY HH:mm">{props.date}</Moment>
                  </span>
                </cite>
              </footer>
            </p>

            <br></br>

            <p>
              <footer style={{ float: "right" }}>
                {" "}
                <span>
                  {props.propsname === "userposts" ? (
                    <Button
                      style={{ float: "right" }}
                      variant="danger"
                      onClick={handleClick}
                    >
                      Delete
                    </Button>
                  ) : null}
                </span>
              </footer>
            </p>

            {/* {comments.map((commentItem, index) => {
              return commentItem.userPostId === props.id ? "aaa" : null;
            })}

            {
              (count = comments.filter((item) => {
                return item.userPostId === props.id;
              }).length)
            } */}
            <p>
              <Card.Link
                as={Link}
                to={{
                  pathname: `/post/${props.id}/${props.title}`,
                  hash: "#usersComments",
                }}
              >
                {commentsCount > 0 ? commentsCount + " Comments" : undefined}
              </Card.Link>
            </p>

            {/* <button onClick={handleClick}>Delete</button> */}
            {/* <p>======================================================</p> */}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Note;
