import express from "express";
import { getVault, setVault } from "../controllers/vault.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// @route   GET api/vault
// @desc    Get user's encrypted vault
// @access  Private
router.get("/", protect, getVault);

// @route   POST api/vault
// @desc    Create or update user's encrypted vault
// @access  Private
router.post("/", protect, setVault);

export default router;
