import express from 'express'
import session  from 'express-session'
import flash from 'express-flash'
import path from 'path'
import passport from 'passport'
import initializePassport from './controllers/passport.controller'
import indexRouter from "./routes/index.route"
import * as http from 'http'
import { Server } from 'socket.io'
import pool from './dbConfig'
import { shuffle } from './controllers/std.controller'

const app: any = express();
const PORT: number = parseInt(process.env.PORT!) || 7777;
const httpServer = http.createServer(app)
const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET!,
	resave: false,
	saveUninitialized: false,
});

const userRooms = new Map<string, string>();   // id - room
const roomUsers = new Map<string, string[]>();   // room -id[] :)


const roomsInfo: { id: any; whiteCards: { id: string; text: string }[]; blackCards: { id: string; text: string }[]; queriedCards: any[]; points: { [x: string]: number }[]; king: string }[] = []

const roomsInfoMap = new Map(roomsInfo.map(room => [room.id, room]))

initializePassport(passport)

app.set('view engine', "ejs");
app.use(express.urlencoded({ extended: false }))

app.use(sessionMiddleware);


app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(express.static(path.join(__dirname, '../public'))) 
app.use("/", indexRouter)


const io = new Server(httpServer, {
    cors: {
		origin: `*`,
		methods: ["GET", "POST"]
		}
})

io.engine.use(sessionMiddleware)

