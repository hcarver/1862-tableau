import COMPANIES from './companies'

export default class Deck {
  // The overflow may be set by a Mulligan taken at the start of the game.
  constructor({removed_companies = [], active_companies = [], cards, overflow_pile = []} = {}) {
    this.removed_companies = removed_companies
    this.active_companies = active_companies
    this.cards = new Map(cards || [])
    this.overflow_pile = overflow_pile

    if(!cards) {
      COMPANIES.forEach(company => {
        this.cards.set(company, 7)
      })
    }
  }

  to_obj() {
    return {
      removed_companies: this.removed_companies,
      active_companies: this.active_companies,
      cards: Array.from(this.cards.entries()),
      overflow_pile: this.overflow_pile
    }
  }

  current_count(company) {
    return this.cards.get(company) + this.overflow_pile.filter(x => x === company).length
  }

  total_count() {
    return Array.from(this.cards.values()).reduce((a, b) => a + b, 0) + this.overflow_pile.length
  }

  remove_company(company) {
    const newDeck = new Deck()
    newDeck.removed_companies = [...this.removed_companies, company]
    newDeck.cards = new Map(this.cards)
    newDeck.cards.set(company, 0)
    newDeck.active_companies = [...this.active_companies]
    newDeck.overflow_pile = this.overflow_pile.filter(x => x !== company)
    return newDeck
  }

  activate_company(company) {
    const newDeck = new Deck()
    newDeck.active_companies = [...this.active_companies, company]
    newDeck.cards = new Map(this.cards)
    newDeck.removed_companies = [...this.removed_companies]
    newDeck.overflow_pile = [...this.overflow_pile]
    return newDeck
  }

  deactivate_company(company) {
    const newDeck = new Deck()
    newDeck.active_companies = this.active_companies.filter(c => c !== company)
    newDeck.cards = new Map(this.cards)
    newDeck.removed_companies = [...this.removed_companies]
    newDeck.overflow_pile = [...this.overflow_pile]
    return newDeck
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...COMPANIES.map((company) => Array(this.cards.get(company)).fill(company))
    )

    // Random deck card first
    if(all_cards.length > 0) {
      const picked_card = this.random_member(all_cards)

      const newDeck = new Deck()
      newDeck.removed_companies = [...this.removed_companies]
      newDeck.active_companies = [...this.active_companies]
      newDeck.cards = new Map(this.cards)
      newDeck.cards.set(picked_card, this.cards.get(picked_card) - 1)
      newDeck.overflow_pile = [...this.overflow_pile]

      return [newDeck, picked_card]
    }

    // Card from the overflow pile second
    const [first, ...rest] = this.overflow_pile
    const newDeck = new Deck()
    newDeck.removed_companies = [...this.removed_companies]
    newDeck.active_companies = [...this.active_companies]
    newDeck.cards = new Map(this.cards)
    newDeck.overflow_pile = rest

    return [newDeck, first]
  }

  remove_random_company() {
    const remaining_companies = COMPANIES.filter(c => !this.removed_companies.includes(c) && !this.active_companies.includes(c))

    if(remaining_companies.length === 0) {
      return this;
    }

    const removed = this.random_member(remaining_companies)

    return this.remove_company(removed)
  }

  random_member(list) {
    return list[Math.floor(Math.random() * list.length)]
  }
}

