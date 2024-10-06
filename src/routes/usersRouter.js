const express = require("express");
const deleteUserController = require("../controllers/users/delete");
const getUserByIdController = require("../controllers/users/getUser");
const login = require("../controllers/users/login");
const updateUserController = require("../controllers/users/update");
const register = require("../controllers/users/register");

const userRouter = express.Router();


//Auth
userRouter.post("/register", register);
userRouter.post("/login", login);

//User
userRouter.get("/:id", getUserByIdController);
userRouter.put("/", updateUserController);
userRouter.delete("/", deleteUserController);

module.exports = userRouter;
