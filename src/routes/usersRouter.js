const express = require("express");
const deleteUserController = require("../controllers/users/delete");
const getUserByIdController = require("../controllers/users/getUser");
const login = require("../controllers/users/login");
const updateUserController = require("../controllers/users/update");
const register = require("../controllers/users/register");
const verifyOtpAndLogin = require("../controllers/users/verifyOtp");
const forgotPassword = require("../controllers/users/forgotPassword");
const resetPassword = require("../controllers/users/resetPassword");

const userRouter = express.Router();

// Auth
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/verify-otp", verifyOtpAndLogin);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

// User
userRouter.get("/:id", getUserByIdController);
userRouter.put("/", updateUserController);
userRouter.delete("/", deleteUserController);

module.exports = userRouter;
