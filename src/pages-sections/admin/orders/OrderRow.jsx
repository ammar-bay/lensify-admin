import { Delete, RemoveRedEye } from "@mui/icons-material";
import { format } from "date-fns";
import { currency } from "lib";
import {
  StatusWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents";
import Eye from "components/icons/Eye";
import { useRouter } from "next/router";

// ========================================================================

// ========================================================================

const OrderRow = ({ order, handleDelete }) => {
  const { totalAmount, id, orderDate, name, status, email } = order;
  const router = useRouter();

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">#{id?.slice(0, 10)}...</StyledTableCell>
      <StyledTableCell align="left">{name}</StyledTableCell>
      <StyledTableCell align="left">{email}</StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {format(new Date(orderDate), "dd MMM yyyy")}
      </StyledTableCell>

      <StyledTableCell align="left">{currency(totalAmount)}</StyledTableCell>
      {/* <StyledTableCell align="left">
        {plan?.charAt(0).toUpperCase() + plan?.slice(1)}
      </StyledTableCell>
      <StyledTableCell align="left">
        {period?.charAt(0).toUpperCase() + period?.slice(1)}
      </StyledTableCell> */}

      <StyledTableCell align="left">
        <StatusWrapper status={status}>
          {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
        </StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={() => router.push(`/admin/orders/${id}`)}>
          <RemoveRedEye />
        </StyledIconButton>
        <StyledIconButton onClick={() => handleDelete(id)}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default OrderRow;
