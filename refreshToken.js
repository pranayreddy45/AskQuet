const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    // console.log("I am in refresh token js page");
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(400).send("Token not found");
    }
    const prevToken = cookies.split("=")[1];
    // console.log("PrevToken", prevToken);
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
      // console.log("clearcookie", result.user.userName);
      res.clearCookie(`${result.user.userName}`);
      req.cookies[`${result.user.userName}`] = "";

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "49h",
      });
      if (err) throw err;
      // console.log("Regenerated token\n", token);
      res.cookie(result.user.userName, token, {
        path: "/",
        expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "lax",
      });
      req.user = result.user;
      next();
    });
  } catch (err) {}
};
