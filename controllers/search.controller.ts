import {Response} from 'express'
import pool from '../dbConfig'

const search = (req: any, res: Response) => {
    let admin = req.user.admin_acc


    res.render("search", {user: {username: admin ? "Админ " + req.user.p_username : req.user.p_username, id: req.user_p_id}, isAdmin: admin})
}

const postSearch = async (req: any, res: Response) => {
    let {type, text} = req.body
    
    if(type == 'user'){
    const results = await searchUserByUsername(text);
            if(results.length > 0){
                req.flash('users', results)
                res.redirect('back')
                return;
            }else{
                req.flash('failure')
                res.redirect('back')
                return;
            }
    }else if(type == 'deck'){

    const results = await searchDeckByName(text);
    const nonOwned: any[] = []

    if(results.length > 0) {
        results.forEach((deck: any) => {
            console.log(`REQ USER PID = ${req.user.p_id}`)
            console.log(`deck owner iD = ${deck.owner}`)

            console.log(`req == deck? ${req.user.p_id == deck.owner}`)

            if(deck.owner != req.user.p_id){
                if(deck.bookmarked != null && deck.bookmarked.includes(req.user.p_id)){
                    deck.bookmarked = true;
                }else{
                    deck.bookmarked = false;
                }

                nonOwned.push(deck)
            }
       })


            req.flash('decks', nonOwned)
            res.redirect('back')
            return;
        }else{
            req.flash('failure')
            res.redirect('back')
            return;
        }
    }
}

const searchUserByUsername = async (name: string) => {
    let results: any = []
    const query = await pool.query(`
    SELECT * FROM player
     WHERE p_username LIKE $1`,
      [`%${name}%`])

    if(query.rows.length > 0){
        for(let result of query.rows){
            results.push({username: result.p_username, id: result.p_id})
        }
    }

    return results;
}

const searchDeckByName = async(name: string) => {
    let results: any = []


    const query = await pool.query(`
    SELECT * FROM deck
     WHERE d_name LIKE $1`,
      [`%${name}%`])


    if(query.rows.length > 0){
        for(let result of query.rows){
        console.log('\n\nRESULT\n\n')
            console.log(result)
            results.push({name: result.d_name, id: result.d_id, bookmarked: result.d_bookmarked_player, owner: result.d_owner_id})
        }
    }

    return results;
}
export {search, postSearch}