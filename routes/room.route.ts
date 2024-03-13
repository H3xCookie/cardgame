import { Router } from 'express';
import { room, addRoom, removeRoom} from '../controllers/room.controller'

const roomRouter = Router();

roomRouter.post('/', addRoom)
roomRouter.post('/remove-room/:roomId', removeRoom )
roomRouter.get('/:roomId', room);

export default roomRouter;