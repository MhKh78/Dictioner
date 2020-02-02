/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import slugify from 'slugify';

export const createWord = async (wordEng, wordTrans, slug) => {
  //   const result = await serviceResult(wordEng);

  //   console.log(result);
  // };

  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/dics/${slug}/words`,
      data: {
        wordEng,
        wordTrans,
        slug
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Word Created successfully!');
      window.setTimeout(() => {
        location.assign(`/dictionaries/${slug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteWord = async (slug, dic_slug, user_name) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/words/${slug}&${dic_slug}&${user_name}`
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
export const editWord = async (wordEng, wordTrans, id, dicSLug) => {
  const slug = slugify(wordEng, { lower: true });
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/words/${id}&id`,
      data: {
        wordEng,
        wordTrans,
        slug
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Word Edit successfully!');
      window.setTimeout(() => {
        location.assign(`/dictionaries/${dicSLug}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
