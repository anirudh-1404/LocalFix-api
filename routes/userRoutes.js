import express from "express";
import { loginUser, registerUser, assignAdminRole, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/assign-admin", assignAdminRole);
router.get("/users", getAllUsers);

export default router;
