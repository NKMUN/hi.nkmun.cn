import administrativeAreas from '@/lib/province-city'

export const provinceFilters = administrativeAreas.map(a => ({
  code: a.code,
  value: a.name,
  text: a.name,
}))

export const provinceFilterHandler = (value, row, col) => row[col.property] === value
