import store from '_src/utils/store';
import { API_ORIGIN } from '_src/constants';
import { Actions } from 'react-native-router-flux';
import Logger from '_src/logger';
const logger = new Logger('request');

const checkStatus = async (response) => {
  switch(response.status) {
    case 204: return '';
    case 403:
    case 404:
    case 500:
      const error = new Error(`错误${response.status}`);
      error.response = await response.json();
      throw error
    default:
      return response.json();
  }
}

async function request({ url, path, method, body, fail }) {

  const formattedUrl = url || `${API_ORIGIN}${path}`;
  logger.info(formattedUrl);

  return fetch(formattedUrl, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }).then(checkStatus).then(data => {
    logger.info(data);
    return {
      data
    };
  });
}

export default request;
