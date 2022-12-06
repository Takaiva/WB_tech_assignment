import './styles.css';
import './style/adaptive.css';
import './style/icons.css';
import './style/activity_and_modifiers.css';

import runApp from './app.js';

const searchContainer = document.querySelector('.search');
const input = document.querySelector('.search__input');
const searchIcon = document.querySelector('._icon-search');
const searchForm = document.querySelector('.search__form');
const arrowToggleButton = document.querySelectorAll('.toggle-btn');
const inStockBasket = document.querySelectorAll('.basket-section__in-stock__tools');
const outStockBasket = document.querySelectorAll('.basket-section__out-of-stock__tools');
const totalGoods = document.querySelector('.form__select-all__total-goods');
const checkboxes = document.querySelectorAll('input[type=checkbox]');
const buttonOrder = document.querySelector('.order-button');
const totalCost = document.querySelector('.costs__total__sum');
const refundFreeElements = document.querySelectorAll('.refund-free_text');


let tooltipElem;
// add tooltip
document.onmouseover = function (event) {
  const target = event.target.closest('span');

  // check if tip exists
  const tooltipText = target?.dataset.tooltipText;
  if (!tooltipText) return;

  // create element, add classes

  tooltipElem = document.createElement('div');
  tooltipElem.classList.add('tooltip');
  if (target.hasAttribute('data-tooltip-type')) {
    tooltipElem.classList.add(`tooltip__${target.dataset.tooltipType}`);
  }
  if (target.dataset.tooltipType === 'store-rights') {
    const complexTooltipText = target.dataset.tooltipText.split('br');
    complexTooltipText.forEach((string) => {
      const innerElem = document.createElement('p');
      innerElem.textContent = string;
      tooltipElem.append(innerElem);
    });
  } if (target.dataset.tooltipType === 'old-price') {
    const complexTooltipText = target.dataset.tooltipText.split('br');
    const [text1, val1, text2, val2] = complexTooltipText;
    const innerElem1 = document.createElement('div');
    const div1 = document.createElement('div');
    div1.textContent = text1;
    const div2 = document.createElement('div');
    div2.textContent = val1;
    innerElem1.append(div1);
    innerElem1.append(div2);
    tooltipElem.append(innerElem1);
    const innerElem2 = document.createElement('div');
    const div3 = document.createElement('div');
    div3.textContent = text2;
    const div4 = document.createElement('div');
    div4.textContent = val2;
    innerElem2.append(div3);
    innerElem2.append(div4);
    tooltipElem.append(innerElem2);
  } else {
    tooltipElem.textContent = tooltipText;
  }

  document.body.append(tooltipElem);

  // positioning tooltip element under the target element
  const coords = target.getBoundingClientRect();

  let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
  if (left < 0) left = 0; // do not cross the left border of the document

  // top coord of target element + target height + 6px padding = tooltip under the target
  const top = coords.top + target.offsetHeight + 6;

  tooltipElem.style.left = `${left}px`;
  tooltipElem.style.top = `${top}px`;
  const tooltipCoords = tooltipElem.getBoundingClientRect();

  // do not cross the right border of the document
  if (tooltipCoords.right > document.body.clientWidth) {
    tooltipElem.style.left = `${document.body.clientWidth - tooltipElem.offsetWidth}px`;
  }
  // if a tooltip element crosses and therefore is cut by the bottom border of the document
  // display the tooltip above the target element
  if (window.innerHeight - tooltipCoords.top < tooltipElem.offsetHeight) {
    console.log(tooltipElem.style.top);
    tooltipElem.style.top = `${coords.top - tooltipElem.offsetHeight - 6}px`;
    console.log(tooltipElem.style.top);
  }
};

// remove tooltip
document.onmouseout = function (e) {
  if (tooltipElem) {
    tooltipElem.remove();
    tooltipElem = null;
  }
};

refundFreeElements.forEach((refundEl) => {
  refundEl.dataset.tooltipType = 'refund';
  refundEl.dataset.tooltipText = 'Если товары вам не подойдут, мы вернем их обратно на склад — это бесплатно';
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (e) => {
    console.log(e.target, e.target.id);
    if (e.target.id == 'pay-instant') {
      buttonOrder.textContent = e.target.checked ? `Оплатить ${totalCost.textContent}` : 'Заказать';
    }
    if (e.target.id === 'select-all') {
      checkboxes.forEach((checkbox) => {
        if (checkbox.id === 'pay-instant') {
          return;
        }
        if (e.target.checked) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      })
    }
  });
});

