import * as yup from 'yup';
import onChange from 'on-change';
import _ from "lodash";

import render from './view.js';

export default () => {
    const elements = {
        form: document.querySelector(".form-validate"),
    }

    const formInputs = {
        firstname: document.getElementById('firstname'),
        lastname: document.getElementById('lastname'),
        mail: document.getElementById('mail'),
        phone: document.getElementById('phone'),
        postcode: document.getElementById('postcode'),
    };

    const initialState = {
        items: [
            {
                id: 1,
                name: "Футболка UZcotton мужская",
                oldPrice: 1051, newPrice: 522,
                quantity: 1,
                currency: "сом"
            },
            {
                id: 2,
                name: "Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe",
                oldPrice: 11500, newPrice: 10500,
                quantity: 200,
                currency: "сом",
            },
            {
                id: 3,
                name: "Карандаши цветные Faber-Castell \"Замок\", набор 24 цвета, заточенные, шестигранные, Faber-Castell",
                oldPrice: 475, newPrice: 247,
                quantity: 2,
                currency: "сом",
            },
        ],
        totalCost: null,
        errors: {
            firstname: '',
            lastname: '',
            mail: '',
            phone: '',
            postcode: '',
        },
    }

    const state = onChange(initialState, render(elements, initialState));

    const schema = yup.object({
        firstname: yup.string().required("Укажите имя"),
        lastname: yup.string().required("Введите фамилию"),
        phone: yup.string().min(18, "Формат: +9 (999) 999 99 99").max(30).required("Укажите номер телефона"),
        mail: yup.string().email("Проверьте адрес электронной почты").min(1).required("Укажите электронную почту"),
        postcode: yup.string().max(10, "Максимум десять цифр").matches(/^\d+$/, "Формат: 1234567").required("Укажите индекс"),
    })

    const validateInputs = (obj) => {
        return schema.validate(obj, { abortEarly: false });
    };

    const validateInput = (value, type) => {
        const types = {
            firstname: yup.string().required("Укажите имя"),
            lastname: yup.string().required("Введите фамилию"),
            phone: yup.string().min(18, "Формат: +9 (999) 999 99 99").max(30).required("Укажите номер телефона"),
            mail: yup.string().email("Проверьте адрес электронной почты").min(1).required("Укажите электронную почту"),
            postcode: yup.string().max(10, "Максимум десять цифр").matches(/^\d+$/, "Формат: 1234567").required("Укажите индекс"),
        }
        const schema = types[type];
        return schema.validate(value);
    }



    elements['form'].addEventListener("submit", (e) => {
        e.preventDefault();
        const newErrors = {
            firstname: '',
            lastname: '',
            mail: '',
            phone: '',
            postcode: '',
        };
        const formData = new FormData(e.target);
        const formDataObject = Object.fromEntries(formData);
        validateInputs(formDataObject)
            .then((res) => console.log(res))
            .catch((err) => err.inner.forEach(e => {
                newErrors[e.path] = e.message;
        })).finally(() => {
            state.errors = newErrors;
        })
    });

    Object.values(formInputs).forEach((input) => {
        input.addEventListener('change', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newErrors = _.clone(state.errors);
            const { value, id } = e.target;
            if (value !== "") {
                const obj = Object.fromEntries([[id, value]]);
                validateInput(value, id)
                    .then((res) => newErrors[id] = "")
                    .catch((err) =>  {
                        newErrors[id] = err.message;
                    })
                    .finally(() => {
                        state.errors = newErrors;
                    });
            }
        })
    })


}
