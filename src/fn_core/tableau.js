import COMPANIES from './companies'

export default class Tableau {
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
    const newTableau = new Tableau()
    newTableau.removed_companies = [...this.removed_companies, company]
    newTableau.cards = new Map(this.cards)
    newTableau.cards.set(company, 0)
    newTableau.active_companies = [...this.active_companies]
    return newTableau
  }

  activate_company(company) {
    const newTableau = new Tableau()
    newTableau.active_companies = [...this.active_companies, company]
    newTableau.cards = new Map(this.cards)
    newTableau.removed_companies = [...this.removed_companies]
    return newTableau
  }

  deactivate_company(company) {
    const newTableau = new Tableau()
    newTableau.active_companies = this.active_companies.filter(c => c !== company)
    newTableau.cards = new Map(this.cards)
    newTableau.removed_companies = [...this.removed_companies]
    return newTableau
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...COMPANIES.map((company) => Array(this.current_count(company)).fill(company))
    )

    const picked_card = this.random_member(all_cards)

    const new_tableau = new Tableau()
    new_tableau.removed_companies = [...this.removed_companies]
    new_tableau.active_companies = [...this.active_companies]
    new_tableau.cards = new Map(this.cards)
    new_tableau.cards.set(picked_card, this.cards.get(picked_card) - 1)

    return [new_tableau, picked_card]
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