const objects = {
  inStockBasket,
  outStockBasket,
};

const basketHeaders = {
  inStockBasket: document.querySelector('#inStockBasket'),
};

input.addEventListener('focus', (e) => {
  e.preventDefault();
  searchContainer.classList.add('header__search_active');
  searchContainer.classList.remove('header__search_hover');
  searchIcon.classList.add('search__icon_active');
});

input.addEventListener('blur', (e) => {
  e.preventDefault();
  searchContainer.classList.remove('header__search_active');
  searchContainer.classList.add('header__search_hover');
  searchIcon.classList.remove('search__icon_active');
});

searchIcon.addEventListener('click', (e) => {
  if (input.value === '') {
    alert('Тут пусто, братец!');
  } else {
    alert(`Конечно же такой замечательной вещи как "${input.value}" не найдено, это же макет!`);
  }
});

arrowToggleButton.forEach((button) => {
  button.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    const button = this;
    const typeOfBasket = button.dataset.basketType;
    button.classList.toggle('accordion_opened');
    objects[typeOfBasket].forEach((basket) => {
      if (!button.classList.contains('accordion_opened')) {
        basket.style.maxHeight = '0';
        if (basketHeaders.hasOwnProperty(typeOfBasket)) {
          basketHeaders[typeOfBasket].style.display = 'none';
          totalGoods.style.display = 'block';
        }
      } else {
        if (basketHeaders.hasOwnProperty(typeOfBasket)) {
          basketHeaders[typeOfBasket].style.display = 'flex';
          totalGoods.style.display = 'none';
        }
        basket.style.maxHeight = '574px';
      }
    });
  };
});

// arrowToggleButton.forEach((button) => {
//     button.addEventListener("click", (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         const button = this.tagName;
//         console.log(button)
//         // button.classList.toggle("active");
//     })
// });

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value === '') {
    alert('Тут пусто, братец!');
  } else {
    alert(`Конечно же такой замечательной вещи как "${input.value}" не найдено, это же макет!`);
  }
});

let keyCode;
function mask(event) {
  event.keyCode && (keyCode = event.keyCode);
  const pos = this.selectionStart;
  if (pos < 3) event.preventDefault();
  const matrix = '+7 (___) ___ __ __';
  let i = 0;
  const def = matrix.replace(/\D/g, '');
  const val = this.value.replace(/\D/g, '');
  let new_value = matrix.replace(/[_\d]/g, (a) => (i < val.length ? val.charAt(i++) || def.charAt(i) : a));
  i = new_value.indexOf('_');
  if (i != -1) {
    i < 5 && (i = 3);
    new_value = new_value.slice(0, i);
  }
  let reg = matrix.substr(0, this.value.length).replace(
    /_+/g,
    (a) => `\\d{1,${a.length}}`,
  ).replace(/[+()]/g, '\\$&');
  reg = new RegExp(`^${reg}$`);
  if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
  if (event.type == 'blur' && this.value.length < 5) this.value = '';
}

const inp = document.querySelector('#phone');

inp.addEventListener('input', mask, false);
inp.addEventListener('focus', mask, false);
inp.addEventListener('blur', mask, false);
inp.addEventListener('keydown', mask, false);

inp.addEventListener('input', (e) => {
  console.log(e.target.value.length);
});

const backdrop = document.querySelector('#modal-backdrop');
document.addEventListener('click', modalHandler);

function modalHandler(evt) {
  const modalBtnOpen = evt.target.closest('.js-modal');
  if (modalBtnOpen) {
    const modalSelector = modalBtnOpen.dataset.modal;
    console.log(modalSelector);
    showModal(document.querySelector(modalSelector));
  }

  const modalBtnClose = evt.target.closest('.modal-close');
  if (modalBtnClose) { // close btn click
    evt.preventDefault();
    hideModal(modalBtnClose.closest('.modal-window'));
  }

  if (evt.target.matches('#modal-backdrop')) { // backdrop click
    hideModal(document.querySelector('.modal-window.show'));
  }
}

function showModal(modalElem) {
  modalElem.classList.add('show');
  backdrop.classList.remove('hidden');
}

function hideModal(modalElem) {
  modalElem.classList.remove('show');
  backdrop.classList.add('hidden');
}

runApp();
