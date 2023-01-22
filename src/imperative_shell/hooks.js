import React from 'react';
import AppState from '../fn_core/app_state'
import COMPANIES from '../fn_core/companies'

const HISTORY_VERSION = 0

function sumAtStep(appState, company) {
  const dealt_card_counts = {}

  for(const column of appState.card_columns) {
    for(const company of column) {
      dealt_card_counts[company] = 1 + (dealt_card_counts[company] || 0)
    }
  }

  const inDeck = appState.deck.current_count(company)
  const inCharters = appState.charters.company_count(company)
  const inHand = appState.hand.company_count(company)
  const inBank = appState.bank_pool.company_count(company)
  const inTableau = (dealt_card_counts[company] || 0)

  return inDeck + inCharters + inHand + inBank + inTableau
}

function checkHistory(history_steps) {
  for(let stepNo = 1; stepNo < history_steps.length; stepNo++) {
    const previousHistory = history_steps[stepNo - 1]
    const currentHistory = history_steps[stepNo]

    COMPANIES.forEach(company => {
      const previousCount = sumAtStep(previousHistory, company)
      const currentCount = sumAtStep(currentHistory, company)
      if(previousCount !== currentCount){
        console.log(`At step ${stepNo}, shares of ${company} changed from ${previousCount} to ${currentCount}`)
      }
    })
  }
}

function useLocalStorageForHistory() {
  const HISTORY_KEY = 'history-v' + HISTORY_VERSION
  const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const parsedHistory = storedHistory.map(item => new AppState(item))
  const [history, setHistory] = React.useState(parsedHistory);

  checkHistory(history)

  React.useEffect( () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(item => item.to_obj())))
  }, [HISTORY_KEY, history])


  const appState = history.length > 0 ? history[history.length - 1] : null
  const pushNewState = newState => setHistory(currentHistory => [...currentHistory, newState])

  const reset = () => {
    if(window.confirm("Are you sure you want to reset the whole game?"))
    {
      setHistory([])
    }
  }
  const undo = () => {
    if(history.length > 0) {
      setHistory(history.slice(0, history.length - 1))
    }
  }

  return { undo, reset, currentState: appState, pushNewState, history: JSON.stringify(storedHistory) }
}

export { useLocalStorageForHistory }
