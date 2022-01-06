import React from 'react'

// Extracted from the 18xx.games code for 1862
const COMPANY_COLURS = {
  'E&H': {
    color: '#FFFF00',
    text_color: '#DD571C',
  },
  'ECR': {
    color: '#0A1172',
    text_color: '#FFFFFF',
  },
  'ENR': {
    color: '#FFFF00',
    text_color: '#0492C2',
  },
  'ESR': {
    color: '#5DBB63',
    text_color: '#30430E',
  },
  'EUR': {
    color: '#FF3030',
    text_color: '#710193',
  },
  'FDR': {
    color: '#FF6A06',
    text_color: '#C00000',
  },
  'I&B': {
    color: '#A0A0A0',
    text_color: '#000000',
  },
  'L&D': {
    color: '#FF6A06',
    text_color: '#0A1172',
  },
  'L&E': {
    color: '#FFFF00',
    text_color: '#D00000',
  },
  'L&H': {
    color: '#A1CAF1',
    text_color: '#B00000',
  },
  'N&B': {
    color: '#C0C0C0',
    text_color: '#B64900',
  },
  'N&E': {
    color: '#C0C0C0',
    text_color: '#355E3B',
  },
  'N&S': {
    color: '#A1CAF1',
    text_color: '#082567',
  },
  'Y&N': {
    color: '#ff0000',
    text_color: '#000000',
  },
  'NGC': {
    color: '#FFFF00',
    text_color: '#000000',
  },
  'SVR': {
    color: '#D2B55B',
    text_color: '#355E3B',
  },
  'WNR': {
    color: '#D2B55B',
    text_color: '#FF0000',
  },
  'W&F': {
    color: '#C7EA46',
    text_color: '#0B6623',
  },
  'WVR': {
    color: '#FFC0C0',
    text_color: '#8B008B',
  },
  'WStI': {
    color: '#FFFF00',
    text_color: '#8B008B',
  },
}

const Company = ({company}) => {
  const colour_object = COMPANY_COLURS[company]

  return <span className="d-inline-block stock-card" style={{color: colour_object.text_color, backgroundColor: colour_object.color}}>
    <span style={{position: "absolute", width: "3px", top: "0px", bottom: "0px", left: "0px", backgroundColor: colour_object.text_color}}></span>
    <span className="stock-card-text">
      {company}
    </span>
  </span>
}

export default Company
