import './App.css';
import React from 'react';

import COMPANIES from './fn_core/companies'
import { useLocalStorageForHistory } from './imperative_shell/hooks'

import ActiveCompanyDisplay from './cpts/ActiveCompanyDisplay'
import Card from './cpts/Card'
import Hand from './cpts/Hand'
import Charters from './cpts/Charters'
import AppState from './fn_core/app_state'
import BankPool from './cpts/BankPool'
import Tableau from './cpts/Tableau'

const DeckDisplay = ({deck}) => {
  return <Card title="Deck">
    <p>
      {`Cards in deck:
                  ${deck.total_count()}`}
    </p>
    <p>
      Card counts:
      {" "}
      {COMPANIES.map(company => `${company}: ${deck.current_count(company)}`).join(", ")}
    </p>
  </Card>
}

function App() {
  let { undo, reset, currentState: appState, pushNewState } = useLocalStorageForHistory()
  appState = appState || new AppState()

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
          <DeckDisplay deck={appState.deck} />
          <ActiveCompanyDisplay appState={appState} pushNewState={pushNewState} />
        </div>
        <div className="col-6">
          <Tableau appState={appState} pushNewState={pushNewState} />
        </div>
        <div className="col-3">
          <Hand appState={appState} pushNewState={pushNewState}/>
          <BankPool appState={appState} pushNewState={pushNewState}/>
          <Charters appState={appState} pushNewState={pushNewState}/>
        </div>
      </div>
    </div>
  );
}

export default App;
