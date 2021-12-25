import React from 'react'

const Card = ({title, children}) => {
  return <div className="card mb-3">
    <h5 className="card-header">{title}</h5>
    <div className="card-body">
      <div className="card-text">
        {children}
      </div>
    </div>
  </div>
}

export default Card
