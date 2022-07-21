import moment from 'moment';
export function formatDate(
  date: string | Date,
  format = 'DD/MM/YYYY HH:mm:ss'
) {
  return moment(date).format(format);
}
export const formatDateFromnow = (date?: string | Date) => {
  return moment(date).fromNow();
};

export const getBirthday = (date: string | Date) => {
  return Math.abs(moment(date).diff(moment(), 'years'));
};

export const formatZodiac = (date: string | Date) => {
  const zodiac = [
    {
      name: 'Capricorn',
      fromDate: moment(`12/22/${moment(date).year() - 1}`, 'MM/DD/YYYY'),
      toDate: moment(`1/19/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Aquarius',
      fromDate: moment(`1/20/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`2/19/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Pisces',
      fromDate: moment(`2/20/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`3/20/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Aries',
      fromDate: moment(`3/21/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`4/20/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Taurus',
      fromDate: moment(`4/21/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`5/20/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Gemini',
      fromDate: moment(`5/21/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`6/21/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Cancer',
      fromDate: moment(`6/22/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`7/22/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Leo',
      fromDate: moment(`7/23/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`8/22/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Virgo',
      fromDate: moment(`8/23/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`9/22/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Libra',
      fromDate: moment(`9/23/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`10/23/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Scorpio',
      fromDate: moment(`10/24/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`11/21/${moment(date).year()}`, 'MM/DD/YYYY')
    },
    {
      name: 'Sagittarius',
      fromDate: moment(`11/22/${moment(date).year()}`, 'MM/DD/YYYY'),
      toDate: moment(`12/21/${moment(date).year()}`, 'MM/DD/YYYY')
    }
  ];

  return zodiac
    .filter(
      (i) => moment(date).isAfter(i.fromDate) && moment(date).isBefore(i.toDate)
    )
    .map((i) => i.name)
    .toString();
};
