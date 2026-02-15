import express from "express";
import { upload } from "../utils/multerConfig.js";
import {
    enrollProvider,
    getAllProviders,
    getProviderProfile,
    updateProviderProfile,
    updateProviderStatus,
    deleteProvider,
} from "../controllers/providerController.js";

const router = express.Router();

// Public/Authenticated Enrollment
router.post(
    "/enroll",
    upload.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "certification", maxCount: 1 },
        { name: "idImage", maxCount: 1 },
        { name: "documents", maxCount: 5 }
    ]),
    enrollProvider
);

// Admin/Shared CRUD
router.get("/", getAllProviders);
router.get("/:id", getProviderProfile);
router.put("/profile/:id", updateProviderProfile);
router.patch("/status/:id", updateProviderStatus);
router.delete("/:id", deleteProvider);

export default router;
