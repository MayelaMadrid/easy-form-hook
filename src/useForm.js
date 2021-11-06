import { useState } from 'react';
import { validations, patterns, masks } from './validations';

const createObjectErrors = (errors) => Object.fromEntries(
  Object.entries(errors)
    .map(([key]) => [key, { message: '' }]));

const useForm = ({ initialValues, validation }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(createObjectErrors(initialValues));

  const validateAll = (e) => {
    let flag = false;
    const error = {};
    const { id, value } = e.target;
    Object.keys(validation[id]).forEach((rule) => {
      if (rule && rule !== 'pattern') {
        const { message, value: valueRule } = validation[id][rule];
        const ruleValue = rule === 'equalsTo' ? values[valueRule] : valueRule;
        const { isValid } = validations[rule](
          value || '',
          typeof ruleValue !== 'boolean' ? ruleValue : undefined
        );
        if (!isValid) {
          flag = message;
        }
      }
    });
    error[id] = {
      message: flag,
    };
    return error;
  };

  const handleKeyPress = (e) => {
    const { id } = e.target;
    const type = validation[id].pattern;
    return patterns[type](e);
  };

  const handleChange = (e) => {
    let { value } = e.target;
    if (masks[validation[e.target.id]?.pattern]) {
      value = masks[validation[e.target.id]?.pattern](value);
    }
    const error = validateAll(e);
    setErrors({ ...errors, ...error });
    setValues({
      ...values,
      [e.target.id]: value,
    });
  };

  const handleChangeMultiple = (e) => {
    const { value, id } = e.target;
    let newValues = [...values[id], value];
    if (values[id].includes(value)) {
      newValues = values[id].filter((idx) => idx !== value);
    }
    e.target.value = newValues;
    const error = validateAll(e);
    setErrors({ ...errors, ...error });
    setValues({
      ...values,
      [id]: newValues,
    });
  };

  const handleFocus = (e) => {
    let { value } = e.target;
    if (validation[e.target.id]?.pattern === 'currency') {
      value = masks.currency(value);
      setValues({
        ...values,
        [e.target.id]: value,
      });
    }
  };

  const handleBlur = (e) => {
    let value = values[e.target.id];
    if (validation[e.target.id]?.pattern === 'currency') {
      value = masks.currencyWithMoney(value);
      setValues({
        ...values,
        [e.target.id]: value,
      });
    }
    e.target.value = value;
    const error = validateAll(e);
    setErrors({ ...errors, ...error });
  };
  const isThereAnError = () => {
    const errorsArray = Object.values(errors)
    if (errorsArray.length)
      return errorsArray.every(err => typeof err.message === 'boolean')
    return true
  }

  return {
    handleChange,
    handleChangeMultiple,
    handleKeyPress,
    handleBlur,
    handleFocus,
    values,
    errors,
  };
};

export default useForm;
