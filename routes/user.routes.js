const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUserById,
  loginUser,
  getUserInfo,
  registerUser,
  getAccessToken,
} = require("../controllers/user.controller");
const {
  fetchUser,
  handleRefreshToken,
} = require("../middlewares/fetchUser.middleware");

const UserRouter = Router();

UserRouter.get("/", getAllUsers);

UserRouter.get("/userinfo", fetchUser, getUserInfo);

UserRouter.get("/token", handleRefreshToken, getAccessToken);

UserRouter.post("/register", registerUser);

UserRouter.post("/login", loginUser);

UserRouter.delete("/:id", deleteUserById);
UserRouter.get("/:id", getUserById);

module.exports = {
  UserRouter,
};
