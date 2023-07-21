import React, { useContext, useEffect, useState } from "react";
import { Acontext } from "../App";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import axios from "axios";
import Config from "../Config";
import BuyNowButton from "./Action/BuyNowButton";
import PlaceOrderButton from "./Action/PlaceOrderButton";

const Cart = () => {
  const { cartItems, setCartItems, user } = useContext(Acontext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    axios
      .get(Config.apikeycart)
      .then((res) => {
        console.log(res.data);
        setCartItems(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setCartItems]);

  useEffect(() => {
    const filteredItems = cartItems.filter((item) => item.userid === user.id);
    setFilteredItems(filteredItems);

    let calculatedTotalPrice = 0;
    let calculatedItemCount = 0;

    filteredItems.forEach((item) => {
      const itemPrice = parseFloat(item.price) * item.quantity; 
      calculatedTotalPrice += itemPrice;
      calculatedItemCount += item.quantity;
    });

    setTotalPrice(calculatedTotalPrice.toFixed(2));
    setItemCount(calculatedItemCount);
  }, [cartItems, user]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const updatedQuantity = item.quantity + 1;
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });

    axios
      .patch(`${Config.apikeycart}/${itemId}`, { quantity: updatedCartItems.find((item) => item.id === itemId).quantity })
      .then((res) => {
        console.log(res);
        setCartItems(updatedCartItems);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        const updatedQuantity = item.quantity - 1;
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });

    axios
      .patch(`${Config.apikeycart}/${itemId}`, { quantity: updatedCartItems.find((item) => item.id === itemId).quantity })
      .then((res) => {
        console.log(res);
        setCartItems(updatedCartItems);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRemoveItem = (itemId) => {
    axios
      .delete(`${Config.apikeycart}/${itemId}`)
      .then((res) => {
        console.log(res);
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderCartItems = () => {
    const uniqueItems = {};

    filteredItems.forEach((item) => {
      if (!uniqueItems[item.name]) {
        uniqueItems[item.name] = { ...item, quantity: item.quantity };
      } else {
        uniqueItems[item.name].quantity += item.quantity;
      }
    });

    return Object.values(uniqueItems).map((item, index) => (
      <Card key={index} className="card-1">
        <CardMedia
          component="img"
          height="140"
          image={item.image}
          alt={item.name}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="my-2">
            Price: ₹{parseFloat(item.price) * item.quantity}
          </Typography>
          <div className="quantity-control">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleDecreaseQuantity(item.id)}
              disabled={item.quantity === 1}
            >
              -
            </Button>
            <Typography variant="body2" className="quantity-display">
              {item.quantity}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleIncreaseQuantity(item.id)}
            >
              +
            </Button>
          </div>
          <BuyNowButton user={user} variety={item} />
          <Button
            variant="outlined"
            color="primary"
            className="add-to-cart-button"
            onClick={() => handleRemoveItem(item.id)}
          >
            Remove
          </Button>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="page-container">
      <div className="card-container-e">
        <Card sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h4" component="div">
              Shopping Cart
            </Typography>
            {cartItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Your cart is empty.
              </Typography>
            ) : (
              <div className="card-content">{renderCartItems()}</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="total-section">
        <Card sx={{ minWidth: 300 }}>
          <CardContent>
            <Typography variant="body2" className="Text-price-1">
              PRICE DETAILS
            </Typography>
            <Typography variant="body2" className="Text-price">
              Total Items: {itemCount}
            </Typography>
            <Typography variant="body2" className="Text-price">
              Total Price: ₹ {totalPrice}
            </Typography>
            <PlaceOrderButton
              filteredItems={filteredItems}
              setFilteredItems={setFilteredItems}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
