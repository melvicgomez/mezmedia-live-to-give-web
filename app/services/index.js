import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';

export const createFormData = body => {
  const data = new FormData();
  const params = body;

  // if (params.images !== undefined && params.images !== null) {
  //   params.images = params.images.map(image => ({
  //     name: image.path.substring(image.path.lastIndexOf('/') + 1),
  //     type: image.mime,
  //     uri: image.path,
  //   }));
  // }

  // if (params.image_cover !== undefined && params.image_cover !== null) {
  //   params.image_cover = {
  //     name: params.image_cover.path.substring(
  //       params.image_cover.path.lastIndexOf('/') + 1,
  //     ),
  //     type: params.image_cover.mime,
  //     uri: params.image_cover.path,
  //   };
  // }

  Object.keys(params).forEach(key => {
    if (key === 'images') {
      if (params[key]) {
        params[key].map((image, i) =>
          data.append(`images[${i}]`, params[key][i]),
        );
      }
    } else if (key === 'progress') {
      params[key].map((progress, index) =>
        Object.keys(progress).forEach(k =>
          data.append(`progress[${index}][${k}]`, progress[k]),
        ),
      );
    } else {
      data.append(key, params[key]);
    }
  });

  return data;
};

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no store, no cache, must revalidate, max age=0',
    Pragma: 'no-cache',
  },
  timeout: 180000,
});

instance.interceptors.request.use(config => {
  const token = reactLocalStorage.getObject('token').access_token;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const handleError = ({ headers, message, data, status }) =>
  // eslint-disable-next-line prefer-promise-reject-errors
  Promise.reject({ headers, message, data, status });

instance.interceptors.response.use(
  response => response,
  ({ message, response: { headers, data, status } }) => {
    if (status === 401) {
      reactLocalStorage.remove('user');
      reactLocalStorage.remove('token');
      window.location.replace('/login');
    }
    return handleError({ headers, message, data, status });
  },
);

export default instance;
