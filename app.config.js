module.exports = {
  ...require('./app.json').expo,
  web: {
    ...require('./app.json').expo.web,
    bundler: 'metro',
  },
};
