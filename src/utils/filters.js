const getFiltersData = (props) => {
  const {
    min_summa = 0,
    max_summa = 520,
    action = 'get_poducts',
    cat_id = 180,
    page = 1,
    dateObj = new Date().toString(),
    catFilter,
  } = props;

  const result = [
    {
      min_summa,
    },
    {
      max_summa,
    },
    {
      action,
    },
    {
      cat_id,
    },
    {
      page,
    },
    {
      dateObj,
    },
  ];

  console.log(catFilter);

  if (catFilter) {
    result.push(catFilter);
  }

  if (props['7day']) {
    result.push({ '7day': 'yes' });
  }

  if (props['2day']) {
    result.push({ '2day': 'yes' });
  }

  return result;
};

module.exports = {
  getFiltersData,
};
