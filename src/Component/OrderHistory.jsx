import React, { useContext, useEffect, useState } from "react";
import { Typography, Card, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import Config from "../Config";
import { Acontext } from "../App";

const OrderHistory = () => {
  const { user } = useContext(Acontext);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    axios
      .get(Config.apikeyorder)
      .then((res) => {
        setOrderHistory(res.data);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
      });
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    const discountAmount = (price * discount) / 100;
    const discountedPrice = price - discountAmount;
    return discountedPrice.toFixed(2);
  };

  return (
    <div className="order-history-container">
      <Typography variant="h6" className="o-heading">
        Order History
      </Typography>
      {orderHistory.length === 0 ? (
        <Typography variant="body1">No order history available.</Typography>
      ) : (
        <div className="order-history-cards">
          {orderHistory.map((order) => {
            if (user.id === order.userid) {
              const orderDate = new Date(order.date);
              const formattedDate = orderDate.toLocaleString();
              const discountedPrice = calculateDiscountedPrice(
                order.price,
                order.discount
              );

              return (
                <Card key={order.id} className="order-card">
                  <CardMedia
                    component="img"
                    height="140"
                    image={order.image}
                    alt={order.name}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      style={{ color: "black", fontWeight: "bold" }}
                    >
                      {order.name}
                    </Typography>
                    {order.discount && (
                      <>
                        <Typography
                          variant="body2"
                          className="product-discount"
                        >
                          <span style={{ fontSize: "20px", color: "red" }}>
                            -{order.discount}%{" "}
                          </span>{" "}
                          ₹{discountedPrice}
                        </Typography>
                      </>
                    )}
                    {order.discount ? (
                      <Typography variant="body2" className="product-price">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "15px",
                          }}
                        >
                          Price:{"₹"}
                        </span>
                        <span style={{ textDecoration: "line-through" }}>
                          {order.price}
                        </span>
                      </Typography>
                    ) : (
                      <Typography variant="body2" className="product-price">
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: "15px",
                          }}
                        >
                          Price: ₹
                        </span>{" "}
                        {order.price}
                      </Typography>
                    )}
                    <Typography variant="body1">
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "15px",
                        }}
                      >
                        Order Date:
                      </span>{" "}
                      {formattedDate}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{ position: "relative" }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "15px",
                        }}
                      >
                        {" "}
                        Order ID:
                      </span>{" "}
                      <span style={{ position: "absolute" }}>{order.id}</span>
                    </Typography>
                    <Typography variant="body1">
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "15px",
                        }}
                      >
                        Quantity:
                      </span>{" "}
                      {order.quantity ? order.quantity : 1}
                    </Typography>
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
