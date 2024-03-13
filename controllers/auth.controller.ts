import { Request, Response, NextFunction } from "express";

function checkAuthenticated(req: Request, res: Response, next: NextFunction){
	if(req.isAuthenticated()){
		return res.redirect('/lobby')
	}
	next();
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash('success_msg', "Трябва да влезеш първо");
	res.redirect('/users/login')
}

export {checkNotAuthenticated, checkAuthenticated};