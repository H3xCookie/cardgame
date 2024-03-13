import { Response } from 'express';
import { getUsernameById, makeid } from './std.controller'
import { getDecksByUserId, getBookmarkedDecksByUserId } from './decks.controller';
import pool from '../dbConfig';

const room = async (req: any, res: Response) => {
    const roomId = req.params.roomId;
        let admin = req.user.admin_acc;
        const query = await pool.query(`SELECT * FROM room WHERE r_id = $1`, [roomId])
        if(query.rows.length > 0){
          let ownr = query.rows[0].r_owner_id == req.user.p_id;
            const username = await getUsername(query.rows[0])
            let decks = await getDecksByUserId(query.rows[0].r_owner_id)
            const bookmarkedDecks: any = await getBookmarkedDecksByUserId(query.rows[0].r_owner_id)

            console.log('LOEADINGF ROM')
            console.log('DSEG: ')
            console.log(decks)

            console.log('\nboogmarkds')
            console.log(bookmarkedDecks)

            bookmarkedDecks.forEach((deck: { id: string; name: string; cards: string[]; }) => {
                decks.push(deck)
            })

            console.log('\n\nfinal:')
            console.log(decks)

            const players = await getPlayersByRoomId(roomId)
            const gameState = await query.rows[0].r_state
            res.render('room', { user: { username: admin ? "Админ " + req.user.p_username : req.user.p_username, id: req.user.p_id}, owner: username, roomId, isAdmin: admin, inRoom: true, playerId: req.user.p_id, ownr, players, decks, gameState});
        }else{
            res.redirect('back')
        }
}

const addRoom = async (req: any, res: Response) => {
    const { p_id } = req.user;
    const r_id = makeid(6)

    const result: any = await pool.query(`
        INSERT INTO room (r_id, r_owner_id, r_state, r_max_players)
        VALUES ($1, $2, 'ИЗЧАКВАНЕ', 10)
        RETURNING r_id;
    `, [r_id, p_id]);

    const roomId = result.rows[0].r_id;
    
    res.redirect(`/room/${roomId}`);
};

const removeRoom = async (req: any, res: Response) => {
    const id = req.params.roomId
        const room = await pool.query('SELECT * FROM room WHERE r_id = $1',[id])
        if(room.rows[0]){
            console.log(`INFO: Removed room with id ${id}`)
            pool.query(`DELETE FROM room WHERE r_id = $1`, [id])
            res.redirect(`/lobby`)
        }else{
            res.redirect(`/lobby`)
        }
}



async function getUsername(roomQuery: any){
    const query: any = await pool.query(`SELECT * FROM player WHERE p_id = $1`, [roomQuery.r_owner_id]);
    return query.rows[0].p_username;
}

async function getPlayersByRoomId(id: string){
    let playerArray: { id: string; username: any; }[] = []
    const query: any =  await pool.query(`
        SELECT r_joined_players
        FROM room
        WHERE r_id = $1 
    `,[id])

    if(query.rows[0].r_joined_players){
        for(id of query.rows[0].r_joined_players){
            playerArray.push({id: id, username: await getUsernameById(id)})
        }
    }

    return playerArray;
}

export {addRoom, removeRoom, room};
