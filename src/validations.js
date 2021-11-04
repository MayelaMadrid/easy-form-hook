const getKey = (event) =>
  String.fromCharCode(!event.charCode ? event.which : event.charCode);


const regex = {
  alphanumeric: '^[A-Za-zÑñ0-9áéíóúÁÉÍÓÚ . ]+$',
  numeric: '^[0-9., ]+$',
  alphabetic: '^[A-Za-zÑñáéíóúÁÉÍÓÚ .  ]+$',
  nomask: /[A-Z,$ ]/g,
  iframeCurrency: /[A-Z,.$ ]/g,
  mobile: '^[0-9]+$',
  currency: /^\d*(\.\d{0,2})?$/,
  currencyBefore: /^\d*(\.\d{0,1})?$/,
  mask: /(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g
};

const checkEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const patterns = {
  currency: (event) => {
    const key = getKey(event)
    const { target } = event
    const value = (target.value).replace(regex.nomask, '')
    let regexCurrency = regex.currencyBefore;
    if (target.value.includes(".") && target.value.indexOf(".") >= target.selectionStart) {
      regexCurrency = regex.currency
    }

    if (!RegExp(regex.numeric).test(key) || (!value.match(regexCurrency) && key !== ".") || (value.includes(".") && key === ".")) {
      event.preventDefault();
      return false;
    }
    return true;
  },
  number: (event) => {
    if (!RegExp(regex.numeric).test(getKey(event))) {
      event.preventDefault();
      return false;
    }
    return true;
  },
  mobile: (event) => {
    if (!RegExp(regex.mobile).test(getKey(event))) {
      event.preventDefault();
      return false;
    }
    return true;
  },
  alphabetic: (event) => {
    if (!RegExp(regex.alphabetic).test(getKey(event))) {
      event.preventDefault();
      return false;
    }
    return true;
  },
  alphanumeric: (event) => {
    if (!RegExp(regex.alphanumeric).test(getKey(event))) {
      event.preventDefault();
      return false;
    }
    return true;
  },
};

const validations = {
  maxRequired: (value, max) => ({
    isValid: (value ? value.replace(regex.nomask, '') : max) <= max,
  }),
  minRequired: (value, min) => ({
    isValid: (value ? value.replace(regex.nomask, '') : min) >= min,
  }),
  maxLengthRequired: (value, max) => ({
    isValid: value.trim().length <= max,
  }),
  minLengthRequired: (value, min) => ({
    isValid: value.trim().length >= min,
  }),
  equalsTo: (value, confirm) => ({
    isValid: value === confirm,
  }),
  required: (value) => ({
    isValid: value.toString().trim().length,
  }),
  checkEmail: (value) => ({
    isValid: checkEmailRegex.test(String(value).toLowerCase())
  }),
};

const masks = {
  currency: (value) => {
    const newValue = value.replace(regex.nomask, '');
    return newValue
      ? `$${value.replace(regex.nomask, '').replace(regex.mask, '$1,')}`
      : '';
  },
  currencyWithMoney: (value) => {
    const newValue = value.replace(regex.nomask, '');
    const formated = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    return newValue ? `${formated.format(newValue)} MXN` : '';
  },
  iframeCurrency: (value) => {
    return Number(value.toString().replace(regex.iframeCurrency, '').padEnd(7, 0))
  }
};
export { validations, patterns, masks, regex };
