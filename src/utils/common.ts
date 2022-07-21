import moment from 'moment';
import { Platform } from 'react-native';

export const formatPrice = (num = 0, currencySymbol = '$') => {
  const floatNum = parseFloat(`${num}`);
  return `${currencySymbol}${floatNum.toFixed(2)}`;
};

export const formatDate = (time, formatType = 'MM/YYYY') => {
  return moment(time).format(formatType);
};


export const isIOS = () => Platform.OS === 'ios';

export const isAndroid = () => Platform.OS === 'android';

export const removeHtml = (str) => str.replace(/<[^>]*>?/gm, '');

export const isValidHttpUrl = (str) => {
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(str);

}