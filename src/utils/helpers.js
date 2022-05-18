exports.isInThePast = (date) => {
  const today = new Date();

  return date < today;
}