io.on('connection', (socket) => {

	// @ts-ignore :)
	const req = socket.request.session.passport;
	let username = ''
	try{
		username = req.user.username
	}catch(err){
		return;	
	}
	const id = req.user.id

	let info = false

	socket.on('send-message', (room: any, message: any ) => {
		socket.to(room).emit('receive-message', username, info, message)
	})

	socket.on('join-room', async (room: any) => {
		let info = true
		let message = `${username} се присъедини`
		console.log(`${username} joined ${room}`)

		pool.query('UPDATE room SET r_joined_players = r_joined_players || $1 WHERE r_id = $2;', [[id], room])
		
		socket.join(room)
		socket.join(id)
	

		userRooms.set(id, room)

		if(roomUsers.has(room)){
			let rooms = roomUsers.get(room)!
			console.log('rooms:')
			console.log(rooms)
			rooms.push(id)
			roomUsers.set(room, rooms)
		}else{
			roomUsers.set(room, [id])
		}
		
		socket.to(room).emit('receive-message', username, info, message)
		socket.to(room).emit('update-room', true, req.user)
	})
	socket.on('disconnect', async () => {
		const room: any = userRooms.get(id)
		if(room){
			leaveRoom(room)
			leaveRoom(id)
		}
	})

	socket.on('leave-room', () => {
		const room: any = userRooms.get(id)
		leaveRoom(room)
		leaveRoom(id)
	})

	socket.on('remove-room', room => {
		socket.to(room).emit('redirect')
		// TODO: flash gam has bin delet
	})



	socket.on('try-start-game', async (decks, room, callback: Function) => {
		// IF LESS THAN 3 PLAYERS
		const players = roomUsers.get(room)!
		if(players.length < 3){
			callback ({
				status: 'Минимален брой играчи: 3'
			})
		// IF NO DECKS ARE SELECTED
		}else if(decks.length == 0){
				callback({
					status: 'Няма избрани тестета'
				})

		// CHECK DECKS
		}else{
			// --- DRAW CARDS ---
			const minWhiteCards = players.length * 8
			let whiteCards: {id: string, text: string}[] = [];
			let blackCards: {id: string, text: string}[] = [];
			let currentWhiteCards = 0;
			let hasBlackCard = false

			console.log('le statring game with decks: ')
			console.log(decks)

			for(const deck of decks){
				console.log('\n\niterating ')
				console.log(deck)

				const cardsQuery = await pool.query(`
					SELECT d_cards_id
					FROM deck
					WHERE d_id = $1
				`, [deck])


				for(const card of cardsQuery.rows[0].d_cards_id){
					const info = await pool.query(`
						SELECT c_text, c_black
						FROM card
						WHERE c_id = $1	
					`, [card])
					if(typeof info.rows[0] != 'undefined'){
						if(info.rows[0].c_black){
							if(!hasBlackCard)
								hasBlackCard = true
							blackCards.push({id: card, text: info.rows[0].c_text})
						}else{
							currentWhiteCards++
							whiteCards.push({id: card, text: info.rows[0].c_text})
						}
					}else{
						console.log(`${card} is invalid`)
					}
				}
			}

			if(!hasBlackCard){
				// DECK HAS NO BLAGG
				callback ({
					status: 'Няма черни карти'
				})
			}else if(currentWhiteCards < minWhiteCards){
				// NO MINIMUM WHITE CARDS
				callback ({
					status: `Минимален борй бели карти: ${minWhiteCards}, Брой бели карти в избраните тестета: ${currentWhiteCards}`
				})
			}else{
				// START GAME
				let king = random(players)
				let currentBlack = random(blackCards)
				let ctr = 0;


				pool.query(`
					UPDATE room
					SET r_state = 'В ИГРА'
					WHERE r_id = $1 
				`, [room])

				whiteCards = shuffle(whiteCards)
				blackCards = shuffle(blackCards)

				let remainingWhiteCards: { id: string; text: string }[] = []
				for(const id of players){
					io.to(id).emit('draw-card', whiteCards.slice(ctr * 8, ctr * 8 + 8))
					remainingWhiteCards = whiteCards.slice(ctr * 8 + 8)
					ctr++
				}

				io.to(room).emit('receive-card', currentBlack)

				roomsInfoMap.set(room, {id: room, 
					whiteCards: remainingWhiteCards,
					blackCards: blackCards,
					queriedCards: [],
					points: players.map((player) => ({[player]: 0})),
					king: king
				})

				roomsInfo.push({id: room, 
					whiteCards: whiteCards,
					blackCards: blackCards,
					queriedCards: [],
					points: players.map((player) => ({[player]: 0})),
					king: king
				})
				
				// players draw new card

				io.to(room).emit('start-game', king, true)

				callback ({
					status: 'ok'
				})
			}
		}
	})

	socket.on('send-card', async (cardId, callback: Function) => {
		const room: any = userRooms.get(id)
		const query = await pool.query(`
			SELECT *
			FROM card
			WHERE c_id = $1
		`, [cardId])

		if(query.rows.length > 0){
			const card = {id: query.rows[0].c_id, text: query.rows[0].c_text}
			let last = queryCard(id, room, card)

			roomsInfoMap.get(room)!.whiteCards.push(card)
			shuffle(roomsInfoMap.get(room)!.whiteCards)
			let randCard = random(roomsInfoMap.get(room)!.whiteCards)
			io.to(id).emit('draw-card', [randCard], false)

			if(last == true){
				console.log(`REVEALING TO KING: ${roomsInfoMap.get(room)!.king}`)
				io.to(room).emit('reveal', getQueriedCards(room), roomsInfoMap.get(room)!.king) 
			}

			callback({
				status: 'ok'
			})
		}else{
			callback({
				status: `ГРЕШКА: Няма карта с id: ${cardId}`
			})
		}
	})

	socket.on('select-card', async (pId, callback: Function) => {
		const room: any = userRooms.get(id)
		const winnerQuery = await pool.query(`
			SELECT *
			FROM player
			WHERE p_id = $1
		`, [pId])

		if(winnerQuery.rows.length < 0){
			callback({
				status: "ФАТАЛИСТИЧНА ГРЕШКА"
			})
		}else{
			roomsInfoMap.get(room)?.points.forEach(currentId => {
				console.log(`\n\nITERATING`)
				if(Object.keys(currentId) == winnerQuery.rows[0].p_id){
					currentId[`${Object.keys(currentId)}`]++
				}
				console.log(`\n\n`)
			})

			console.log('\n\nPOINTS: ')
			console.log(roomsInfoMap.get(room)!.points)



			io.to(room).emit('update-points', roomsInfoMap.get(room)!.points)
			
			io.to(room).emit('reveal-selected', pId, winnerQuery.rows[0].p_username)
			callback({
				status: 'ok'	
			})

		}
	})

	socket.on('next-round', (callback: Function) => {
		const room: any = userRooms.get(id)
		const players = roomUsers.get(room)!
		const blackCards = roomsInfoMap.get(room)!.blackCards


		let king = random(players)
		let currentBlack = random(blackCards)


		clearQuery(room)
		roomsInfoMap.get(room)!.king = king

		console.log(`NEXT KING: `)
		console.log(king)

		io.to(room).emit('start-game', king, false)
		io.to(room).emit('receive-card', currentBlack)

		callback({
			status: king
		})
	})

	async function leaveRoom(room: any){
		const info = true
		const message = `${username} напусна`
		const roomQuery = await pool.query('SELECT r_joined_players FROM room WHERE r_id = $1', [room])

		if(roomQuery.rows.length > 0){
			if(roomQuery.rows[0].r_joined_players.length == 1){
				pool.query('DELETE FROM room WHERE r_id = $1', [room])
			}else{
				pool.query('UPDATE room SET r_joined_players = array_remove(r_joined_players, $1) WHERE r_id = $2;', [id, room])
			}
		}

		console.log(`${username} left ${room}`)
		socket.to(room).emit('receive-message', "", info, message)
		socket.to(room).emit('update-room', false, req.user)
		socket.leave(room)
		userRooms.delete(id)
		if(roomUsers.get(room)){
			roomUsers.set(room, roomUsers.get(room)!.filter(user => user != id))
		}
		// TODO: add cards to remaining cards
	}

	function queryCard(pId: string, rId: string, card: {id: string, text: string}){
		console.log(`${pId} quering ${card.text}`)
		let last = false
		roomsInfoMap.get(rId)!.queriedCards.push({card: card, pId: pId})
		if(roomsInfoMap.get(rId)!.queriedCards.length == roomUsers.get(rId)!.length - 1){
			last = true
		}
		return last
	}

	function getQueriedCards(rId: string){
		const cards: {id: string, text: string}[] = []

		roomsInfoMap.get(rId)!.queriedCards.forEach(card => {
			cards.push(card)
		})
		return cards
	}

	function clearQuery(rId: string){
		roomsInfoMap.get(rId)!.queriedCards = []
	}
})


function random(array: any[]){
	return array[Math.floor(Math.random() * array.length)];
}


httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Le server runnning on port ${PORT}`);
});

export { io };