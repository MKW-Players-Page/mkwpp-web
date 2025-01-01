module.exports = {
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "sortAttrs",
    "cleanupIds",
    "cleanupAttrs",
    "convertColors",
    {
      name: "prefixIds",
      params: {
        delim: "-",
        prefix: (e) => {
          // Then manually replace in file.
          return "filePrefixHere";
        },
        prefixIds: true,
        prefixClassNames: true,
      },
    },
    "removeEmptyAttrs",
    "removeXlink",
  ],
};
