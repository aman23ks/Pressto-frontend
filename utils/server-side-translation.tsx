import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getI18nProps(locale: string | undefined) {
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common"])),
    },
  };
}
