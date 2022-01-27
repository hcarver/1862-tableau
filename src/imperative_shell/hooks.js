import React from 'react';
import AppState from '../fn_core/app_state'

const HISTORY_VERSION = 0

function useLocalStorageForHistory() {
  const HISTORY_KEY = 'history-v' + HISTORY_VERSION
  const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const parsedHistory = storedHistory.map(item => new AppState(item))
  const [history, setHistory] = React.useState(parsedHistory);

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

  return { undo, reset, currentState: appState, pushNewState }
}

export { useLocalStorageForHistory }
