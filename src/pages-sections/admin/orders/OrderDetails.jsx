import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, H6, Paragraph, Span } from "components/Typography";
import { format } from "date-fns";
import { currency } from "lib";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
// ===================================================================

const OrderDetails = ({ order }) => {
  console.log(order);
  const [status, setStatus] = useState(order.status);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleSaveChanges = async () => {
    if (status === order.status) return;
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + `/order/${order.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        enqueueSnackbar("Order status updated successfully", {
          variant: "success",
        });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to update the order status", {
        variant: "error",
      });
    }
    // router.push("/admin/orders");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          sx={{
            p: 3,
          }}
        >
          <Grid container spacing={0}>
            <Grid item sm={6} xs={12}>
              <Paragraph>
                <Span color="grey.600">Order ID: </Span>
                <b>{order._id}</b>
              </Paragraph>

              <Paragraph>
                <Span color="grey.600">Placed on: </Span>
                <b>{format(new Date(order.timestamp), "dd MMM, yyyy")}</b>
              </Paragraph>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paragraph>
                <Span color="grey.600">Customer Name: </Span>{" "}
                <b>{order.orderDetails.name}</b>
              </Paragraph>
              <Paragraph>
                <Span color="grey.600">Customer Email: </Span>{" "}
                <b>{order.orderDetails.email}</b>
              </Paragraph>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Paragraph>
                <Span color="grey.600">Contact Info:</Span>{" "}
                <b>{order.orderDetails.contact}</b>
              </Paragraph>
            </Grid>
          </Grid>

          <FlexBox
            gap={3}
            my={3}
            flexDirection={{
              sm: "row",
              xs: "column",
            }}
          >
            {/* <TextField
              fullWidth
              color="info"
              size="medium"
              variant="outlined"
              label="Add Product"
              placeholder="Type product name"
              value={order?.orderDetails?.name}
              disabled
            /> */}

            <TextField
              select
              // fullWidth
              color="info"
              size="medium"
              defaultValue={order.status}
              label="Order Status"
              inputProps={{
                IconComponent: () => (
                  <KeyboardArrowDown
                    sx={{
                      color: "grey.600",
                      mr: 1,
                    }}
                  />
                ),
              }}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              value={status}
            >
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </FlexBox>

          {order?.cart?.map((item, index) => (
            <Box
              my={2}
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  md: "1fr 1fr",
                  xs: "1fr",
                },
                gap: 2,
                p: 2,
                borderTop: "1px solid #e0e0e0",
                // borderRadius: "8px",
              }}
            >
              {/* LEFT SIDE: Product */}
              <FlexBox flexShrink={0} gap={1.5} alignItems="center">
                <Avatar
                  src={item.imgUrl}
                  sx={{
                    height: 64,
                    width: 64,
                    borderRadius: "8px",
                  }}
                />
                <Box>
                  <H6 mb={1}>{item.name}</H6>
                  <FlexBox alignItems="center" gap={1}>
                    <Paragraph fontSize={14} color="grey.900">
                      <b>{currency(item.price)} x</b>
                    </Paragraph>
                    <Paragraph fontSize={14} color="grey.900">
                      <b>{item.qty}</b>
                    </Paragraph>
                  </FlexBox>
                </Box>
              </FlexBox>

              {/* RIGHT SIDE: Lens Details */}
              <Box>
                <Paragraph fontSize={14} color="grey.600" mb={1}>
                  <b>Lens Details</b>
                </Paragraph>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  {/* Left Column: Category, Type, Laser */}
                  <Box component="dl" sx={{ m: 0 }}>
                    <FlexBox gap={1} mb={0.5}>
                      <Span color="grey.900" sx={{ minWidth: "120px" }}>
                        Category:
                      </Span>
                      <Span>{item.lensCat}</Span>
                    </FlexBox>
                    <FlexBox gap={1} mb={0.5}>
                      <Span color="grey.900" sx={{ minWidth: "120px" }}>
                        Type:
                      </Span>
                      <Span>{item.lensType}</Span>
                    </FlexBox>
                    <FlexBox gap={1} mb={0.5}>
                      <Span color="grey.900" sx={{ minWidth: "120px" }}>
                        Laser:
                      </Span>
                      <Span>
                        {item.lasserToggle === "false" ? "No" : "Yes"}
                      </Span>
                    </FlexBox>
                  </Box>

                  {/* Right Column: Prescription Details */}
                  <Box>
                    {item.lensType === "Eyesight" && (
                      <>
                        {item.presDetails.type === "Upload Card" ? (
                          <Box>
                            <Span color="grey.900">Prescription Card:</Span>
                            <br />
                            <img
                              src={item.presDetails.prescriptionFileBase64}
                              alt="Prescription Card"
                              width={100}
                              height={100}
                              style={{ borderRadius: "4px", marginTop: "4px" }}
                            />
                          </Box>
                        ) : (
                          <>
                            <FlexBox gap={1} mb={0.5}>
                              <Span color="grey.900" sx={{ minWidth: "120px" }}>
                                Sphere:
                              </Span>
                              <Span>{item.presDetails.sphere}</Span>
                            </FlexBox>
                            <FlexBox gap={1} mb={0.5}>
                              <Span color="grey.900" sx={{ minWidth: "120px" }}>
                                Axis:
                              </Span>
                              <Span>{item.presDetails.axis}</Span>
                            </FlexBox>
                            <FlexBox gap={1} mb={0.5}>
                              <Span color="grey.900" sx={{ minWidth: "120px" }}>
                                Cylinder:
                              </Span>
                              <Span>{item.presDetails.cylinder}</Span>
                            </FlexBox>
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <TextField
            rows={5}
            multiline
            fullWidth
            color="info"
            variant="outlined"
            label="Shipping Address"
            defaultValue={order?.orderDetails?.address}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              // mb: 4,
              "& .MuiInputBase-input": {
                fontSize: 14,
                WebkitTextFillColor: "black", // ensures disabled text is black in WebKit browsers
                "-webkit-text-fill-color": "black",
                color: "black",
              },
              "& .MuiInputLabel-root": {
                color: "black", // label color when not focused
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // label color when focused
              },
            }}
          />

          {/* <TextField
            rows={5}
            multiline
            fullWidth
            color="info"
            variant="outlined"
            label="Customer’s Note"
            defaultValue="Please deliver ASAP."
            disabled
            sx={{
              mb: 4,
              "& .MuiInputBase-input": {
                fontSize: 14,
                WebkitTextFillColor: "black", // ensures disabled text is black in WebKit browsers
                color: "black",
              },
              "& .MuiInputLabel-root": {
                color: "black", // label color when not focused
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "black", // label color when focused
              },
            }}
          /> */}
        </Card>
      </Grid>

      <Grid item md={6} xs={12}>
        <Card
          sx={{
            px: 3,
            py: 4,
          }}
        >
          <H5 mt={0} mb={2}>
            Total Summary
          </H5>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">Subtotal:</Paragraph>
            <H6>
              {currency(order.cart.reduce((a, b) => a + b.price * b.qty, 0))}
            </H6>
          </FlexBetween>

          <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">Shipping fee:</Paragraph>

            <FlexBox alignItems="center" gap={1} maxWidth={100}>
              <Paragraph>Rs </Paragraph>
              <Paragraph>1000</Paragraph>
              {/* <TextField
                color="info"
                defaultValue={10}
                type="number"
                fullWidth
              /> */}
            </FlexBox>
          </FlexBetween>

          {/* <FlexBetween mb={1.5}>
            <Paragraph color="grey.600">Discount(%):</Paragraph>

            <FlexBox alignItems="center" gap={1} maxWidth={100}>
              <Paragraph>$</Paragraph>
              <TextField
                color="info"
                defaultValue={order.discount}
                type="number"
                fullWidth
              />
            </FlexBox>
          </FlexBetween> */}

          <Divider
            sx={{
              my: 2,
            }}
          />

          <FlexBetween mb={2}>
            <H6>Total</H6>
            <H6>{currency(order.totalAmount)}</H6>
          </FlexBetween>

          <Paragraph>
            Payment: <b>{paymentMethods[order.paymentMethod]}</b>
          </Paragraph>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="info" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

const paymentMethods = {
  cod: "Cash on delivery",
  paypal: "Paypal",
  stripe: "Stripe",
  bankTransfer: "Bank Transfer",
  wallet: "Wallet",
  jazzcash: "JazzCash",
};

export default OrderDetails;
