/* eslint-disable no-lonely-if */
import moment from 'moment';

const getRemainingDay = (startDate, endDate) => {
  let days = 0;
  const currentDay = moment();

  if (moment().isAfter(moment.utc(endDate).local())) {
    return 'Ended';
  } else {
    if (moment().isBefore(moment.utc(startDate).local())) {
      const eventDay = moment.utc(startDate).local();
      days = eventDay.diff(currentDay, 'days', false);

      if (days === 0) {
        const diff = moment
          .utc(startDate)
          .local()
          .diff(moment(), 'hours', true);
        if (diff >= 1 && diff < 2) {
          return 'Starts in 1 hour';
        } else {
          return `Starts in ${Math.round(diff)} hours`;
        }
      } else {
        return `Starts in ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    } else {
      const eventDay = moment.utc(endDate).local();
      days = eventDay.diff(currentDay, 'days', false);
      if (days === 0) {
        const diff = moment
          .utc(endDate)
          .local()
          .diff(moment(), 'hours', true);
        if (diff < 1) {
          return `Ends in ${eventDay.diff(
            currentDay,
            'minutes',
            false,
          )} minutes`;
        } else if (diff >= 1 && diff < 2) {
          return 'Ends in 1 hour';
        } else {
          return `Ends in ${Math.round(diff)} hours`;
        }
      } else {
        return `Ends in ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    }
  }
};

export const getRemainingDayNonUtc = (sDate, eDate) => {
  let days = 0;
  const currentDay = moment();
  const startDate = moment(sDate);
  const endDate = moment(eDate);
  if (currentDay.isAfter(endDate)) {
    return 'Ended';
  } else {
    if (currentDay.isBefore(startDate)) {
      days = startDate.diff(currentDay, 'days', false);
      if (days === 0) {
        const diff = startDate.diff(currentDay, 'hours', true);
        if (diff >= 1 && diff < 2) {
          return 'Starts in 1 hour';
        } else {
          return `Starts in ${Math.round(diff)} hours`;
        }
      } else {
        return `Starts in ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    } else {
      days = endDate.diff(currentDay, 'days', false);
      if (days === 0) {
        const diff = endDate.diff(currentDay, 'hours', true);
        if (diff < 1) {
          const mins = endDate.diff(currentDay, 'minutes', false);
          return `Ends in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
        } else if (diff >= 1 && diff < 2) {
          return 'Ends in 1 hour';
        } else {
          return `Ends in ${Math.round(diff)} hours`;
        }
      } else {
        return `Ends in ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    }
  }
};

export default getRemainingDay;
