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

  return [history, setHistory]
}

export { useLocalStorageForHistory }
