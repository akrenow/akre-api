const express = require("express");
const deleteUserController = require("../controllers/users/delete");
const getUserByIdController = require("../controllers/users/getUser");
const login = require("../controllers/users/login");
const updateUserController = require("../controllers/users/update");
const register = require("../controllers/users/register");

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/:id", getUserByIdController);
userRouter.put("/:id", updateUserController);
userRouter.delete("/:id", deleteUserController);

module.exports = userRouter;
