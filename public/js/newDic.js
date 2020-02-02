/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createDic = async dicName => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/dics',
      data: {
        dicName
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Dictionary Created successfully!');
      window.setTimeout(() => {
        location.assign('/dictionaries');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteDic = async slug => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/dics/${slug}`
    });

    if (res.data === '') {
      showAlert('success', 'Dictionary Deleted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
