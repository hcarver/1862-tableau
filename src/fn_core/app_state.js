import COMPANIES from './companies'
import CardSet from './card_set'
import Deck from './deck'

const COLUMN_SIZE = 6

class AppState {
  constructor({deck, drawnCards, hand, bank_pool, charters} = {}) {
    this.deck = new Deck(deck)
    this.drawnCards = drawnCards || []
    this.card_columns = []

    for (let i = 0; i < this.drawnCards.length; i += 6)
      this.card_columns.push(drawnCards.slice(i, i + 6));

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
      charters: this.charters.to_obj()
    }
  }

  with_updates(obj_in) {
    let {deck, drawnCards, hand, bank_pool, charters} = {
      deck: this.deck,
      drawnCards: this.drawnCards,
      hand: this.hand,
      bank_pool: this.bank_pool,
      charters: this.charters,
      ...obj_in
    }

    return new AppState({deck, drawnCards, hand, bank_pool, charters})
  }
}

export default AppState
