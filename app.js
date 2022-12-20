require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Registeruser = require("./model");
const PostUsers = require("./model2");
const UsersComment = require("./model3");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const moment = require("moment");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const middleware = require("./middleware");
const refreshToken = require("./refreshToken");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/client/build")));
// const corsConfig = {
//   credentials: true,
//   origin: true,
// };

// moment.tz.add(
//   "Asia/Calcutta|HMT BURT IST IST|-5R.k -6u -5u -6u|01232|-18LFR.k 1unn.k HB0 7zX0"
// );
// moment.tz.link("Asia/Calcutta|Asia/Kolkata");
// const currentDateAndTime = moment().format("MM/DD/YYYY HH:mm:ss");

// var currentTime = new Date();
// var currentOffset = currentTime.getTimezoneOffset();
// var ISTOffset = 330; // IST offset UTC +5:30
// var ISTTime = new Date(
//   currentTime.getTime() + (ISTOffset + currentOffset) * 60000
// );

// mongoose
//   .connect("mongodb://localhost:27017/prblogDB123", {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("DB connection established");
//   });

// mongoose
//   .connect("mongodb://localhost:27017/prblogDB123", {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("DB connection established");
//   })
//   .catch((err) => console.log("DB error: ", err));

mongoose
  .connect(
    "mongodb+srv://admin-pranay:adminpranay123@cluster0.aew4g.mongodb.net/askquet",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("DB Connection established");
  })
  .catch((err) => {
    console.log("DB error: ", err);
  });

app.post("/userRegistration", async (req, res) => {
  try {
    const { userName, userEmail, userPassword, userConfirmPassword } = req.body;
    let existemail = await Registeruser.findOne({ userEmail });
    let existuser = await Registeruser.findOne({ userName });
    if (existemail) {
      return res.status(400).send("Email already registered, Please login");
    }
    if (existuser) {
      return res.status(400).send("userName is already taken");
    }
    if (userPassword != userConfirmPassword) {
      return res.status(400).send("Passwords are not matching");
    }

    bcrypt.hash(userPassword, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(400).send("Bcrypt Error: ", err);
      }
      // console.log("Bcrypt Hash: ", hash);

      let newUser = new Registeruser({
        userName: userName,
        userEmail: userEmail,
        userPassword: hash,
      });

      await newUser.save().then(() => {
        // console.log("Save then inside promise");
        let payload = {
          user: {
            userName: userName,
            userEmail: userEmail,
          },
        };
        // console.log(payload);
        jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY,
          { expiresIn: "49h" },
          (err, token) => {
            if (err) throw err;
            res.cookie(userName, token, {
              path: "/",
              expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
              httpOnly: true,
              sameSite: "lax",
            });
            return res.send({ token });
          }
        );
      });
    });
    //res.status(200).send("Registered Sucessfully");
  } catch (err) {
    console.log("/userRegistration " + err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/userLogin", async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;
    let exist = await Registeruser.findOne({ userEmail: userEmail });
    //console.log(exist);
    if (!exist) {
      return res.status(400).send("Email not found, Please register");
    }
    // if (exist.userPassword !== userPassword) {
    //   return res.status(400).send("Incorrect Password");
    // }

    bcrypt.compare(userPassword, exist.userPassword, function (err, result) {
      if (result === false) {
        return res.status(400).send("Incorrect Password");
      } else {
        let payload = {
          user: {
            userName: exist.userName,
            userEmail: exist.userEmail,
          },
        };
        // console.log(payload);
        jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY,
          { expiresIn: "49h" },
          (err, token) => {
            if (err) throw err;
            //console.log("Generated Token\n", token);
            if (req.cookies[`${exist.userName}`]) {
              req.cookies[`${exist.userName}`] = "";
            }
            res.cookie(exist.userName, token, {
              path: "/",
              expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
              httpOnly: true,
              sameSite: "lax",
            });
            return res.send({ token });
          }
        );
      }
    });
  } catch (err) {
    console.log("/userLogin " + err);
    return res.status(500).send("Server Error");
  }
});

