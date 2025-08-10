import { Box, CircularProgress } from "@mui/material";
import { H3 } from "components/Typography";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import { useRouter } from "next/router";
import { OrderDetails } from "pages-sections/admin";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// =============================================================================
OrderEdit.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

export default function OrderEdit() {
  const { query } = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchorder = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          process.env.NEXT_PUBLIC_SERVER_URL + `/order/${query.id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        setOrderDetails(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch the order, please refresh to try again");
      } finally {
        setLoading(false);
      }
    };
    if (query.id) fetchorder();
  }, [query.id]);

  if (loading) {
    return <CircularProgress size={40} color="secondary" />;
  }

  return (
    <Box py={4}>
      <H3 mb={2}>Order Details</H3>
      <OrderDetails order={orderDetails} />
    </Box>
  );
}
