import { Router } from 'express';
import {checkNotAuthenticated, checkAuthenticated} from '../controllers/auth.controller';
import { login, register, logout, profile, admin, postlogin, postregister, profileId, sendFriendRequest, acceptFriendRequest } from "../controllers/users.controller"

const usersRouter = Router()

usersRouter.post('/login', postlogin);
usersRouter.post('/register', postregister)
usersRouter.post("/profile/:id/send-request", checkNotAuthenticated, sendFriendRequest);
usersRouter.post("/profile/:id/accept-request", checkNotAuthenticated, acceptFriendRequest);

usersRouter.get("/login", checkAuthenticated, login);
usersRouter.get("/register", checkAuthenticated, register);
usersRouter.get("/profile", checkNotAuthenticated, profile);
usersRouter.get("/profile/:id", checkNotAuthenticated, profileId);
usersRouter.get("/admin", checkNotAuthenticated, admin);
usersRouter.get("/logout", checkNotAuthenticated, logout);

export default usersRouter;