import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport';
import pool from '../dbConfig';
import { getUsernameById, makeid } from './std.controller'

const login = (req: Request, res: Response) => {
    res.render("login");
}

const register = (req: Request, res: Response) => {
    res.render("register");
}

const logout = (req: Request, res: Response) => {
	req.logout(function(err) {
		if(err) throw err;
		res.redirect('/')
	})
}

const profile = async (req: any, res: Response) =>{
	let admin = req.user.admin_acc;
	const profileUserFriends: any = await getFriendsByUserId(req.user.p_id)
	let friends: any[] = []
	let requests: any[] = []
	for(const friend of profileUserFriends){
		const id = Object.keys(friend).toString()
		const username = await getUsernameById(id)
		const frObj = {name: username, id: id} 
		if(Object.values(friend).toString() == 'false'){
			requests.push(frObj)
			continue
		}
		friends.push(frObj)
	}
	res.render('profile', { user: { username: admin ? "Админ " + req.user.p_username : req.user.p_username, id: req.user.p_id}, isAdmin: admin, friends, requests });
}

const profileId = async (req: any, res: Response) => {
	const id = req.params.id;
	if(id == req.user.p_id){
		res.redirect('/users/profile');
		return;
	}

	let admin = isAdmin(req)
	const profileUsername: any = await getUsernameById(id)

	if(!profileUsername){
		res.redirect('back')
	}else{
		const profileUserFriends: any = await getFriendsByUserId(id)
		let friends: any[] = []
		let areFriends = await userFriendshipStatus(req.user.p_id, id)

		for(const friend of profileUserFriends){
			if(Object.values(friend).toString() == 'false'){
				continue
			}
			let id = Object.keys(friend).toString()
			let username = await getUsernameById(id)
			friends.push({name: username, id: id})
		}

		res.render('profile', {
			profileUser: profileUsername, 
			user: admin ? "Админ " + req.user.p_username : req.user.p_username,
			isAdmin: admin,
			friends,
			areFriends,
			profileUserId: id,
			requests: []
		})
	}
}

async function userFriendshipStatus(id1: string, id2: string){
	const friendsOf1 = await getFriendsByUserId(id1)

	for(const friend of friendsOf1){
		if(Object.keys(friend).toString() == id2){
			if(Object.values(friend).toString() == 'false'){
				return 'pending'
			}else if(Object.values(friend).toString() == 'true'){
				return 'friends'
			}
		}
	}
	return 'none'
}

async function getFriendsByUserId(id: string){
	const query: any = await pool.query(`SELECT unnest(friends_list) as friend FROM friendship WHERE f_owner_id = $1`, [id])
	let friends: any[] = []

	for(const friend of query.rows){
		friends.push((
			JSON.parse(Object.values(friend).toString()
			.replace(/\(/g, '{"')
			.replace(/\)/g, '}')
			.replace(/,/g, '":')
			.replace(/t\}/, 'true}')
			.replace(/f\}/, 'false}'))))
	}
	return friends;
}

const sendFriendRequest = async (req: any, res: Response) => {
	let id = req.params.id
	let senderId = req.user.p_id

	if(await userFriendshipStatus(senderId, id) == 'friends'){
		res.redirect('back')
		return
	}
	await pool.query(`
		UPDATE friendship
		SET friends_list = friends_list || ARRAY[ROW($1, false)::friend]
		WHERE f_owner_id = $2
	`,[id, senderId])

	await pool.query(`
		UPDATE friendship
		SET friends_list = friends_list || ARRAY[ROW($1, false)::friend]
		WHERE f_owner_id = $2
	`,[senderId, id])

	res.redirect('back')
}

const acceptFriendRequest = async (req: any, res:Response) => {
	const id = req.params.id
	let senderId = req.user.p_id

	if(await userFriendshipStatus(senderId, id) == 'friends'){
		res.redirect('back')
		return
	}
	
	pool.query(`
		UPDATE friendship
		SET friends_list = ARRAY_REPLACE(friends_list, $1, $2)
		WHERE f_owner_id = $3
	`,[`(${id}, f)`, `(${id}, t)`, senderId])
	

	pool.query(`
		UPDATE friendship
		SET friends_list = ARRAY_REPLACE(friends_list, $1, $2)
		WHERE f_owner_id = $3
	`,[`(${senderId}, f)`, `(${senderId}, t)`, id])
	res.redirect('back')
}

const removeFriend = (req: any, res: Response) => {

}

const admin = (req: any, res: Response) =>{
	let admin = isAdmin(req)
	if(admin){
		res.render('admin', { user: admin ? "Админ " + req.user.p_username : req.user.p_username, isAdmin: admin });
	}else{
		res.redirect('lobby');
	}
}

const postlogin = passport.authenticate('local', {
	successRedirect: "/lobby",
    failureRedirect: "/users/login",
    failureFlash: true
})

const postregister = async (req: Request, res: Response) => {
	let {name, email, password , password2 } = req.body;
	name = name.trim()
	email = email.trim()
	let errors: { message: string }[] = [];

	if(!name || !email || !password || !password2){
		errors.push({message: "Попълни всички полета"})
	}

	if(password != password2){
		errors.push({message: "Паролите не съвпадат"})
	}

	if(errors.length > 0){
		res.render('register', {errors})
	}else{
		let hashedPassword = await bcrypt.hash(password, 10);
		let id = makeid(6)
		const emailQuery: any = await pool.query(
			`SELECT * FROM player
			WHERE p_email = $1`, [email])
			
		const usernameQuery: any = await pool.query(
				`SELECT * FROM player
				WHERE p_username = $1`, [name])
		

			if(emailQuery.rows.length > 0){
				errors.push({message: "Пощата вече е регистрирата"})
				res.render('register', { errors })
			} else if(usernameQuery.rows.length > 0){
				errors.push({message: "Потребителското име вече е заето"})
				res.render('register', {errors})
			}else if(name.length > 30 || email.length > 50 || name.length == 0 || email.length == 0){
					errors.push({message: "Невалидни данни"})
					res.render('register', {errors})
			}else{
					pool.query(
						`INSERT INTO player (p_id, p_username, p_email, p_pwd)
						VALUES ($1, $2, $3, $4)
						RETURNING p_id, p_pwd`, [id, name, email, hashedPassword])
	
					pool.query(
						`INSERT INTO friendship(f_owner_id)
						VALUES ($1)`,[id]
					)
				req.flash('success_msg', "Успешна регистрация");
				res.redirect('/users/login')
				}
	}
}

function isAdmin(req: any){
	return req.user.admin_acc; 
}

export {login, register, logout, profile, profileId, postlogin, postregister, admin, sendFriendRequest, acceptFriendRequest};