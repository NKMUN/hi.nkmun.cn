import { generateHue } from '@/lib/color-palette'

function computeCategoriesFromTests(tests) {
  if (!tests) {
    return []
  } else {
    const hues = generateHue(tests.length)
    const categories = [...new Set(tests.map(test => test.tag))].sort()
    return categories.map((cat, idx) => ({
      id: cat,
      name: cat,
      hue: hues[idx],
      departments: [...new Set(tests
        .filter(test => test.tag === cat)
        .map(test => test.departments)
        .reduce((s, v) => [...s, ...v], [])
      )]
    }))
  }
}

export { computeCategoriesFromTests }
