import Head from "next/head";

// ====================================================================

// ====================================================================

const SEO = ({ title, description, sitename = "Admin Panel of Lensify" }) => {
  return (
    <Head>
      <title>{`${title} | ${sitename}`}</title>
      <meta name="description" content={description} />
    </Head>
  );
};
export default SEO;
