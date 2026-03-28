const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRequestsCounts = (size) => new Array(size)
  .fill(0)
  .map((item, i) => ++i);

const parseUrl = ({ host, ...props }) => ({
  ...props,
  host,
  domain: host.split('.')[0],
});

module.exports = {
  delay,
  getRequestsCounts,
  parseUrl,
};
