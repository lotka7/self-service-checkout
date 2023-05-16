export default () => ({
  denominations: [20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5],
  port: parseInt(process.env.PORT, 10) || 3000,
});
