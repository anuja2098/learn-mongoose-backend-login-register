const jwt = require("jsonwebtoken");
const { UserModel } = require("../schemas/user.schema");

const SECRET_KEY = "MY_APP_JWT_SECRET";
const REFRESH_SECRET_KEY = "MY_APP_REFRESH_SECRET";

const fetchUser = async (req, res, next) => {
  if (req.user) {
    return next();
  }
  const token = req.header("token");
  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Please authenticate using a valid token",
    });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    if (!user) {
      return res.status(401).json({
        message: "Unauthenticated user",
        success: false,
      });
    }

    const dbUser = await UserModel.findOne({ email: user.email });

    if (!dbUser) {
      return res.status(401).json({
        message: "Unauthenticated user",
        success: false,
      });
    }
    req.user = dbUser;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
        success: false,
      });
    } else {
      next(error);
    }
  }
};

const handleRefreshToken = async (req, res, next) => {
  const refreshToken = req.header("refresh-token");
  console.log(refreshToken);

  if (!refreshToken) {
    return res.status(401).json({
      message: "Please authenticate using a valid token",
    });
  }

  try {
    const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const dbUser = await UserModel.findOne({ email: decodedRefresh.email });

    if (!dbUser) {
      return res.status(401).json({
        message: "Unauthenticated user.",
        success: false,
      });
    }

    req.user = dbUser;

    next();
  } catch (error) {
    next(error);
    // console.log(error);
    return res.status(403).json({
      message: "Invalid or expired refresh token.",
      success: false,
    });
  }
};

module.exports = {
  fetchUser,
  SECRET_KEY,
  REFRESH_SECRET_KEY,
  handleRefreshToken,
};
