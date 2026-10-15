import SahkosopimuksetPage, { metadata as sahkosopimuksetMetadata } from "./sahkosopimukset/page";

export const metadata = {
  ...sahkosopimuksetMetadata,
  alternates: { canonical: "/" },
  openGraph: {
    ...sahkosopimuksetMetadata.openGraph,
    url: "/",
  },
};

export default SahkosopimuksetPage;
