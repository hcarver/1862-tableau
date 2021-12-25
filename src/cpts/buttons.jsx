import React from 'react'

const toBankButton = callback => <button
  className="btn btn-link py-0"
  aria-label="Move to bank pool"
  onClick={ callback } >
  🏦 To bank pool
</button>

const toHandButton = callback => <button
  className="btn btn-link py-0"
  aria-label="Move to hand"
  onClick={ callback } >
  ✋
  To hand
</button>

const toCharterButton = callback => <button
  className="btn btn-link py-0"
  aria-label="Move to charter"
  onClick={ callback } >
  📜
  To charter
</button>

export {
  toBankButton,
  toCharterButton,
  toHandButton
}
