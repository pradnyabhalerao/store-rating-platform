const calculateAverage = (ratings) => {
  if (!ratings.length) return 0;
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return total / ratings.length;
};

module.exports = calculateAverage;
