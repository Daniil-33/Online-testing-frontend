import { getRndInteger } from "./utilsHelper"
import moment from 'moment'
import 'moment-timezone'
// import 'moment/min/locales.min'
import 'moment/dist/locale/ru';
import 'moment/dist/locale/kk';

export function formatDate (date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeStyle: short,
    });
}

export function formatTimerValue (milliseconds) {
    return moment.utc(milliseconds).format('mm:ss')
}
