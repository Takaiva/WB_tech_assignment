import _ from 'lodash';
import * as yup from 'yup';

export default (elements, state) => (path, value) => {

  const validateInput = (value, type) => {
    const types = {
      firstname: yup.string().required('Укажите имя'),
      lastname: yup.string().required('Введите фамилию'),
      phone: yup.string().min(18, 'Формат: +9 (999) 999 99 99').max(30).required('Укажите номер телефона'),
      mail: yup.string().email('Проверьте адрес электронной почты').min(1).required('Укажите электронную почту'),
      postcode: yup.string().max(10, 'Максимум десять цифр').matches(/^\d+$/, 'Формат: 1234567').required('Укажите индекс'),
    };
    const schema = types[type];
    return schema.validate(value);
  };

  const formInputs = {
    firstname: document.getElementById('firstname'),
    lastname: document.getElementById('lastname'),
    mail: document.getElementById('mail'),
    phone: document.getElementById('phone'),
    postcode: document.getElementById('postcode'),
  };

  const getPriceWithIndent = (value) => {
    const stringNumbs = [...value.toString()].reverse();
    let counter = 0;
    const result = [];
    stringNumbs.forEach((num) => {
      result.push(num);
      counter += 1;
      if (counter === 3) {
        result.push(' ');
        counter = 0;
      }
    });
    return result.reverse().join('');
  }


  switch (path) {
    case 'items':
      let total = 0;
      let totalNoDiscount = 0;
      value.forEach(({id, name, oldPrice, newPrice, quantity, currency}) => {
        const parentNode = document.querySelector(`div[data-item-id="${id}"]`);
        const newPriceNode = parentNode.querySelectorAll('.good-price__new-price');
        const price = newPrice * quantity;
        newPriceNode.forEach((node) => {
          const newPriceEl = node.querySelector('p');
          const priceWithIndents = getPriceWithIndent(price);
          newPriceEl.innerHTML = `${priceWithIndents}&nbsp;`;
        });
        const oldPriceNode = parentNode.querySelectorAll('.good-price__old-price');
        const oldPriceNum = oldPrice * quantity;
        oldPriceNode.forEach((node) => {
          const oldPriceEl = node.querySelector('span');
          const oldPriceWithIndents = getPriceWithIndent(oldPriceNum);
          oldPriceEl.innerHTML = `${oldPriceWithIndents}&nbsp;сом`;
        })
        const quantityNode = parentNode.querySelector('input.count__quantity-number');
        quantityNode.value = quantity;
        total += price;
        totalNoDiscount += oldPriceNum;
      })
      const totalCostsEl = document.querySelector('.costs__total__sum');
      const totalWithIndent = getPriceWithIndent(total);
      totalCostsEl.innerHTML = `${totalWithIndent}&nbsp;сом`;

      const totalWithoutDiscountEl = document.querySelector('.costs__total__no-discount');
      const totalNoDiscountPrice = getPriceWithIndent(totalNoDiscount);
      totalWithoutDiscountEl.innerHTML = `${totalNoDiscountPrice}&nbsp;сом`;

      const totalPriceDiffEl = document.querySelector('.costs__details__total-discount');
      const diff = getPriceWithIndent(totalNoDiscount - total);
      totalPriceDiffEl.innerHTML = `–${diff}&nbsp;сом`;

      break;
    case 'errors': //show input feedback errors
      const inputIds = Object.keys(formInputs);
      inputIds.forEach((key) => {
        if (value[key] === '') {
          const input = formInputs[key];
          input.classList.remove('invalid');
          const label = document.querySelector(`label[for='${key}']`);
          label.classList.remove('invalid');
          const parent = document.querySelector(`.order-details__addressee__${key}`);
          const existingNode = parent.querySelector('.feedback-error');
          if (existingNode) existingNode.remove();
        }
      });

      const arrayErrors = Object.entries(value);
      arrayErrors.forEach(([inputId, message]) => {
        if (message !== '') {
          const input = formInputs[inputId];
          input.classList.add('invalid');
          const label = document.querySelector(`label[for='${inputId}']`);
          label.classList.add('invalid');
          const parent = document.querySelector(`.order-details__addressee__${inputId}`);
          const existingNode = parent.querySelector('.feedback-error');
          if (!existingNode) {
            const errorElement = document.createElement('div');
            errorElement.classList.add('feedback-error');
            errorElement.textContent = message;
            parent.append(errorElement);
          } else {
            existingNode.textContent = message;
          }
        }
      });

      Object.entries(formInputs).forEach(([inputId, input]) => {
        input.addEventListener('input', (e) => {
          const parent = document.querySelector(`.order-details__addressee__${inputId}`);
          const feedback = parent.querySelector('.feedback-error');
          if (!feedback) return;
          const label = document.querySelector(`label[for="${inputId}"]`);
          e.preventDefault();
          e.stopPropagation();
          const newErrors = _.clone(state.errors);
          const { value, id } = e.target;
          console.log(value, id);
          validateInput(value, id)
            .then((res) => {
              newErrors[id] = '';
              state.errors = newErrors;
              feedback.remove();
              input.classList.remove('invalid');
              label.classList.remove('invalid');
            })
            .catch((err) => {
              newErrors[id] = err.message;
              state.errors = newErrors;
            });
        });
      });
      break;
  }
};
