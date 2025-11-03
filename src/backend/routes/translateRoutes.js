import express from "express";
import { translateText } from "../services/translateService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { text, from, to } = req.body;
    try {
        const data = await translateText(text, from, to);
        res.json(data);
    } catch (err) {
        console.error("Translate error:", err);
        res.status(500).json({ error: "Translation failed"});
    }
});

export default router;