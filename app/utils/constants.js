/* eslint-disable no-useless-escape */
/* eslint-disable prefer-template */

import listOfWords from 'utils/listOfWords.json';

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const locations = [
  'Australia',
  'China',
  'Hong Kong SAR',
  'India',
  'Japan',
  'Singapore',
];

export const areas = [
  'Banking',
  'BI Run the Bank Technology',
  'BIA',
  'CIB Other',
  'Compliance',
  'Control',
  'Corporate',
  'Corporate Digital Banking',
  'Corporate Relations',
  'CRES & Location Strategy',
  'Enterprise Data',
  'External Audit',
  'Finance',
  'Global Research',
  'Global Security',
  'GTIS',
  'HR',
  'Legal',
  'Markets',
  'Markets Post Trade',
  'Markets Pre Trade',
  'Payments & Corp Client Treas Svc',
  'Private Bank',
  'Procurement',
  'Risk',
  'Risk Finance and Treasury',
  'Secured and Unsecured Fraud',
  'Trade and Working Capital',
  'Wealth Processing',
  'Wholesale Lending',
  'Wholesale Onboarding and Group FCO',
];

export const emailDomains = [
  '@barclays.com',
  '@barcap.com',
  '@barclayscapital.com',
  '@barclayscorporate.com',
  '@just-challenge.com',
  '@barclayscorp.com',
  '@barclaysasia.com',
  '@barclayswealth.com',
  '@mezmedia.com',
  '@pragmastrategy.com',
];

export const countryIcons = {
  'Hong Kong': 'hongkongIcon',
  Singapore: 'singaporeIcon',
  Australia: 'australiaIcon',
  India: 'indiaIcon',
  Japan: 'japanIcon',
  China: 'chinaIcon',
};
export const activityType = [
  'Walking',
  'Running',
  'Hiking',
  'Cycling',
  'Swimming',
];

export const metrics = [
  { id: 1, name: 'Distance (KM)', value: 'distance' },
  { id: 2, name: 'Duration of Activity (Hour)', value: 'duration' },
  { id: 3, name: 'Calories Burnt', value: 'calorie' },
];

export const badgeRankNames = [
  'Bronze 1',
  'Bronze 2',
  'Bronze 3',
  'Silver 1',
  'Silver 2',
  'Silver 3',
  'Gold 1',
  'Gold 2',
  'Gold 3',
  'Platinum 1',
  'Platinum 2',
  'Platinum 3',
  'Diamond 1',
  'Diamond 2',
  'Diamond 3',
];

export const regexStr = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: /^(?=.{8,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/,
  name: /^([a-zA-Z\s.\-']|(\u2018|\u2019))*$/,
  letters: /^[a-zA-Z\s]*$/,
  lettersNumbers: /^[a-zA-Z0-9\s]*$/,
  englishOnly: /^([a-zA-Z0-9\w\s|<>,.\/?;:'"[\\|=+_)(*&^%$#@!~`)\-\]\{\}]|(\u2018|\u2019))*$/,
  englishAndEmoji: /^([a-zA-Z0-9\w\s|<>,.\/?;:'"[\\|=+_)(*&^%$#@!~`)\-\]\{\}]|(\u00a3|\u00a5|\u00a9|\u00ae|\uffe1|\uffe5|\u2018|\u2019|\u20ac|\u20b9|[\u2190-\u2199]|[\u23e9-\u23fa]|[\u2460-\u24ff]|[\u2614-\u2757]|[\u2795-\u2797]|\u27b0|\u27bf|[\u2b00-\u2b50]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))*$/,
};

export const hasInappropriateLanguage = (str = '') => {
  const words = new RegExp('\\b' + listOfWords.join('\\b|\\b') + '\\b', 'i');
  return words.test(str);
};
