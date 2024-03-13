import {  Response } from 'express'
import { QueryResult } from 'pg';
import pool from '../dbConfig';

const lobby = async (req: any, res: Response) => {
	const roomsQuery = await pool.query(`SELECT * FROM room`)
	let rooms = await returnRoomsFromQuery(roomsQuery);
	let admin = req.user.admin_acc;
    res.render("lobby", { user: {username:  admin ? "Админ " + req.user.p_username : req.user.p_username, id: req.user.p_id}, rooms, isAdmin: admin});
}

async function returnRoomsFromQuery(query: QueryResult<any>){
	let rooms: { name: any; current: any; max: any, id: any, state: any }[] = []


	for (const room of query.rows) {
		const roomOwner = await pool.query(`SELECT * FROM player WHERE p_id = $1`, [room.r_owner_id]);
		rooms.push({ name: roomOwner.rows[0].p_username, current: room.r_joined_players == null ? 0 : room.r_joined_players.length, max: room.r_max_players, id: room.r_id, state: room.r_state });
	}
	return rooms;
}

export {lobby};