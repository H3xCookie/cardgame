import { Router } from "express";
import { search, postSearch } from "../controllers/search.controller"

const searchRouter = Router()

searchRouter.post('/', postSearch)
searchRouter.get('/', search);

export default searchRouter;