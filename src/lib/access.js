export const matchAccessString = (givenAccess, requiredAccess) => 
    givenAccess === 'root' || `${requiredAccess}.`.startsWith(`${givenAccess}.`)

export const hasAccess = (givenAccesses = [] , requiredAccess = '') => 
    givenAccesses.find(givenAccess => matchAccessString(givenAccess, requiredAccess))