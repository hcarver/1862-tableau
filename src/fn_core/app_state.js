import COMPANIES from './companies'
import CardSet from './card_set'
import Deck from './deck'

const COLUMN_SIZE = 6

const SELECT_TABLEAU_SIZE_PHASE = 0
const SELECT_MULLIGAN_PHASE = 1
const NORMAL_PLAY_PHASE = 2

class AppState {
  constructor({deck, drawnCards, hand, phase, bank_pool, charters} = {}) {
    this.deck = new Deck(deck)
    this.drawnCards = drawnCards || []
    this.card_columns = []
    this.phase = phase || SELECT_TABLEAU_SIZE_PHASE

    for (let i = 0; i < this.drawnCards.length; i += COLUMN_SIZE)
      this.card_columns.push(drawnCards.slice(i, i + COLUMN_SIZE));

    this.hand = new CardSet(hand)
    this.bank_pool = new CardSet(bank_pool)
    this.charters = new CardSet(charters)

    if(!deck) {
      COMPANIES.forEach(company => {
        this.deck.cards.set(company, 7)
      })
    }
  }

  to_obj() {
    return {
      deck: this.deck.to_obj(),
      drawnCards: this.drawnCards,
      bank: this.bank_pool.to_obj(),
      hand: this.hand.to_obj(),
      charters: this.charters.to_obj(),
      phase: this.phase
    }
  }

  with_updates(obj_in) {
    let {deck, drawnCards, hand, phase, bank_pool, charters} = {
      phase: this.phase,
      deck: this.deck,
      drawnCards: this.drawnCards,
      hand: this.hand,
      bank_pool: this.bank_pool,
      charters: this.charters,
      ...obj_in
    }

    return new AppState({deck, drawnCards, hand, bank_pool, phase, charters})
  }

  with_column_drawn() {
    const new_cards = []
    let last_deck = this.deck;
    for(let i = 0; i < COLUMN_SIZE; ++i) {
      const [new_deck, card] = last_deck.draw_card()
      if(card) {
        new_cards.push(card)
        last_deck = new_deck
      }
    }

    return this.with_updates({
      deck: last_deck,
      drawnCards: [...new_cards, ...this.drawnCards]
    })
  }
}

export default AppState
export { SELECT_MULLIGAN_PHASE, SELECT_TABLEAU_SIZE_PHASE, NORMAL_PLAY_PHASE }
