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
    this.active_companies = []

    COMPANIES.forEach(company => {
      this.cards.set(company, 7)
    })
  }

  serialize() {
    return JSON.stringify({
      rc: this.removed_companies,
      ac: this.active_companies,
      cards: JSON.stringify(Array.from(this.cards.entries()))
    })
  }

  deserialize_from(str) {
    if(str) {
      const parsed = JSON.parse(str)

      this.removed_companies = parsed['rc']
      this.active_companies = parsed['ac'] || []
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
    newTableau.active_companies = [...this.active_companies]
    return newTableau
  }

  activate_company(company) {
    const newTableau = new Tableau()
    newTableau.active_companies = [...this.active_companies, company]
    newTableau.cards = new Map(this.cards)
    newTableau.removed_companies = [...this.removed_companies]
    return newTableau
  }

  deactivate_company(company) {
    const newTableau = new Tableau()
    newTableau.active_companies = this.active_companies.filter(c => c !== company)
    newTableau.cards = new Map(this.cards)
    newTableau.removed_companies = [...this.removed_companies]
    return newTableau
  }

  draw_card() {
    const count = this.total_count()
    if(count === 0) return [this, null];

    const all_cards = [].concat(
      ...COMPANIES.map((company) => Array(this.current_count(company)).fill(company))
    )

    const picked_card = this.random_member(all_cards)

    const new_tableau = new Tableau()
    new_tableau.removed_companies = [...this.removed_companies]
    new_tableau.active_companies = [...this.active_companies]
    new_tableau.cards = new Map(this.cards)
    new_tableau.cards.set(picked_card, this.cards.get(picked_card) - 1)

    return [new_tableau, picked_card]
  }

  remove_random_company() {
    debugger;

    const remaining_companies = COMPANIES.filter(c => !this.removed_companies.includes(c) && !this.active_companies.includes(c))

    if(remaining_companies.length === 0) {
      return this;
    }

    const removed = this.random_member(remaining_companies)

    return this.remove_company(removed)
  }

  random_member(list) {
    return list[Math.floor(Math.random() * list.length)]
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

  const reset = () => {if(window.confirm("Are you sure you want to reset?")) {setHistory([])}}
  const undo = () => {setHistory(history.slice(0, history.length - 1))}

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
              {company_list(appState.drawnCards)}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Companies</h5>
            <div className="text-left">
              <button className="btn btn-link" aria-label="Remove random company" onClick={(e) => {setAppState(new AppState(tableau.remove_random_company(), appState.drawnCards))}}>
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
                    <button className="btn btn-link py-0" aria-label={`Deactivate ${company}`} onClick={(e) => {setAppState(new AppState(tableau.deactivate_company(company), appState.drawnCards))}}>
                      <span aria-hidden="true" className="text-danger">&times;</span>
                      Deactivate
                    </button>
                  ]
                } else {
                  actions = [
                    <button className="btn btn-link py-0" aria-label={`Remove ${company}`} onClick={(e) => {setAppState(new AppState(tableau.remove_company(company), appState.drawnCards))}}>
                      <span aria-hidden="true" className="text-danger">&times;</span>
                      Remove
                    </button>,
                    <button className="btn btn-link py-0" aria-label={`Activate ${company}`} onClick={(e) => {setAppState(new AppState(tableau.activate_company(company), appState.drawnCards))}}>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
