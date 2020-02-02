/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import slugify from 'slugify';

export const search = async (word, lang, slug, user) => {
  window.location.href = `/dictionaries/${slug}/${word}&${user}&${lang}`;
};
