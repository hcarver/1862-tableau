import COMPANIES from './companies'

export default class Deck {
  constructor({removed_companies = [], active_companies = [], cards = []} = {}) {
    this.removed_companies = removed_companies
    this.active_companies = active_companies
    this.cards = new Map(cards)
  }

  to_obj() {
    return {
      removed_companies: this.removed_companies,
      active_companies: this.active_companies,
      cards: Array.from(this.cards.entries())
    }
  }

  current_count(company) {
    return this.cards.get(company)
  }

  total_count() {
    return Array.from(this.cards.values()).reduce((a, b) => a + b)
  }

  remove_company(company) {
    const newDeck = new Deck()
    newDeck.removed_companies = [...this.removed_companies, company]
    newDeck.cards = new Map(this.cards)
    newDeck.cards.set(company, 0)
    newDeck.active_companies = [...this.active_companies]
    return newDeck
  }

  activate_company(company) {
    const newDeck = new Deck()
    newDeck.active_companies = [...this.active_companies, company]
    newDeck.cards = new Map(this.cards)
    newDeck.removed_companies = [...this.removed_companies]
    return newDeck
  }

  deactivate_company(company) {
    const newDeck = new Deck()
    newDeck.active_companies = this.active_companies.filter(c => c !== company)
    newDeck.cards = new Map(this.cards)
    newDeck.removed_companies = [...this.removed_companies]
    return newDeck
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...COMPANIES.map((company) => Array(this.current_count(company)).fill(company))
    )

    const picked_card = this.random_member(all_cards)

    const newDeck = new Deck()
    newDeck.removed_companies = [...this.removed_companies]
    newDeck.active_companies = [...this.active_companies]
    newDeck.cards = new Map(this.cards)
    newDeck.cards.set(picked_card, this.cards.get(picked_card) - 1)

    return [newDeck, picked_card]
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

