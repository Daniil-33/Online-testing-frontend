import moment from 'moment'
import 'moment-timezone'
// import 'moment/min/locales.min'
import 'moment/dist/locale/ru';
import 'moment/dist/locale/kk';

export function formatDate (date) {
    const momentDate = moment(date)

    if (momentDate.year() === moment().year()) {
        return momentDate.format('MM.DD/HH:mm')
    } else {
        return momentDate.format('YYYY.MM.DD/HH:mm')
    }
}

export function formatTimerValue (milliseconds) {
    return moment.utc(milliseconds).format('mm:ss')
}
