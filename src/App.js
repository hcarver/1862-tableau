import './App.css';
import React from 'react';

import COMPANIES from './fn_core/companies'
import AppState from './fn_core/app_state'


const DisplayCardSet = ({card_set, actions_per_card = []}) => {
  const companies = card_set.company_list()

  const counts = companies.map(x => {
    const actions = actions_per_card.map(action =>
      action(x)
    )

    return <div>
      {x}
      {" x "}
      {card_set.company_count(x)}
      {actions}
    </div>
  })
  return <div>
    {counts}
  </div>
}

const DeckDisplay = ({tableau}) => {
  return <div className="card">
    <div className="card-body">
      <h5 className="card-title">Deck state</h5>
      <div className="card-text">
        <p>
          {`Cards in deck:
                  ${tableau.total_count()}`}
        </p>
        <p>
          Card counts:
          {" "}
          {COMPANIES.map(company => `${company}: ${tableau.current_count(company)}`).join(", ")}
        </p>
      </div>
    </div>
  </div>
}

const Card = ({title, children}) => {
  return <div className="card">
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      {children}
    </div>
  </div>
}

const history_version = 0

function App() {
  const storedHistory = JSON.parse(localStorage.getItem('history-v' + history_version) || '[]')
  const parsedHistory = storedHistory.map(item => new AppState(item))

  const [history, setHistory] = React.useState(parsedHistory);

  React.useEffect( () => {
    localStorage.setItem('history-v' + history_version, JSON.stringify(history.map(item => item.to_obj())))
  }, [history])


  const appState = history.length > 0 ? history[history.length - 1] : new AppState()
  const setAppState = newState => setHistory([...history, newState])

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

    setAppState(newAppState)

    inputRef.current.value = 1
  }

  const tableau = appState.tableau;

  const reset = () => {if(window.confirm("Are you sure you want to reset?")) {setHistory([])}}
  const undo = () => {setHistory(history.slice(0, history.length - 1))}

  const toBankButton = callback => <button
    className="btn btn-link py-0"
    aria-label="Move to bank pool"
    onClick={ callback } >
    🏦 To bank pool
  </button>

  const toHandButton = callback => <button
    className="btn btn-link py-0"
    aria-label="Move to hand"
    onClick={ callback } >
    ✋
    To hand
  </button>

  const toCharterButton = callback => <button
    className="btn btn-link py-0"
    aria-label="Move to charter"
    onClick={ callback } >
    📜
    To charter
  </button>

  const company_list = (companies) => <ul className="list-unstyled">
    {companies.map((c,i) => <li>
      {c}
      {
        toHandButton(e => {
          const new_hand = appState.hand.with_added_card(c)
          const new_cards = appState.drawnCards.filter((x,filterIndex) => filterIndex !== i)

          setAppState(
            appState.with_updates({drawnCards: new_cards,
              hand: new_hand})
          )
        })
      }
      {
        toCharterButton(e => {
          setAppState(
            appState.with_updates({
              drawnCards: appState.drawnCards.filter((x,filterIndex) => filterIndex !== i),
              charters: appState.charters.with_added_card(c)
            })
          )
        })
      }
      </li>)}
  </ul>


  return (
    <div className="App">
      <header className="App-header">
        <p>
          1862 tableau builder
        </p>
        <small>
          Play 1862 solo without all the damned shuffling.
        </small>
      </header>
      <div className="row no-gutters">
        <div className="col-6">
          <button className="btn btn-block btn-secondary rounded-0" onClick={undo}>UNDO</button>
        </div>
        <div className="col-6">
          <button className="btn btn-block btn-warning rounded-0" onClick={reset}>RESET</button>
        </div>
      </div>
      <div className="card-columns">
        <DeckDisplay tableau={tableau} />
        <Card title="Draw cards">
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
        <Card title="Hand">
          <DisplayCardSet card_set={appState.hand} actions_per_card={
            [company =>
              toBankButton(e => {
                setAppState(appState.with_updates({
                  hand: appState.hand.without_card(company),
                  bank_pool: appState.bank_pool.with_added_card(company)
                }))
              })
            ]
          }/>
        </Card>
        <Card title="Bank pool">
          <DisplayCardSet card_set={appState.bank_pool} actions_per_card={
            [
              company => toHandButton(e => {
                setAppState(appState.with_updates({
                  bank_pool: appState.bank_pool.without_card(company),
                  hand: appState.hand.with_added_card(company)
                }))
              }),
              company => toCharterButton(e => {
                setAppState(appState.with_updates({
                  bank_pool: appState.bank_pool.without_card(company),
                  charters: appState.charters.with_added_card(company)
                }))
              })
            ]
          }/>
        </Card>
        <Card title="On charters">
          <DisplayCardSet card_set={appState.charters} actions_per_card={
            [
              company => toHandButton(e => {
                setAppState(appState.with_updates({
                  charters: appState.charters.without_card(company),
                  hand: appState.hand.with_added_card(company)
                }))
              }),
              company => toBankButton(e => {
                setAppState(appState.with_updates({
                  charters: appState.charters.without_card(company),
                  bank_pool: appState.bank_pool.with_added_card(company)
                }))
              })
            ]
          }/>
        </Card>
        <Card title="Companies">
          <div className="text-left">
            <button className="btn btn-link" aria-label="Remove random company" onClick={(e) => {setAppState(appState.with_updates({tableau: tableau.remove_random_company()}))}}>
              <span aria-hidden="true" className="text-danger">&times;</span>
              {" "}
              Remove random company
            </button>
          </div>
          <ul className="list-unstyled text-left">
            { COMPANIES.map(company => {
              let status;
              let actions;
              if(tableau.removed_companies.includes(company)) {
                status = "(removed)"
              } else if(tableau.active_companies.includes(company)) {
                status = "(active)"
                actions = [
                  <button className="btn btn-link py-0" aria-label={`Deactivate ${company}`} onClick={(e) => {
                    const newTableau = tableau.deactivate_company(company)
                    const newState = appState.with_updates({tableau: newTableau})
                    setAppState(newState)}}>
                    <span aria-hidden="true" className="text-danger">&times;</span>
                    Deactivate
                  </button>
                ]
              } else {
                actions = [
                  <button className="btn btn-link py-0" aria-label={`Remove ${company}`} onClick={(e) => {
                    const newTableau = tableau.remove_company(company)
                    const newState = appState.with_updates({tableau: newTableau})
                    setAppState(newState)
                  }}>
                    <span aria-hidden="true" className="text-danger">&times;</span>
                    Remove
                  </button>,
                  <button className="btn btn-link py-0" aria-label={`Activate ${company}`} onClick={(e) => {setAppState(appState.with_updates({tableau: tableau.activate_company(company)}))}}>
                    <span aria-hidden="true" className="text-danger">&#10003;</span>
                    Activate
                  </button>
                ]
              }

              return <li>
                {company}
                {" "}
                <small>{status}</small>
                {" "}
                {actions}
              </li>
            })
            }
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default App;
