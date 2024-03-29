import React from 'react'

import Card from './Card'
import Company from './Company'
import COMPANIES from '../fn_core/companies'
import { toCharterButton, toHandButton } from './buttons'

const Tableau = ({appState, pushNewState, mayManipulate = true, columnActions=[]}) => {
  const drawColumnButton = () => {
    pushNewState(appState.with_column_drawn())
  }

  const columns = appState.card_columns.map((column, column_index) => {
    const onDragOver = (ev) => {
      ev.preventDefault()
    }

    const onDrop = (ev) => {
      const { company, source_column, index_in_column } = JSON.parse(ev.dataTransfer.getData("text/plain") || {})
      if (source_column !== column_index &&
        company === column[column.length - 1])
      {
        const new_columns = [...appState.card_columns]
        new_columns[source_column] = new_columns[source_column].slice(0, index_in_column)
        new_columns[column_index] = [...new_columns[column_index], company]

        pushNewState(appState.with_updates({ card_columns: new_columns }).filter_tableau())
      }
    }

    return <div className="card" onDragOver={onDragOver} onDrop={onDrop}>
      <ul className="list-group list-group-flush">
        {column.map((c,i) => {
          const lastInColumn = i === column.length - 1
          const extraClass = lastInColumn && "list-group-item-primary"
          const onDragStart = (ev) => {
            ev.dataTransfer.dropEffect = "move"
            ev.dataTransfer.setData("text/plain", JSON.stringify({
              company: c,
              source_column: column_index,
              index_in_column: i
            }));
          }

          return <li className={`list-group-item p-1 ${extraClass}`} draggable={lastInColumn} onDragStart={onDragStart} >
            <Company company={c} />
            {
              mayManipulate && lastInColumn && toHandButton(e => {
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
              mayManipulate && lastInColumn && toCharterButton(e => {
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

  const rows = []
  for(let i = 0; 4*i < columns.length; i++) {
    rows.push(
      <div className="row">
        <div className="col-3 py-2">{columns[4*i]}</div>
        <div className="col-3 py-2">{columns[4*i+1]}</div>
        <div className="col-3 py-2">{columns[4*i+2]}</div>
        <div className="col-3 py-2">{columns[4*i+3]}</div>
      </div>
    )
  }

  const card_counts = {}
  for(const column of appState.card_columns) {
    for(const company of column) {
      card_counts[company] = 1 + (card_counts[company] || 0)
    }
  }

  const summary = []
  for(const company of COMPANIES) {
    if(!card_counts[company])
      continue

    summary.push(
      <span className="d-inline-block px-1">
        <Company company={company} />
        x
        {card_counts[company]}
      </span>
    )
  }

  return <Card title="Tableau">
    <div className="card-text">
      { mayManipulate && <p className="form-inline justify-content-center">
        <button className="btn btn-primary" onClick={drawColumnButton}>Draw column</button>
      </p>
      }
      <h5 className="card-title">
        Cards you've drawn
      </h5>
      {rows}
      <h5 className="card-title">
        Summary
      </h5>
      <p>{summary}</p>
    </div>
  </Card>
}

export default Tableau
