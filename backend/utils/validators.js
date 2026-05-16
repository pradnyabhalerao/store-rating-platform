const nameLen = (s) => typeof s === 'string' && s.length >= 20 && s.length <= 60;
const addressLen = (s) => !s || (typeof s === 'string' && s.length <= 400);
const passwordValid = (p) => {
  if (typeof p !== 'string') return false;
  if (p.length < 8 || p.length > 16) return false;
  if (!/[A-Z]/.test(p)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) return false;
  return true;
};
const emailValid = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

exports.validateUser = (data) => {
  const errors = [];
  if (!nameLen(data.name)) errors.push('Name must be between 20 and 60 characters');
  if (!emailValid(data.email)) errors.push('Invalid email');
  if (!passwordValid(data.password)) errors.push('Password must be 8-16 chars, include uppercase and special char');
  if (!addressLen(data.address)) errors.push('Address must be at most 400 characters');
  return errors;
};

exports.passwordValid = passwordValid;
exports.emailValid = emailValid;
