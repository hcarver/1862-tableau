import './App.css';
import React from 'react';

const COMPANIES = [
  "WNR", "ENR", "W&F", "L&H", "L&D", "WStI", "L&E", "E&H", "NGC", "N&E",
  "I&B", "N&B", "SVR", "ECR", "EUR", "ESR", "FDR", "WVR", "N&S", "Y&N"
]

class Tableau {
  constructor() {
    this.cards = new Map()
    this.removed_companies = []

    COMPANIES.forEach(company => {
      this.cards.set(company, 7)
    })
  }

  serialize() {
    return JSON.stringify({
      rc: this.removed_companies,
      cards: JSON.stringify(Array.from(this.cards.entries()))
    })
  }

  deserialize_from(str) {
    if(str) {
      const parsed = JSON.parse(str)

      this.removed_companies = parsed['rc']
      this.cards = new Map(JSON.parse(parsed['cards']))
    }
    return this;
  }

  current_count(company) {
    return this.cards.get(company)
  }

  total_count() {
    return Array.from(this.cards.values()).reduce((a, b) => a + b)
  }

  remove_company(company) {
    const newTableau = new Tableau()
    newTableau.removed_companies = [...this.removed_companies, company]
    newTableau.cards = new Map(this.cards)
    newTableau.cards.set(company, 0)
    return newTableau
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...COMPANIES.map((company) => Array(this.current_count(company)).fill(company))
    )

    const picked_card = all_cards[Math.floor(Math.random() * all_cards.length)]

    const new_tableau = new Tableau()
    new_tableau.removed_companies = [...this.removed_companies]
    new_tableau.cards = new Map(this.cards)
    new_tableau.cards.set(picked_card, this.cards.get(picked_card) - 1)

    return [new_tableau, picked_card]
  }
}

class AppState {
  constructor(tableau, drawnCards) {
    this.tableau = tableau || new Tableau()
    this.drawnCards = drawnCards || []
  }

  serialize() {
    return JSON.stringify({
      tableau: this.tableau.serialize(),
      drawnCards: this.drawnCards
    })
  }

  deserialize_from(str) {
    if(str) {
      const parsed = JSON.parse(str)

      this.tableau = new Tableau().deserialize_from(parsed.tableau)
      this.drawnCards = parsed.drawnCards
    }
    return this;
  }
}

function App() {
  const storedHistory = JSON.parse(localStorage.getItem('history') || '[]')
  const parsedHistory = storedHistory.map(item => new AppState().deserialize_from(item))

  const [history, setHistory] = React.useState(parsedHistory);

  React.useEffect( () => {
    localStorage.setItem('history', JSON.stringify(history.map(item => item.serialize())))
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

    setAppState(
      new AppState(
        last_tableau,
        [...new_cards, ...appState.drawnCards]
      )
    )

    inputRef.current.value = 1
  }

  const tableau = appState.tableau;

  const removed_companies = tableau.removed_companies
  const reset = () => {if(window.confirm("Are you sure you want to reset?")) {setHistory([])}}

  const company_list = (companies) => <ul className="list-unstyled">
    {companies.map(c => <li>{c}</li>)}
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
      <div className="card-columns">
        <div className="card">
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
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Draw cards</h5>
            <div className="card-text">
              <p className="form-inline justify-content-center">
                <input className="form-control" type="number" min="1" ref={inputRef} placeholder="How many to draw"/>
                <button className="btn btn-primary" onClick={drawCardButton}>Draw card</button>
              </p>
              <p>
                Cards you've drawn (most recent first)
              </p>
              <ul className="list-unstyled">
                {company_list(appState.drawnCards)}
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Companies</h5>
            <p className="card-text">
              Removed companies:
            </p>
            <ul className="list-unstyled">
              {company_list(removed_companies)}
            </ul>
            <p>
              Remaining companies:
            </p>
            <ul className="list-unstyled">
              {
                COMPANIES.filter(c => !tableau.removed_companies.includes(c)).map(
                  company => <li key={company}>
                    <button className="btn btn-link py-0" aria-label={`Remove ${company}`} onClick={(e) => {setAppState(new AppState(tableau.remove_company(company), appState.drawnCards))}}>
                      <span aria-hidden="true" className="text-danger">&times;</span>
                      {" "}
                      {company}
                    </button>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
      <div>
        <button className="btn btn-block btn-warning" onClick={reset}>RESET</button>
      </div>
    </div>
  );
}

export default App;
