import { Request, Response, Router } from "express";
import { checkAuthenticated } from "../controllers/auth.controller";

const start = Router()
start.get("/", checkAuthenticated, (req: Request, res: Response) => {
    res.render("start-page")
})

export default start;