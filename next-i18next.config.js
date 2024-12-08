// next-i18next.config.js
module.exports = {
  i18n: {
    locales: ["en", "mr", "hi"],
    defaultLocale: "en",
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
  reloadOnPrerender: true,
};
