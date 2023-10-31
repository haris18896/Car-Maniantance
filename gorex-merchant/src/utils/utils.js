export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

export const getSuperModifiedValues = (values, initialValues) => {
  const modifiedValues = {};

  if (values) {
    Object.entries(values).forEach((entry) => {
      const key = entry[0];
      const value = entry[1];
      const initialValue = initialValues[key];

      if (key === "appointment_services") {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value;
        }
      } else if (Array.isArray(value) && Array.isArray(initialValue)) {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value;
        }
      } else if (
        typeof value === "object" &&
        value !== null &&
        typeof initialValue === "object" &&
        initialValue !== null
      ) {
        if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
          modifiedValues[key] = value;
        }
      } else if (value !== initialValue) {
        modifiedValues[key] = value;
      }
    });
  }

  return modifiedValues;
};
