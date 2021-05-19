module.exports = {
    excludeFile: (str) => /\*.{spec,stories}.tsx?/.test(str),

    future: {
        webpack5: true,
    },
};
