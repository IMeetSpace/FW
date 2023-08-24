export const getRemainingTime = (dateRequire, dateNow, getDaysCount = false) => {
  let dateDiff = dateRequire - dateNow;

  let days = dateDiff / (1000 * 60 * 60 * 24);
  let hours = (days - parseInt(days)) * 24 - 3;
  let minutes = (hours - parseInt(hours)) * 60;

  if (getDaysCount) return parseInt(days);

  let dateString =
    days > 30
      ? 'больше месяца'
      : `${days > 1 ? `${parseInt(days)} д.` : ''} 
        ${hours > 1 ? `${parseInt(hours)} ч.` : ''} 
        ${minutes > 1 ? `${parseInt(minutes)} м.` : ''}`;
  if (days < 1 && hours < 1 && minutes < 1) {
    dateString = 'меньше минуты';
  }
  if (days < 1 && hours < 1 && minutes < 0) {
    dateString = 'истёк';
  }
  return dateString;
};

export const getPastTime = (dateCreate, dateNow) => {
  let dateDiff = dateNow - dateCreate;
  console.log(dateDiff);

  let days = dateDiff / (1000 * 60 * 60 * 24);
  let hours = (days - parseInt(days)) * 24;
  let minutes = (hours - parseInt(hours)) * 60;

  let dateString =
    days > 30
      ? 'больше месяца'
      : `${days > 1 ? `${parseInt(days)} д.` : ''} 
        ${hours > 1 ? `${parseInt(hours)} ч.` : ''} 
        ${minutes > 1 ? `${parseInt(minutes)} м.` : ''}`;
  if (days < 1 && hours < 1 && minutes < 1) {
    dateString = 'меньше минуты';
  }
  return dateString;
};

export const getFullDate = (date) => {
  let dateString =
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2);
  return dateString;
};

export const months = () => {
  return [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
};
