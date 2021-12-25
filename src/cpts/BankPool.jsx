import React from 'react'

import Card from './Card'
import CardSet from './CardSet'
import { toCharterButton, toHandButton } from './buttons'

const BankPool = ({appState, pushNewState}) => {
  return <Card title="Bank pool">
    <CardSet card_set={appState.bank_pool} actions_per_card={
      [
        company => toHandButton(e => {
          pushNewState(appState.with_updates({
            bank_pool: appState.bank_pool.without_card(company),
            hand: appState.hand.with_added_card(company)
          }))
        }),
        company => toCharterButton(e => {
          pushNewState(appState.with_updates({
            bank_pool: appState.bank_pool.without_card(company),
            charters: appState.charters.with_added_card(company)
          }))
        })
      ]
    }/>
  </Card>
}

export default BankPool
