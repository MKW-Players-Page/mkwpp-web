module.exports = {
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "sortAttrs",
    "cleanupAttrs",
    "convertColors",
    "cleanupIds",
    {
      name: "prefixIds",
      params: {
        delim: "-",
        prefix: (e, a) => {
          const split_1 = a.path.split("/");
          return split_1[split_1.length - 1].split(".svg")[0];
        },
        prefixIds: true,
        prefixClassNames: true,
      },
    },
    "removeEmptyAttrs",
    "removeXlink",
  ],
};
