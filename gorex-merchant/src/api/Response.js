const Response = (success, data, message) => {
  return {
    data,
    success,
    message,
  };
};

export default Response;
