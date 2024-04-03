import { Strategy as LocalStrategy } from 'passport-local';
import pool from '../dbConfig'
import bcrypt from 'bcryptjs'
import { PassportStatic } from 'passport'

function initialize(passport: PassportStatic){
const authenticateUser = (email: string, password: string, done: any) => {

    pool.query(
        `SELECT * FROM player WHERE p_email = $1`, [email], (err, results) => {
            if(err){
                throw err;
            }

            if(results.rows.length > 0){
                const user = results.rows[0];

                bcrypt.compare(password, user.p_pwd, (err, isMatch) => {
                    if(err){
                        throw err
                    }

                    if(isMatch){
                        console.log("Connected: ", results.rows[0].p_username);
                        return done(null, user)
                    }else{
                        return done(null, false, {message: "Неправилна парола"})
                    }
                })
            }else{
                return done(null, false, {message: "Няма такава поща"})
            }
        }
    )
}

    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, authenticateUser))

    passport.serializeUser((user: any, done) => done(null, {id: user.p_id, username: user.p_username}));

    passport.deserializeUser((obj: any, done) => {
        pool.query(
            `SELECT * FROM player WHERE p_id = $1`, [obj.id], (err, results) => {
                if(err){
                    throw err
                }

                return done(null, results.rows[0])
            }
        )
    })
}

export default initialize;