// Password validation function
function validatePassword(password) {
  const minLength = 8;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
  const spaceRegex = /\s/;

  // Check minimum length
  if (password.length < minLength) {
    return "Password must be at least " + minLength + " characters long.";
  }

  // Check uppercase letters
  if (!uppercaseRegex.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  // Check lowercase letters
  if (!lowercaseRegex.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  // Check numbers
  if (!numberRegex.test(password)) {
    return "Password must include at least one number.";
  }

  // Check special characters
  if (!specialCharRegex.test(password)) {
    return "Password must include at least one special character.";
  }

  // Check for spaces
  if (spaceRegex.test(password)) {
    return "Password cannot contain spaces.";
  }

  // If all checks pass, the password is valid
  return null;
}

module.exports = { validatePassword };
