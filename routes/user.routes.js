const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
} = require("../controllers/user.controller");

const UserRouter = Router();

UserRouter.get("/", getAllUsers);

UserRouter.get("/:id", getUserById);

UserRouter.post("/", createUser);

// UserRouter.put("/:id");

UserRouter.delete("/:id", deleteUserById);

module.exports = {
  UserRouter,
};
