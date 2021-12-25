import React from 'react'

import Card from './Card'
import CardSet from './CardSet'
import { toBankButton } from './buttons'

const Hand = ({appState, pushNewState}) => {
  return <Card title="Hand">
    <CardSet card_set={appState.hand} actions_per_card={
      [company =>
        toBankButton(e => {
          pushNewState(appState.with_updates({
            hand: appState.hand.without_card(company),
            bank_pool: appState.bank_pool.with_added_card(company)
          }))
        })
      ]
    }/>
  </Card>
}

export default Hand
