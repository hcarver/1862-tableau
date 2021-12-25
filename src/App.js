import './App.css';
import React from 'react';

import COMPANIES from './fn_core/companies'
import AppState from './fn_core/app_state'
import { useLocalStorageForHistory } from './imperative_shell/hooks'
import { toBankButton, toCharterButton, toHandButton } from './cpts/buttons'

import Card from './cpts/Card'
import CardSet from './cpts/CardSet'
import Tableau from './cpts/Tableau'

const DeckDisplay = ({tableau}) => {
  return <Card title="Deck">
    <p>
      {`Cards in deck:
                  ${tableau.total_count()}`}
    </p>
    <p>
      Card counts:
      {" "}
      {COMPANIES.map(company => `${company}: ${tableau.current_count(company)}`).join(", ")}
    </p>
  </Card>
}

function App() {
  const [history, setHistory] = useLocalStorageForHistory()

  const appState = history.length > 0 ? history[history.length - 1] : new AppState()
  const setAppState = newState => setHistory([...history, newState])

  const tableau = appState.tableau;

  const reset = () => {if(window.confirm("Are you sure you want to reset?")) {setHistory([])}}
  const undo = () => {setHistory(history.slice(0, history.length - 1))}


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
      <div className="row no-gutters mb-3">
        <div className="col-6">
          <button className="btn btn-block btn-secondary rounded-0" onClick={undo}>UNDO</button>
        </div>
        <div className="col-6">
          <button className="btn btn-block btn-warning rounded-0" onClick={reset}>RESET</button>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <DeckDisplay tableau={tableau} />
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
          <div className="col-6">
            <Tableau appState={appState} setAppState={setAppState} />
          </div>
          <div className="col-3">
            <Card title="Hand">
              <CardSet card_set={appState.hand} actions_per_card={
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
              <CardSet card_set={appState.bank_pool} actions_per_card={
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
              <CardSet card_set={appState.charters} actions_per_card={
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
          </div>
        </div>
    </div>
  );
}

export default App;