app.post("/dashboard", middleware, async (req, res) => {
  try {
    let findEmail = req.user.userEmail;
    // console.log("Find Email " + findEmail);
    let exist = await Registeruser.findOne({ userEmail: findEmail });
    if (!exist) {
      return res.status(400).send("User not found");
    }
    res.send({
      _id: exist._id,
      userName: exist.userName,
      userEmail: exist.userEmail,
    });
  } catch (err) {
    console.log("/dashboard " + err);
    return res.status(500).send("Server Error");
  }
});

app.post("/refresh", refreshToken, middleware, async (req, res) => {
  try {
    let findEmail = req.user.userEmail;
    //console.log("Find Email " + findEmail);
    let exist = await Registeruser.findOne({ userEmail: findEmail });
    if (!exist) {
      return res.status(400).send("User not found");
    }
    res.json({
      _id: exist._id,
      userName: exist.userName,
      userEmail: exist.userEmail,
    });
  } catch (err) {
    console.log("/refresh " + err);
    return res.status(500).send("refresh error");
  }
});

app.post("/post_user", async (req, res) => {
  const currentDateAndTime = moment();
  const { userName, title, content } = req.body;
  let newUserPost = new PostUsers({
    userName: userName,
    userPostTitle: title,
    userPostContent: content,
    userPostCreate: currentDateAndTime,
  });
  await newUserPost
    .save()
    .then(() => {
      return res.send("newUserPost instered to DB");
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

app.post("/post_user123", middleware, async (req, res) => {
  try {
    let findEmail = req.user.userEmail;
    //console.log("Find Email " + findEmail);
    let exist1 = await Registeruser.findOne({ userEmail: findEmail });
    if (!exist1) {
      return res.status(400).send("User not found");
    }
    // res.send({
    //   _id: exist1._id,
    //   userName: exist1.userName,
    //   userEmail: exist1.userEmail,
    // });

    let exist = await PostUsers.find({}).sort("-userPostCreate");
    // console.log(exist);
    if (!exist) {
      return res.status(400).send("No userposts records found");
    }
    res.json({
      userdetailsbackend: {
        _id: exist1._id,
        userName: exist1.userName,
        userEmail: exist1.userEmail,
      },
      existdetails: exist,
    });
    // res.send(exist);
  } catch (err) {
    console.log("get /post_user: " + err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/delete_post_user", async (req, res) => {
  let { id } = req.body;
  PostUsers.deleteOne({ _id: id })
    .then(() => {
      return res.status(200).json({ message: "deleted Sucessfully" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "Not deleted" });
    });
});

app.post("/post_page", async (req, res) => {
  let { id } = req.body;
  //console.log("userPostId: " + id);
  try {
    let exist = await PostUsers.find({ _id: id });
    if (!exist) {
      return res.status(400).send("No userposts records found");
    }
    res.send(exist);
  } catch (err) {
    console.log("get /post_page: " + err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/user_comment", async (req, res) => {
  const currentDateAndTime = moment();
  const { userPostId, userName, userComment } = req.body;
  let newUserComment = new UsersComment({
    userPostId: userPostId,
    userName: userName,
    userComment: userComment,
    userPostCreate: currentDateAndTime,
  });
  await newUserComment
    .save()
    .then(() => {
      return res.send("NewUserComment inserted into DB");
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

app.post("/getuser_comment123", async (req, res) => {
  try {
    let exist = await UsersComment.find({}).sort("-userPostCreate");
    if (!exist) {
      return res.status(400).send("No usercomments records found");
    }
    res.send(exist);
  } catch (err) {
    console.log("get /post_user: " + err);
    return res.status(500).send("Internal server error");
  }
});

app.post("/logout", middleware, (req, res) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  //console.log("PrevToken", prevToken);
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find the token" });
  }
  jwt.verify(prevToken, process.env.JWT_SECRET_KEY, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication Failed" });
    }
    let payload = {
      user: {
        userName: result.user.userName,
        userEmail: result.user.userEmail,
      },
    };
    //console.log("clearcookie", result.user.userName);
    res.clearCookie(`${result.user.userName}`);
    // req.cookies[`${result.user.userName}`] = "";
    return res.status(200).json({ message: "Sucessfully Logged out" });
  });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/client/build/index.html");
});

var port = process.env.PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(port, () => {
  console.log("Running on Port" + port);
});
