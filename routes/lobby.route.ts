import { Router } from 'express'
import {checkNotAuthenticated} from '../controllers/auth.controller';
import {lobby} from '../controllers/lobby.controller'

const lobbyRouter = Router()

lobbyRouter.get('/', checkNotAuthenticated, lobby);

export default lobbyRouter;