import { generatePalettes } from '@/lib/color-palette'

const getCategoryOrder = (cat) => {
  if (cat.includes('通用')) return `0_${cat}`
  if (cat.includes('中文')) return `1_${cat}`
  if (cat.includes('英文')) return `2_${cat}`
  return `3_${cat}`
}

const getCategoryName = (cat) => {
  if (cat.includes('通用')) '综合'
  return cat
}

function computeCategoriesFromTests(tests) {
  if (!tests) {
    return []
  } else {
    const palettes = generatePalettes(tests.length)
    return [...new Set(tests.map(test => test.tag))]
      .sort((a, b) => getCategoryOrder(a).localeCompare(getCategoryOrder(b)))
      .map((cat, idx) => ({
        id: getCategoryName(cat),
        name: getCategoryName(cat),
        palette: palettes[idx],
        departments: [...new Set(tests
          .filter(test => test.tag === cat)
          .map(test => test.departments)
          .reduce((s, v) => [...s, ...v], [])
        )]
      }))
  }
}

export { computeCategoriesFromTests }
