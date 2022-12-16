const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // let token = req.header("x-token");
    // if (!token) {
    //   return res.status(400).send("Token not found");
    // }
    // let decode = jwt.verify(token, "jwtSecret");
    // req.user = decode.user;
    // next();
    console.log("I middleware js page");
    const cookies = req.headers.cookie;
    // if (!cookies) {
    //   res.status(400).send("Cookies not found, Please try login again");
    // }

    if (!cookies) {
      return res.status(400).send("Token not found");
    }
    const token = cookies.split("=")[1];
    // console.log(token);
    if (!token) {
      return res.status(400).send("Token not found");
    }
    // let decode = jwt.verify(token, "jwtSecret");
    // req.user = decode.user;
    // next();
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication Failed" });
      }
      req.user = result.user;
      // console.log("I am req user\n", req.user.userEmail);
      next();
    });
  } catch (err) {
    console.log("Middleware " + err);
    return res.status(500).send("Invalid token");
  }
};
