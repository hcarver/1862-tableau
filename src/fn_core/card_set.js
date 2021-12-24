class CardSet {
  constructor({cards} = {}) {
    this.cards = new Map(cards || [])
  }

  to_obj() {
    return {
      cards: Array.from(this.cards.entries())
    }
  }

  company_list() {
    let companies = Array.from(this.cards.keys())
    companies = companies.filter((v, i, a) => a.indexOf(v) === i)
    return companies.sort()
  }

  company_count(company) {
    return this.cards.get(company) || 0
  }

  with_added_card(company) {
    const toRet = new CardSet()
    toRet.cards = new Map();

    for(const [k,v] of this.cards) {
      toRet.cards.set(k, v)
    }
    toRet.cards.set(company, (toRet.cards.get(company) || 0) + 1)
    return toRet
  }

  without_card(company) {
    const toRet = new CardSet()

    for(const [k,v] of this.cards) {
      toRet.cards.set(k, v)
    }
    toRet.cards.set(company, (toRet.cards.get(company) - 1))

    if(toRet.cards.get(company) === 0) {
      toRet.cards.delete(company)
    }

    return toRet
  }
}

export default CardSet
