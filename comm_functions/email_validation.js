// Email validation function
function validateEmail(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regular expression
  if (!emailRegex.test(email)) {
    return "Invalid email address.";
  }

  // If the email is valid, return null
  return null;
}

module.exports = { validateEmail };
