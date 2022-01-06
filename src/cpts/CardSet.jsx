import React from 'react'

import Company from './Company'

const CardSet = ({card_set, actions_per_card = []}) => {
  const companies = card_set.company_list()

  const counts = companies.map(company => {
    const actions = actions_per_card.map(action =>
      action(company)
    )

    return <div>
      <Company company={company} />
      {" x "}
      {card_set.company_count(company)}
      {actions}
    </div>
  })

  return <div>
    {counts}
  </div>
}

export default CardSet
