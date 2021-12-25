import React from 'react'

import Card from './Card'
import CardSet from './CardSet'
import { toBankButton, toHandButton } from './buttons'

const Charters = ({appState, pushNewState}) => {
  return <Card title="On charters">
    <CardSet card_set={appState.charters} actions_per_card={
      [
        company => toHandButton(e => {
          pushNewState(appState.with_updates({
            charters: appState.charters.without_card(company),
            hand: appState.hand.with_added_card(company)
          }))
        }),
        company => toBankButton(e => {
          pushNewState(appState.with_updates({
            charters: appState.charters.without_card(company),
            bank_pool: appState.bank_pool.with_added_card(company)
          }))
        })
      ]
    }/>
  </Card>
}

export default Charters
