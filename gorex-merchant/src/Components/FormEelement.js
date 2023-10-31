import React from "react";
import PropTypes from "prop-types";
import TextInput from "./Inputs/TextInput";
import MobilePhone from "./Inputs/MobilePhone";
const FormElement = ({index, isMobilePhone = false,
  field: {fieldType, value, id, label, xmlName, isRequired, options, regex, row, errorMessage, placeHolder, error,},
  isValid, login, onFocus, showError, showButton, errorMessages, handleChange, defaultValue, forceTitle = false, handleBlur, maxDate, minDate, disabled,
}) => {
  if (placeHolder.includes("Mobile Number") || isMobilePhone) {
    fieldType = "phoneNumber";
  }
  switch (fieldType) {
    case "text":
      return (
        <TextInput
          id={id}
          type={fieldType}
          name={xmlName}
          value={value}
          row={row}
          showError={showError}
          error={error}
          title={label}
          disabled={disabled}
          defaultValue={defaultValue}
          forceTitle={forceTitle}
          errorMessage={errorMessages[xmlName]}
          onFocus={onFocus}
          required={isRequired}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    case "textarea":
      return (
        <TextInput
          id={id}
          type={fieldType}
          name={xmlName}
          value={value}
          showError={showError}
          error={error}
          title={label}
          disabled={disabled}
          forceTitle={forceTitle}
          defaultValue={defaultValue}
          onFocus={onFocus}
          errorMessage={errorMessages[xmlName]}
          placeholder={placeHolder}
          required={isRequired}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    case "password":
      return (
        <TextInput
          id={id}
          type={fieldType}
          name={xmlName}
          value={value}
          showError={showError}
          title={label}
          error={error}
          secured
          onFocus={onFocus}
          login={login}
          forceTitle={forceTitle}
          disabled={disabled}
          errorMessage={errorMessages[xmlName]}
          placeholder={placeHolder}
          required={isRequired}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    case "date":
      return (
        <TextInput
          date
          id={id}
          type={fieldType}
          name={xmlName}
          value={value}
          error={error}
          showError={showError}
          defaultValue={defaultValue}
          options={options}
          title={label}
          minDate={minDate}
          maxDate={maxDate}
          forceTitle={forceTitle}
          disabled={disabled}
          errorMessage={errorMessages[xmlName]}
          placeholder={placeHolder}
          required={isRequired}
          onFocus={onFocus}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    case "phoneNumber":
      return (
        <MobilePhone
          select
          id={id}
          isValid={isValid}
          type={fieldType}
          name={xmlName}
          defaultValue={defaultValue}
          error={error}
          options={options}
          title={label}
          onFocus={onFocus}
          login={login}
          disabled={disabled}
          errorMessage={errorMessages[xmlName]}
          placeholder={placeHolder}
          required={isRequired}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          showError={showError}
          keyboard={'number-pad'}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    case "select":
      return (
        <TextInput
          select
          id={id}
          type={fieldType}
          name={xmlName}
          error={error}
          value={value}
          options={options}
          forceTitle={forceTitle}
          showError={showError}
          title={label}
          showButton={showButton}
          disabled={disabled}
          defaultValue={defaultValue}
          onFocus={onFocus}
          errorMessage={errorMessages[xmlName]}
          placeholder={placeHolder}
          required={isRequired}
          changeHandler={(event) => handleChange(xmlName, index, event)}
          blurHandler={(event) =>
            handleBlur(xmlName, event.target.value, regex, errorMessage)
          }
        />
      );
    default:
      return null;
  }
};

FormElement.propTypes = {
  index: PropTypes.number,
  login: PropTypes.bool,
  field: PropTypes.object,
  currentField: PropTypes.object,
  errorMessages: PropTypes.object,
  dateHandler: PropTypes.func,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default FormElement;
