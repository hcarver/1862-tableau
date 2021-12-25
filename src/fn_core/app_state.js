import COMPANIES from './companies'
import CardSet from './card_set'
import Tableau from './tableau'

const COLUMN_SIZE = 6

class AppState {
  constructor({tableau, drawnCards, hand, bank_pool, charters} = {}) {
    this.tableau = new Tableau(tableau)
    this.drawnCards = drawnCards || []
    this.card_columns = []

    for (let i = 0; i < this.drawnCards.length; i += COLUMN_SIZE)
      this.card_columns.push(drawnCards.slice(i, i + COLUMN_SIZE));

    this.hand = new CardSet(hand)
    this.bank_pool = new CardSet(bank_pool)
    this.charters = new CardSet(charters)

    if(!tableau) {
      COMPANIES.forEach(company => {
        this.tableau.cards.set(company, 7)
      })
    }
  }

  to_obj() {
    return {
      tableau: this.tableau.to_obj(),
      drawnCards: this.drawnCards,
      bank: this.bank_pool.to_obj(),
      hand: this.hand.to_obj(),
      charters: this.charters.to_obj()
    }
  }

  with_updates(obj_in) {
    let {tableau, drawnCards, hand, bank_pool, charters} = {
      tableau: this.tableau,
      drawnCards: this.drawnCards,
      hand: this.hand,
      bank_pool: this.bank_pool,
      charters: this.charters,
      ...obj_in
    }

    return new AppState({tableau, drawnCards, hand, bank_pool, charters})
  }
}

export default AppState
