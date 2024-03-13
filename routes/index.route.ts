import { Router } from "express";
import usersRouter from "./users.route"
import roomRouter from "./room.route"
import deckRouter from "./decks.route";
import lobbyRouter from "./lobby.route";
import start from "./start.route";
import { checkNotAuthenticated } from "../controllers/auth.controller";
import searchRouter from "./search.route";

const router = Router();

router.use("/room", checkNotAuthenticated, roomRouter);
router.use("/lobby",checkNotAuthenticated, lobbyRouter);
router.use("/decks", checkNotAuthenticated, deckRouter);
router.use("/search", checkNotAuthenticated, searchRouter);
router.use("/users", usersRouter);
router.use("/", start);
router.use("*", checkNotAuthenticated, (req, res) => {res.redirect("/lobby")});

export default router;