import COMPANIES from './companies'
import CardSet from './card_set'
import Deck from './deck'

const COLUMN_SIZE = 6

const SELECT_TABLEAU_SIZE_PHASE = 0
const SELECT_MULLIGAN_PHASE = 1
const NORMAL_PLAY_PHASE = 2

class AppState {
  constructor({deck, card_columns, hand, phase, bank_pool, charters} = {}) {
    this.deck = new Deck(deck)
    this.card_columns = card_columns || []
    this.phase = phase || SELECT_TABLEAU_SIZE_PHASE

    this.hand = new CardSet(hand)
    this.bank_pool = new CardSet(bank_pool)
    this.charters = new CardSet(charters)
  }

  to_obj() {
    return {
      deck: this.deck.to_obj(),
      card_columns: this.card_columns,
      bank: this.bank_pool.to_obj(),
      hand: this.hand.to_obj(),
      charters: this.charters.to_obj(),
      phase: this.phase
    }
  }

  with_updates(obj_in) {
    let {deck, card_columns, hand, phase, bank_pool, charters} = {
      phase: this.phase,
      deck: this.deck,
      card_columns: this.card_columns,
      hand: this.hand,
      bank_pool: this.bank_pool,
      charters: this.charters,
      ...obj_in
    }

    card_columns = card_columns.filter(x => x.length > 0)

    return new AppState({deck, card_columns, hand, bank_pool, phase, charters})
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
      card_columns: [...this.card_columns, new_cards]
    })
  }
}

export default AppState
export { SELECT_MULLIGAN_PHASE, SELECT_TABLEAU_SIZE_PHASE, NORMAL_PLAY_PHASE }
