exports.isInThePast = (date) => {
  const today = new Date();

  return date < today;
}

exports.getTeamDrivers = (team) => {
  switch (team) {
    case 'alfa': {
      return ['bottas', 'zhou']
    }
    case 'alphatauri': {
      return ['gasly', 'tsunoda']
    }
    case 'alpine': {
      return ['alonso', 'ocon']
    }
    case 'aston_martin': {
      return ['hulkenberg', 'stroll', 'vettel']
    }
    case 'ferrari': {
      return ['leclerc', 'sainz']
    }
    case 'haas': {
      return ['kevin_magnussen', 'mick_schumacher']
    }
    case 'mclaren': {
      return ['norris', 'ricciardo']
    }
    case 'mercedes': {
      return ['hamilton', 'russell']
    }
    case 'red_bull': {
      return ['perez', 'max_verstappen']
    }
    case 'williams': {
      return ['albon', 'latifi']
    }
    default: {
      return
    }
  }
}

exports.getConstructorHexColor = (team) => {
  switch (team) {
    case 'alfa': {
        return {color: '#900000', rgb: 'rgb(144,0,0)'}
    }
    case 'alphatauri': {
      return {color: '#2B4562', rgb: 'rgb(43,69,98)'}
    }
    case 'alpine': {
      return {color: '#0090FF', rgb: 'rgb(0,144,255)'}
    }
    case 'aston_martin': {
      return {color: '#006F62', rgb: 'rgb(0,111,98)'}
    }
    case 'ferrari': {
      return {color: '#DC0000', rgb: 'rgb(220,0,0)'}
    }
    case 'haas': {
      return {color: '#FFFFFF', rgb: 'rgb(255,255,255)'}
    }
    case 'mclaren': {
      return {color: '#FF8700', rgb: 'rgb(255,135,0)'}
    }
    case 'mercedes': {
      return {color: '#00D2BE', rgb: 'rgb(0, 210, 190)'}
    }
    case 'red_bull': {
      return {color: '#0600EF', rgb: 'rgb(6,0,239)'}
    }
    case 'williams': {
      return {color: '#005AFF', rgb: 'rgb(0,90,255)'}
    }
    default: {
      return
    }
  }
}