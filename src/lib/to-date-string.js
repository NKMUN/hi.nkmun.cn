import moment from 'moment'
import momentTz from 'moment-timezone'

function toDateString(date) {
  // date is local time, treat its date string as checkIn/Out date in Asia/Shanghai TZ
  return moment(date).format('YYYY-MM-DD')
}

export default toDateString
