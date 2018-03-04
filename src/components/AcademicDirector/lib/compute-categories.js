import { generatePalettes } from '@/lib/color-palette'

function computeCategoriesFromTests(tests) {
  if (!tests) {
    return []
  } else {
    const palettes = generatePalettes(tests.length)
    const categories = [...new Set(tests.map(test => test.tag))].sort()
    return categories.map((cat, idx) => ({
      id: cat,
      name: cat,
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
