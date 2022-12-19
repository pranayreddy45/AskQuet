import axios from "axios";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";

function Comments(props) {
  const [comment, setComment] = useState("");
  function handleChange(event) {
    const { name, value } = event.target;
    setComment(value);
  }
  function submitComment(event) {
    event.preventDefault();
    if (comment.trim().length === 0) {
    } else {
      try {
        axios
          .post("https://pranayreddy-askquet.herokuapp.com/user_comment", {
            userPostId: props.postId,
            userName: props.userName,
            userComment: comment,
          })
          .then((response) => {
            props.onAdd();
            setComment("");
            //console.log(response.data);
          })
          .catch((err) => {
            //console.log("Localhost 400 user_comment err: " + err);
          });
      } catch (err) {
        //console.log("Localhost 400 user_comment err: " + err);
      }
    }
  }
  return (
    <>
      <form onSubmit={submitComment}>
        <div style={{ float: "left" }}>
          <textarea
            name="textareacomment"
            rows="3"
            cols="50"
            value={comment}
            onChange={handleChange}
          >
            {" "}
          </textarea>
        </div>
        {/* <button type="submit">post</button> */}
        <Fab type="submit" style={{ marginTop: "20px", marginLeft: "25px" }}>
          <AddIcon />
        </Fab>
      </form>
    </>
  );
}

export default Comments;
