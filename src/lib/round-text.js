function roundText(r) {
  switch(r) {
    case '1': return '一轮'
    case '2': return '追加'
    case '3': return '追加'
    case 'roomshare': return '拼房'
    case 'individual': return '个人'
    default:  return '未知'
  }
}

export default roundText
