import axios from "axios";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function CreateArea(props) {
  const navigate = useNavigate();
  const [isExpanded, setExpanded] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }
  function expand() {
    setExpanded(true);
  }
  function submitNote(event) {
    event.preventDefault();
    if (note.title.trim().length === 0 || note.content.trim().length === 0) {
    } else {
      try {
        axios
          .post("https://pranayreddy-askquet.herokuapp.com/post_user", {
            userName: props.userName,
            title: note.title.trim(),
            content: note.content,
          })
          .then((response) => {
            props.onAdd();
            setNote({
              title: "",
              content: "",
            });
            //console.log("Registered Successfully");
          })
          .catch((err) => {
            //console.log("Localhost 400 post_user err: " + err);
            navigate("/");
          });
      } catch (err) {
        //console.log("Localhost 400 post_user err: " + err);
      }
    }
  }
  return (
    <div>
      {/* <form>
        {isExpanded && (
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
          />
        )}

        <textarea
          name="content"
          rows={isExpanded ? 3 : 1}
          cols="30"
          value={note.content}
          onClick={expand}
          onChange={handleChange}
        ></textarea>
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form> */}
      <Card
        style={{
          width: "80%",
          border: "none",
          margin: "5%",
          marginTop: "5%",
        }}
      >
        <Form onSubmit={submitNote}>
          {isExpanded && (
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlInput1"
              style={{ width: "60%" }}
            >
              {/* <Form.Label>Email address</Form.Label> */}
              <Form.Control
                type="text"
                name="title"
                placeholder="Title"
                value={note.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
          <div style={{ width: "60%", float: "left" }}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              {/* <Form.Label>Example textarea</Form.Label> */}
              <Form.Control
                as="textarea"
                name="content"
                rows={isExpanded ? 5 : 1}
                cols="10"
                value={note.content}
                onClick={expand}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>
          <Zoom in={isExpanded}>
            <Fab
              type="submit"
              style={{ marginTop: "75px", marginLeft: "25px" }}
            >
              <AddIcon />
            </Fab>
          </Zoom>
        </Form>
      </Card>
    </div>
  );
}

export default CreateArea;
