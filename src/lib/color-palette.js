// Ant Design color palette
const PALETTE = [
  { name: 'red',
    values: [
      '#ffa39e',
      '#ff7875',
      '#ff4d4f',
      '#f5222d',
    ],
  },
  { name: 'orange',
    values: [
      '#ffd591',
      '#ffa940',
      '#ffa940',
      '#fa8c16',
    ],
  },
  { name: 'yellow',
    values: [
      '#fffb8f',
      '#fff566',
      '#ffec3d',
      '#fadb14',
    ]
  },
  { name: 'lime',
    values: [
      '#eaff8f',
      '#d3f261',
      '#bae637',
      '#a0d911',
    ]
  },
  { name: 'green',
    values: [
      '#b7eb8f',
      '#95de64',
      '#73d13d',
      '#52c41a',
    ]
  },
  { name: 'cyan',
    values: [
      '#87e8de',
      '#5cdbd3',
      '#36cfc9',
      '#13c2c2',
    ]
  },
  { name: 'blue',
    values: [
      '#91d5ff',
      '#69c0ff',
      '#40a9ff',
      '#1890ff',
    ]
  },
  { name: 'purple',
    values: [
      '#d3adf7',
      '#b37feb',
      '#9254de',
      '#722ed1',
    ]
  },
  { name: 'magenta',
    values: [
      '#ffadd2',
      '#ff85c0',
      '#f759ab',
      '#eb2f96',
    ]
  }
]

function parseHex(str) {
  function unhex(hex) {
    if ('0' <= hex && hex <= '9') return hex.charCodeAt(0) - '0'.charCodeAt(0)
    if ('a' <= hex && hex <= 'f') return hex.charCodeAt(0) - 'a'.charCodeAt(0) + 10
    if ('A' <= hex && hex <= 'F') return hex.charCodeAt(0) - 'A'.charCodeAt(0) + 10
    return NaN
  }
  return unhex(str[0]) * 16 + unhex(str[1])
}

function parseRGBHex(str) {
  return [
    parseHex(str.slice(1, 3)),
    parseHex(str.slice(3, 5)),
    parseHex(str.slice(5, 7)),
  ]
}

function getColor(color, value) {
  const definition = PALETTE.find(p => p.name === color)
  const values = definition ? definition.values : PALETTE[0].values
  if (value === null || value === undefined) {
    return values[0]
  } else {
    const steps = 100 / (values.length - 1)
    const step = Math.floor(value / steps)
    const l = parseRGBHex(values[step])
    const r = parseRGBHex(values[step + 1] || values[step])
    const perValue = r.map((_, i) => (r[i] - l[i]) / steps)
    const rgb = l.map((_, i) => l[i] + perValue[i] * (value - step * steps)).map(Math.floor)
    return `rgb(${ rgb.join(', ') })`
  }
}

function generatePalettes(n) {
  for (let skip = 4; skip > 0; --skip)
    if ((PALETTE.length - 1) / skip >= n)
      return PALETTE.filter((_ ,i) => i % skip === 0).map(p => p.name)
  return PALETTE.map(p => p.name)
}

export { generatePalettes, getColor }