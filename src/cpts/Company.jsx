import React from 'react'

const Company = ({company}) => {
  return <span className="d-inline-block stock-card">
    <span className="stock-card-text">
      {company}
    </span>
  </span>
}

export default Company
