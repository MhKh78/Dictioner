/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';
import { login, logout } from './login';
import { createDic, deleteDic } from './newDic';
import { createWord, deleteWord, editWord } from './newWord';
import { signUp } from './signup';
import { updateSettings } from './updateSettings';
import { search } from './searchWord';
import slugify from 'slugify';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const newDic = document.querySelector('.form--newDic');
const newWord = document.querySelector('.newWord-form');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const deleteDictionary = document.querySelectorAll('.dictionaries__delete');
const deleteWords = document.querySelectorAll('.word__delete');
const editWords = document.querySelector('.edit__word');
const searchWord = document.querySelector('.form--search');

if (searchWord) {
  searchWord.addEventListener('submit', e => {
    e.preventDefault();
    const dictionarySlug = document.getElementById('dictionary').innerHTML;
    const dictionaryUser = document.getElementById('user').innerHTML;
    const searchParamater = document.getElementById('search').value;
    let lang = null;
    if (document.getElementById('lang_eng').checked) {
      lang = document.getElementById('lang_eng').value;
    } else if (document.getElementById('lang_fa').checked) {
      lang = document.getElementById('lang_fa').value;
    }
    if (lang === null) {
      showAlert('error', 'No Lang Specified');
    }

    search(searchParamater, lang, dictionarySlug, dictionaryUser);
  });
}

if (editWords) {
  editWords.addEventListener('submit', e => {
    e.preventDefault();
    const wordEng = document.getElementById('wordEng').value;
    const wordTrans = document.getElementById('wordTrans').value;
    const id = document.getElementById('id').value;
    const dicSLug = document.getElementById('dic_slug').value;

    editWord(wordEng, wordTrans, id, dicSLug);
  });
}
if (deleteWords) {
  deleteWords.forEach((i, k) => {
    i.addEventListener('click', e => {
      e.preventDefault();
      const dictionaryName = i.parentElement.parentElement.parentElement.querySelector(
        '.dictionary__name'
      ).innerHTML;
      const user = i.parentElement.parentElement.parentElement.querySelector(
        '.user__name'
      ).innerHTML;

      const wordEng = slugify(
        i.parentElement.parentElement.querySelector('.word_name').innerHTML,
        { lower: true }
      );

      const dictionary = slugify(dictionaryName, { lower: true });
      deleteWord(wordEng, dictionary, user);
    });
  });
}

if (deleteDictionary) {
  deleteDictionary.forEach((i, k) => {
    i.addEventListener('click', e => {
      e.preventDefault();

      const dicName = slugify(
        i.parentElement.parentElement.querySelector('.dic__name').innerHTML,
        { lower: true }
      );
      deleteDic(dicName);
    });
  });
}

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (newDic) {
  newDic.addEventListener('submit', e => {
    e.preventDefault();
    const dicName = document.getElementById('dicName').value;
    createDic(dicName);
  });
}

if (newWord) {
  newWord.addEventListener('submit', e => {
    e.preventDefault();
    const wordEng = document.getElementById('wordEng').value;
    const wordTrans = document.getElementById('wordTrans').value;
    const slug = document.getElementById('slug').value;
    createWord(wordEng, wordTrans, slug);
  });
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp(name, email, password, passwordConfirm);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
