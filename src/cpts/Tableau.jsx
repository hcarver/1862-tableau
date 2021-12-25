import React from 'react'

import Card from './Card'
import { toCharterButton, toHandButton } from './buttons'

const Tableau = ({appState, pushNewState}) => {
  const inputRef = React.useRef()

  const drawCardButton = () => {
    const count = parseInt(inputRef.current.value) || 1

    const new_cards = []
    let last_tableau = appState.tableau;
    for(let i = 0; i < count; ++i) {
      const [new_tableau, card] = last_tableau.draw_card()
      if(card) {
        new_cards.push(card)
        last_tableau = new_tableau
      }
    }

    const newAppState = appState.with_updates({
      tableau: last_tableau,
      drawnCards: [...new_cards, ...appState.drawnCards]
    })

    pushNewState(newAppState)

    inputRef.current.value = 1
  }

  const company_list = (companies) => <ul className="list-unstyled">
    {companies.map((c,i) => <li>
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
      </li>)}
    </ul>

  return <Card title="Draw cards">
    <div className="card-text">
      <p className="form-inline justify-content-center">
        <input className="form-control" type="number" min="1" ref={inputRef} placeholder="How many to draw"/>
        <button className="btn btn-primary" onClick={drawCardButton}>Draw card</button>
      </p>
      <p>
        Cards you've drawn (most recent first)
      </p>
      {company_list(appState.drawnCards)}
    </div>
  </Card>
}

export default Tableau
