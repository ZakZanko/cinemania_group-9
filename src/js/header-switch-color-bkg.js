const refs = {
  switchIcon: document.getElementById('switch-icon'),
  body: document.querySelector('body'),
  iconDay: document.querySelector('.icon-day'),
  iconNight: document.querySelector('.icon-night'),
  headerLogoText: document.querySelector('.header-logo-text'),
};

refs.switchIcon.addEventListener('click', switchColor);

window.addEventListener('DOMContentLoaded', addClassColor);



const KEY_LOCAL_STOREG = 'background';
const value = 'value';

function switchColor() {
    switchIcon();

    refs.body.classList.toggle('bkg-white');
    
    refs.headerLogoText.classList.toggle('day-logo-text')


  const audit = refs.body.classList.contains('bkg-white');

    
    
  save(KEY_LOCAL_STOREG, audit);
}

function addClassColor() {
  const localValue = load(KEY_LOCAL_STOREG);
//   console.log(localValue);
  if (localValue) {
      refs.body.classList.add('bkg-white');
      refs.headerLogoText.classList.add("day-logo-text")
    refs.switchIcon.classList.remove('icon-day');
    refs.switchIcon.classList.add('icon-night');
    }
  else {
        refs.headerLogoText.classList.remove('day-logo-text');
    }
}

function switchIcon() {
  refs.switchIcon.classList.toggle('icon-day');
  refs.switchIcon.classList.toggle('icon-night');
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
