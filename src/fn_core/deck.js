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

  unremoved_overflow_pile() {
    return this.overflow_pile.filter(x => !this.removed_companies.includes(x))
  }

  current_count(company) {
    if(this.removed_companies.includes(company)) {
      return 0
    }
    return this.cards.get(company) + this.overflow_pile.filter(x => x === company).length
  }

  total_count() {
    const company_counts = COMPANIES.map(c => this.current_count(c))
    return company_counts.reduce((a, b) => a + b)
  }

  remove_company(company) {
    return this.with_updates({
      removed_companies: [...this.removed_companies, company]
    })
  }

  activate_company(company) {
    return this.with_updates({
      active_companies: [...this.active_companies, company],
    })
  }

  deactivate_company(company) {
    return this.with_updates({
      active_companies: this.active_companies.filter(c => c !== company),
    })
  }

  unremoved_companies() {
    return COMPANIES.filter(x => !this.removed_companies.includes(x))
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...this.unremoved_companies().map((company) => Array(this.cards.get(company)).fill(company))
    )

    // Random deck card first
    if(all_cards.length > 0) {
      const picked_card = this.random_member(all_cards)

      const newMap = new Map(this.cards)
      newMap.set(picked_card, this.cards.get(picked_card) - 1)

      const newDeck = this.with_updates({
        cards: newMap
      })

      return [newDeck, picked_card]
    }

    // Card from the overflow pile second
    // NOTE this removes unplayed cards from the overflow pile if their company has been removed from the game.
    // Most other actions leave those cards in place.
    const [first, ...rest] = this.unremoved_overflow_pile()

    const newDeck = this.with_updates({
      overflow_pile: rest
    })

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

  without_removed_companies() {
    return this.with_updates({
      removed_companies: []
    })
  }

  with_overflow_pile(pile) {
    return this.with_updates({
      overflow_pile: pile
    })
  }

  with_updates(obj_in) {
    let {removed_companies, active_companies, cards, overflow_pile} = {
      removed_companies: this.removed_companies,
      active_companies: this.active_companies,
      cards: this.cards,
      overflow_pile: this.overflow_pile,
      ...obj_in
    }

    return new Deck({removed_companies, active_companies, cards, overflow_pile})
  }
}

