import express, { Router } from 'express';
import { decks, addCard, addDeck, removeCard, removeDeck, bookmarkDeck, removeBookmarkedDeck } from '../controllers/decks.controller'

const deckRouter = Router();

deckRouter.post('/add-card', addCard);
deckRouter.post('/add-deck', addDeck);
deckRouter.post('/remove-card/:id', removeCard);
deckRouter.post('/remove-deck/:id', removeDeck);
deckRouter.post('/bookmark-deck/:id', bookmarkDeck);
deckRouter.post('/remove-bookmark-deck/:id', removeBookmarkedDeck);
deckRouter.get('/', decks);

export default deckRouter;