import React from 'react'

import Card from './Card'
import COMPANIES from '../fn_core/companies'

const ActiveCompanyDisplay = ({appState, pushNewState}) => {
  const tableau = appState.tableau

  return <Card title="Companies">
    <div className="text-left">
      <button className="btn btn-link" aria-label="Remove random company" onClick={(e) => {pushNewState(appState.with_updates({tableau: tableau.remove_random_company()}))}}>
        <span aria-hidden="true" className="text-danger">&times;</span>
        {" "}
        Remove random company
      </button>
    </div>
    <ul className="list-unstyled text-left">
      { COMPANIES.map(company => {
        let status;
        let actions;
        if(appState.tableau.removed_companies.includes(company)) {
          status = "(removed)"
        } else if(tableau.active_companies.includes(company)) {
          status = "(active)"
          actions = [
            <button className="btn btn-link py-0" aria-label={`Deactivate ${company}`} onClick={(e) => {
              const newTableau = tableau.deactivate_company(company)
              const newState = appState.with_updates({tableau: newTableau})
              pushNewState(newState)}}>
            <span aria-hidden="true" className="text-danger">&times;</span>
            Deactivate
          </button>
          ]
        } else {
          actions = [
            <button className="btn btn-link py-0" aria-label={`Remove ${company}`} onClick={(e) => {
              const newTableau = tableau.remove_company(company)
              const newState = appState.with_updates({tableau: newTableau})
              pushNewState(newState)
            }}>
            <span aria-hidden="true" className="text-danger">&times;</span>
            Remove
            </button>,
            <button className="btn btn-link py-0" aria-label={`Activate ${company}`} onClick={(e) => {pushNewState(appState.with_updates({tableau: tableau.activate_company(company)}))}}>
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

}

export default ActiveCompanyDisplay
