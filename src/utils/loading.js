const startLoading = () => {
    const h = ['|', '/', '-', '\\'];
    let i = 0;

    return setInterval(() => {
        i = (i > 3) ? 0 : i;
        console.clear();
        console.log(h[i]);
        i++;
    }, 300);
};

const stopLoading = (interval) => clearInterval(interval);

// const i = startLoading();
// stopLoading(i);

module.exports = {
    stopLoading,
    startLoading,
};
