export default function identificationTypeText(val) {
    switch(val) {
        case 'mainland': return '身份证'
        case 'sae':      return '港澳（回乡证）'
        case 'taiwan':   return '台胞证'
        case 'passport': return '护照'
        case 'other':    return '其它'
    }
}
