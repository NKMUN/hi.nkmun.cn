export default function getRoleRoute(role) {
  switch (role) {
    case 'school': return '/school/'
    case 'admin':  return '/admin/'
    case 'root':   return '/root/'
    default:       return '/not-found'
  }
}
