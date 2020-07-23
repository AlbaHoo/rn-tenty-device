import moment from 'moment';
import parseDate from './parseDate';

export default function formatDate(value: Date | string | null) {
  const date = parseDate(value);
  moment.locale('zh-cn');
  return value ? moment(value).local().format('lll') : '';
}
