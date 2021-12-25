import React from 'react'

import Card from './Card'
import { toCharterButton, toHandButton } from './buttons'

const Tableau = ({appState, pushNewState}) => {
  const drawColumnButton = () => {
    const count = 6

    const new_cards = []
    let last_deck = appState.deck;
    for(let i = 0; i < count; ++i) {
      const [new_deck, card] = last_deck.draw_card()
      if(card) {
        new_cards.push(card)
        last_deck = new_deck
      }
    }

    const newAppState = appState.with_updates({
      deck: last_deck,
      drawnCards: [...new_cards, ...appState.drawnCards]
    })

    pushNewState(newAppState)
  }

  const columns = appState.card_columns.map(column => {
    return <div className="card">
      <ul className="list-group list-group-flush">
        {column.map((c,i) => {
          const lastInColumn = i === column.length - 1
          const extraClass = lastInColumn && "list-group-item-primary"

          return <li className={`list-group-item p-1 ${extraClass}`}>
            {c}
            {
              toHandButton(e => {
                const new_hand = appState.hand.with_added_card(c)
                const new_cards = appState.drawnCards.filter((x,filterIndex) => filterIndex !== i)

                pushNewState(
                  appState.with_updates({drawnCards: new_cards,
                    hand: new_hand})
                )
              })
            }
            {
              toCharterButton(e => {
                pushNewState(
                  appState.with_updates({
                    drawnCards: appState.drawnCards.filter((x,filterIndex) => filterIndex !== i),
                    charters: appState.charters.with_added_card(c)
                  })
                )
              })
            }
          </li>
        })}
      </ul>
    </div>
  })


  return <Card title="Draw cards">
    <div className="card-text">
      <p className="form-inline justify-content-center">
        <button className="btn btn-primary" onClick={drawColumnButton}>Draw column</button>
      </p>
      <p>
        Cards you've drawn (most recent first)
      </p>
      <div className="card-columns" style={{columnCount: 4}}>
        {columns}
      </div>
    </div>
  </Card>
}

export default Tableau
