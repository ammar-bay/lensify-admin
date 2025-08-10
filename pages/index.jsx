const IndexPage = () => {
  return <></>;
};
export default IndexPage;

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: "/admin/orders", // Update the destination to your preferred route
      permanent: false, // true if it's a permanent redirect (301), false if temporary (302)
    },
  };
}
