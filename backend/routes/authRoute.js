import { Router } from "express";


const router = Router();

router.get("/signup", (req, res) => {
    res.json("User Signup");
});

export default router;