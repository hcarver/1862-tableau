import './App.css';
import React from 'react';

import COMPANIES from './fn_core/companies'
import { SELECT_TABLEAU_SIZE_PHASE, SELECT_MULLIGAN_PHASE, NORMAL_PLAY_PHASE } from './fn_core/app_state'
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
    { deck.overflow_pile.length > 0 &&
        <p>Overflow cards:
        { deck.unremoved_overflow_pile().join(", ") } </p>
    }
  </Card>
}

const RANDOM_COMPANIES_REMOVED_IN_SETUP = 4

const Phase0App = ({appState, pushNewState}) => {
  const selectDifficulty = (number) => {
    let newApp = appState
    for(let i = 0; i < number; i++) {
      newApp = newApp.with_column_drawn()
    }

    for(let i = 0; i < RANDOM_COMPANIES_REMOVED_IN_SETUP; i++) {
      newApp = newApp.with_updates({
        deck: newApp.deck.remove_random_company()
      })
    }

    pushNewState(newApp.with_updates({
      phase: SELECT_MULLIGAN_PHASE
    }))
  }

  return <Card title="Select difficulty">
    <div class="btn-group">
      <button className="btn btn-secondary" onClick={() => selectDifficulty(10)}>Easy (10 columns)</button>
      <button className="btn btn-primary" onClick={() => selectDifficulty(9)}>Normal (9 columns)</button>
      <button className="btn btn-secondary" onClick={() => selectDifficulty(8)}>Hard (8 columns)</button>
    </div>
  </Card>
}

const Phase1App = ({appState, pushNewState}) => {
  const noMulliganOrExternalMulligan = () => pushNewState(appState.with_updates({
    phase: NORMAL_PLAY_PHASE
  }).filter_tableau())

  const removeDifferentCompanies = () => {
    let newDeck = appState.deck.without_removed_companies()
    for(let i = 0; i < RANDOM_COMPANIES_REMOVED_IN_SETUP; i++) {
      newDeck = newDeck.remove_random_company()
    }

    pushNewState(appState.with_updates({
      phase: NORMAL_PLAY_PHASE,
      deck: newDeck
    }).filter_tableau())
  }

  const redeal_column = (i) => {
    return <button className="list-group-item list-group-item-action list-group-item-success" onClick={() =>
        pushNewState(
          appState.with_mulliganed_column(i).with_updates({
            phase: NORMAL_PLAY_PHASE
          }).filter_tableau()
        )}>
      Deal column again
    </button>
  }

  return <React.Fragment>
    <h3>Choose your Mulligan</h3>
    <button className="btn btn-success m-1" onClick={noMulliganOrExternalMulligan}>
      No Mulligan
    </button>
    <button className="btn btn-success m-1" onClick={noMulliganOrExternalMulligan}>
      Shuffle Permits
    </button>
    <button className="btn btn-success m-1" onClick={removeDifferentCompanies}>
      Remove different companies
    </button>

    <div className="row">
    <div className="col-3">
      <DeckDisplay deck={appState.deck} />
      <ActiveCompanyDisplay appState={appState} pushNewState={pushNewState} showActions={false} />
    </div>
    <div className="col-9">
      <Tableau appState={appState} pushNewState={pushNewState} mayManipulate={false} columnActions={[i => redeal_column(i)]} />
    </div>
  </div>
</React.Fragment>
}

const Phase2App = ({appState, pushNewState}) => {
  return <div className="row">
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
}

function App() {
  let { undo, reset, currentState: appState, pushNewState } = useLocalStorageForHistory()
  appState = appState || new AppState()

  let currentAppState;

  if(appState.phase === SELECT_TABLEAU_SIZE_PHASE) {
    currentAppState = <Phase0App appState={appState} pushNewState={pushNewState} />
  }
  else if(appState.phase === SELECT_MULLIGAN_PHASE) {
    currentAppState = <Phase1App appState={appState} pushNewState={pushNewState} />
  }
  else {
    currentAppState = <Phase2App appState={appState} pushNewState={pushNewState} />
  }

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
      {currentAppState}
    </div>
  );
}

export default App;
