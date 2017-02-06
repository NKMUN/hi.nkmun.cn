export default function getRoleRoute(role) {
  switch (role) {
    case 'school': return '/school/'
    case 'admin':  return '/admin/'
    case 'root':   return '/admin/'
    default:       return '/not-found'
  }
}
