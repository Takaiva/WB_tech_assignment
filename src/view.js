import _ from 'lodash';

export default (elements, state) => (path, value) => {

    const formInputs = {
        firstname: document.getElementById('firstname'),
        lastname: document.getElementById('lastname'),
        mail: document.getElementById('mail'),
        phone: document.getElementById('phone'),
        postcode: document.getElementById('postcode'),
    };

    // elements
    switch (path) {
        case 'items':
            console.log(value)
            break;
        case 'errors':
            console.log(value);
            const inputIds = Object.keys(formInputs);
            inputIds.forEach(key => {
                if (value[key] === "") {
                    const input = formInputs[key];
                    input.classList.remove('invalid');
                    const label = document.querySelector("label[for='" + key + "']");
                    label.classList.remove('invalid');
                    const parent = document.querySelector(`.order-details__addressee__${key}`);
                    const existingNode = parent.querySelector('.feedback-error');
                    if (!!existingNode) existingNode.remove();
                }
            });

            const arrayErrors = Object.entries(value);
            arrayErrors.forEach(([inputId, message]) => {
                if (message !== "") {
                    const input = formInputs[inputId];
                    input.classList.add('invalid');
                    const label = document.querySelector("label[for='" + inputId + "']");
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

            })
            break;
    }
}
