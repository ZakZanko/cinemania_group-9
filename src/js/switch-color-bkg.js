const refs = {
  switchIcon: document.getElementById('switch-icon'),
  body: document.querySelector('body'),
  iconDay: document.querySelector('.icon-day'),
  iconNight: document.querySelector('.icon-night'),
  headerLogoText: document.querySelector('.header-logo-text'),
  homeLink: document.getElementById('home-day'),
  catalogLink: document.getElementById('catalog-day'),
  myLiberyLink: document.getElementById('my-libery-day'),
  menuLink: document.getElementById('menu-link'),
};

refs.switchIcon.addEventListener('click', switchColor);

window.addEventListener('DOMContentLoaded', addClassColor);

const KEY_LOCAL_STOREG = 'background';
// const value = 'value';

function switchColor() {
  refs.body.classList.toggle('bkg-white');
  switchIcon();
  switchColorLink();

  refs.headerLogoText.classList.toggle('day-logo-text');

  const audit = refs.body.classList.contains('bkg-white');

  save(KEY_LOCAL_STOREG, audit);
}

function addClassColor() {
  const localValue = load(KEY_LOCAL_STOREG);
  //   console.log(localValue);
  if (localValue) {
    switchColorLinkOn();

    refs.body.classList.add('bkg-white');
    refs.headerLogoText.classList.add('day-logo-text');
    refs.switchIcon.classList.add('icon-day');
    refs.switchIcon.classList.remove('icon-night');
  } else {
    switchColorLinkOff();

    refs.switchIcon.classList.remove('icon-day');
    refs.switchIcon.classList.add('icon-night');
    refs.headerLogoText.classList.remove('day-logo-text');
  }
}

function switchIcon() {
  refs.switchIcon.classList.toggle('icon-day');
  refs.switchIcon.classList.toggle('icon-night');
}

function switchColorLinkOn() {
  refs.catalogLink.classList.add('menu-link-day');
  refs.homeLink.classList.add('menu-link-day');
  refs.myLiberyLink.classList.add('menu-link-day');
  refs.menuLink.classList.add('menu-link-day');
}

function switchColorLinkOff() {
  refs.catalogLink.classList.remove('menu-link-day');
  refs.homeLink.classList.remove('menu-link-day');
  refs.myLiberyLink.classList.remove('menu-link-day');
  refs.menuLink.classList.remove('menu-link-day');
}

function switchColorLink() {
  refs.catalogLink.classList.toggle('menu-link-day');
  refs.homeLink.classList.toggle('menu-link-day');
  refs.myLiberyLink.classList.toggle('menu-link-day');
  refs.menuLink.classList.toggle('menu-link-day');
}

const save = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
};

const load = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};
