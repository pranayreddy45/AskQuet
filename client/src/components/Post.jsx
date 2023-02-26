import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";
import Header from "./Header";
import Note from "./Note";

function Post() {
  let origin = window.location.origin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState();
  const [userpost, setuserpost] = useState({
    posttitle: "",
    postcontent: "",
  });
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  let params = useParams();
  let id = params.id;
  const refreshToken = async () => {
    const res = await axios
      .post(origin + "/refresh", {
        withCredentials: true,
      })
      .catch((err) => {
        //console.log("err ", err);
        navigate("/");
      });

    const data = await res.data;
    //console.log("refresh data", data.userName);
    return data;
  };
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(function () {
        let objControl = document.getElementById("usersComments");
        objControl.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);
    }
    refreshToken()
      .then((response) => {
        //console.log("Post data", response.userName);
        setUserName(response.userName);
      })
      .then(() => {
        dispatch(authActions.login());
      })
      .catch((err) => {
        //console.log("err ", err);
      });

    //console.log("Params Id: " + id);
    axios
      .post(
        origin + "/post_page",
        { id },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        // console.log(
        //   response.data[0].userPostTitle,
        //   response.data[0].userPostContent
        // );
        setuserpost(() => {
          return {
            posttitle: response.data[0].userPostTitle,
            postcontent: response.data[0].userPostContent,
          };
        });
        //console.log(userpost);
        addNote();
      })
      .catch((err) => {
        //console.log(err);
        navigate("/home");
      });
    let interval = setInterval(() => {
      refreshToken().then((data) => setUserName(data.userName));
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  function addNote() {
    setComments([]);
    axios
      .post(origin + "/getuser_comment123")
      .then((response) => {
        response.data.forEach((element) => {
          setComments((prevValue) => {
            return [...prevValue, element];
          });
          setCommentsCount(
            response.data.filter((item) => {
              return item.userPostId === id;
            }).length
          );
        });
        //console.log(comments);
      })
      .catch((err) => {
        //console.log(err);
      });
  }

  return (
    <>
      <div>
        <Header userName={userName} />
        <div
          className="align-items-center justify-content-center"
          style={{
            marginLeft: "5%",
            marginRight: "10%",
            marginTop: "2%",
            textAlign: "justify",
            textJustify: "inter-word",
          }}
        >
          <h1>{userpost.posttitle}</h1>
          <p style={{ whiteSpace: "pre-line" }}>{userpost.postcontent}</p>
        </div>
        <div style={{ marginLeft: "5%", marginTop: "5%" }}>
          <div>
            <Comments postId={id} userName={userName} onAdd={addNote} />
          </div>
        </div>
        <div id="usersComments" style={{ marginTop: "3%", marginLeft: "5%" }}>
          {commentsCount > 0 && <h3>Comments</h3>}
          <div>
            {comments.map((commentItem, index) => {
              return commentItem.userPostId === id ? (
                <Note
                  key={index}
                  count={index}
                  notename="postusercomment"
                  id={commentItem._id}
                  content={commentItem.userComment}
                  userName={commentItem.userName}
                  date={commentItem.userPostCreate}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
