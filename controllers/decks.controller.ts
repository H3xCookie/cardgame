import { Response } from 'express'
import { makeid } from './std.controller'
import pool from '../dbConfig';

const decks = async (req: any, res: Response) => {
    const cards = await getCardTextsByUserId(req.user.p_id)
    const decks = await getDecksByUserId(req.user.p_id)
    const bookmarkedDecks = await getBookmarkedDecksByUserId(req.user.p_id)
	res.render("decks", { user: {username: req.user.admin_acc ? "Админ " + req.user.p_username : req.user.p_username, id: req.user.p_id}, isAdmin: req.user.admin_acc, cards, decks, bookmarkedDecks});
}

const addCard = async (req: any, res: Response) => {
    let id = makeid(6)
    let {black, text} = req.body;

    text = text.trim()

    if(text.length > 100){
        req.flash("error", "#速度与激情9#早上好中国    现在我有冰激淋 我很喜欢冰激淋但是《速度与激情9》比冰激淋……🍦")
    }else if(black == undefined){
        await pool.query(`INSERT INTO card (c_id, c_owner_id, c_black, c_text) VALUES ($1, $2, $3, $4)`, [id, req.user.p_id, false, text])
    }else{
        await pool.query(`INSERT INTO card (c_id, c_owner_id, c_black, c_text) VALUES ($1, $2, $3, $4)`, [id, req.user.p_id, black, text])
    }
    res.redirect('back')
}

const addDeck = async (req: any, res: Response) => {
    let {name, checkbox} = req.body;
    
    name = name.trim()

    if(typeof checkbox == 'undefined'){
        req.flash("error","Не можеш да направиш празно тесте")
        res.redirect('back')
        return;
    }else if(name.length > 30){
        req.flash("error", "Името на тестето трябва да е под 30 символа")
        res.redirect("back")
        return
    }
    let id = makeid(6)

    if(typeof checkbox == 'string')
        checkbox = [checkbox]

    await pool.query('INSERT INTO deck (d_id, d_name, d_cards_id, d_owner_id) VALUES ($1, $2, $3, $4)', [id, name, checkbox, req.user.p_id])

    res.redirect('back')
}

const removeCard = async (req: any, res: Response) => {
    let id = req.params.id;
    pool.query(`DELETE FROM card WHERE c_id = $1`, [id])


    pool.query(`
    DO $do$
    BEGIN
    IF EXISTS(SELECT 1 FROM deck WHERE '${id}' = ANY(d_cards_id)) THEN
        UPDATE deck
        SET d_cards_id = ARRAY_REMOVE(d_cards_id, '${id}')
        WHERE '${id}' = ANY(d_cards_id);
    END IF;

    DELETE FROM deck
    WHERE array_length(d_cards_id, 1) IS NULL OR array_length(d_cards_id, 1) = 0;
    END $do$;`)

    res.redirect('back')
}

const removeDeck = async (req: any, res: Response) => {
    let id = req.params.id;
    pool.query(`DELETE FROM deck WHERE d_id = $1`, [id])

    res.redirect('back')
}

const bookmarkDeck = (req: any, res: Response) => {
    const dId = req.params.id;
    const pId = req.user.p_id;

    pool.query(`
        UPDATE player
        SET p_bookmarked_decks_id = p_bookmarked_decks_id || ARRAY[$1]
        WHERE p_id = $2
    `, [dId, pId])

    pool.query(`
        UPDATE deck
        SET d_bookmarked_player = d_bookmarked_player || ARRAY[$1]
        WHERE d_id = $2
    `, [pId, dId])

    res.redirect('back')
}

const removeBookmarkedDeck = async (req: any, res: Response) => {
    const dId = req.params.id;
    const pId = req.user.p_id;

    pool.query(`
        UPDATE player
        SET p_bookmarked_decks_id = array_remove(p_bookmarked_decks_id, $1) 
        WHERE p_id = $2
    `, [dId, pId])
    
    pool.query(`
        UPDATE deck
        SET d_bookmarked_player = array_remove(d_bookmarked_player, $1) 
        WHERE d_id = $2
    `, [pId, dId])

    res.redirect('back')
}

async function getCardTextsByUserId(id: number) {
    const query = await pool.query(`SELECT * FROM card WHERE c_owner_id = $1`, [id])
	let cards: { id:string, text: string, black: boolean }[] = []
    for(const card of query.rows){
        cards.push({id:card.c_id, text: card.c_text, black: card.c_black})
    }

    return cards;
}

async function getDecksByUserId(id: number) {
    const query = await pool.query(`SELECT * FROM deck WHERE d_owner_id = $1`, [id])
	let decks: { id:string, name: string, cards: string[], bookmarked: any[], owner: any[]}[] = []
    for(const deck of query.rows){
        decks.push({id:deck.d_id, name: deck.d_name, cards: deck.d_cards_id, bookmarked: deck.d_bookmarked_player, owner: deck.d_owner_id})
    }

    return decks;
}

async function getBookmarkedDecksByUserId(id: number){
    const query = await pool.query(`SELECT * FROM deck WHERE d_bookmarked_player @> ARRAY[$1]::varchar[]`, [id])
    let decks: { id:string, name: string, cards: string[]}[] = []
    for(const deck of query.rows){
        decks.push({id:deck.d_id, name: deck.d_name, cards: deck.d_cards_id})
    }

    return decks;
}

export {decks, addDeck, addCard, removeCard, removeDeck, getDecksByUserId, getBookmarkedDecksByUserId, bookmarkDeck, removeBookmarkedDeck};