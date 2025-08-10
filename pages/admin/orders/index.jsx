import {
  Box,
  Card,
  CircularProgress,
  Stack,
  Table,
  TableContainer,
} from "@mui/material";
import TableBody from "@mui/material/TableBody";
import Scrollbar from "components/Scrollbar";
import { H3 } from "components/Typography";
import TableHeader from "components/data-table/TableHeader";
import TablePagination from "components/data-table/TablePagination";
import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import useMuiTable from "hooks/useMuiTable";
import { OrderRow } from "pages-sections/admin";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// TABLE HEADING DATA LIST
const tableHeading = [
  {
    id: "id",
    label: "Order ID",
    align: "left",
  },
  {
    id: "name",
    label: "Customer Name",
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    align: "left",
  },

  {
    id: "orderDate",
    label: "Order Date",
    align: "left",
  },
  {
    id: "totalAmount",
    label: "Total Amount",
    align: "left",
  },
  {
    id: "status",
    label: "Status",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
  },
];

// =============================================================================
OrderList.getLayout = function getLayout(page) {
  return <VendorDashboardLayout>{page}</VendorDashboardLayout>;
};
// =============================================================================

// =============================================================================

export default function OrderList({}) {
  // RESHAPE THE ORDER LIST BASED TABLE HEAD CELL ID
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/order", {
        method: "GET",
      });
      const data = await res.json();
      // console.log(data);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch Orders, something went wrong.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + `/order/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(res);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success("Order Deleted Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the order, try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders?.map((item) => ({
        id: item._id,
        orderDate: item.timestamp,
        totalAmount: item.totalAmount,
        status: item.status,
        ...item?.orderDetails,
      }))
    );
  }, [orders]);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({
    listData: filteredOrders,
    defaultSort: "purchaseDate",
    defaultOrder: "desc",
  });
  return (
    <Box py={4}>
      <div
        style={{
          display: "flex",
          gap: 15,
        }}
      >
        <H3 mb={2}>Orders</H3>
        {loading && <CircularProgress size={40} color="secondary" />}
      </div>
      <Card>
        <Scrollbar>
          <TableContainer
            sx={{
              minWidth: 900,
            }}
          >
            <Table>
              <TableHeader
                order={order}
                hideSelectBtn
                orderBy={orderBy}
                heading={tableHeading}
                numSelected={selected.length}
                rowCount={filteredList.length}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {filteredList.map((order) => (
                  <OrderRow
                    order={order}
                    key={order._id}
                    handleDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination
            onChange={handleChangePage}
            count={Math.ceil(filteredList.length / rowsPerPage)}
          />
        </Stack>
      </Card>
    </Box>
  );
}
