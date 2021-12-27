import React from 'react'

import Card from './Card'
import { toCharterButton, toHandButton } from './buttons'

const Tableau = ({appState, pushNewState, mayManipulate = true, columnActions=[]}) => {
  const drawColumnButton = () => {
    pushNewState(appState.with_column_drawn())
  }

  const columns = appState.card_columns.map((column, column_index) => {
    return <div className="card">
      <ul className="list-group list-group-flush">
        {column.map((c,i) => {
          const lastInColumn = i === column.length - 1
          const extraClass = lastInColumn && "list-group-item-primary"

          return <li className={`list-group-item p-1 ${extraClass}`}>
            {c}
            {
              mayManipulate && toHandButton(e => {
                const new_hand = appState.hand.with_added_card(c)
                const new_card_columns = [...appState.card_columns]
                new_card_columns[column_index] = new_card_columns[column_index].filter((x, filterIndex) => filterIndex !== i)

                pushNewState(
                  appState.with_updates({
                    card_columns: new_card_columns,
                    hand: new_hand})
                )
              })
            }
            {
              mayManipulate && toCharterButton(e => {
                const new_card_columns = [...appState.card_columns]
                new_card_columns[column_index] = new_card_columns[column_index].filter((x, filterIndex) => filterIndex !== i)
                pushNewState(
                  appState.with_updates({
                    card_columns: new_card_columns,
                    charters: appState.charters.with_added_card(c)
                  })
                )
              })
            }
          </li>
        })}
        {
          columnActions.map(ca => ca(column_index))
        }
      </ul>
    </div>
  })


  return <Card title="Draw cards">
    <div className="card-text">
      { mayManipulate && <p className="form-inline justify-content-center">
        <button className="btn btn-primary" onClick={drawColumnButton}>Draw column</button>
      </p>
      }
      <p>
        Cards you've drawn
      </p>
      <div className="card-columns" style={{columnCount: 4}}>
        {columns}
      </div>
    </div>
  </Card>
}

export default Tableau
