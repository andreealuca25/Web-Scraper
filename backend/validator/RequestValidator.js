const validator = require("validator");

const validateUrl = (url) => {
  if (!url) {
    return { error: "URL is required" };
  }

  if (!validator.isURL(url)) {
    return { error: "Invalid URL" };
  }

  return { error: "" };
};

module.exports = {
  validateUrl,
};
