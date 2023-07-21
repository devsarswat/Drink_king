import React, { useContext, useEffect, useState } from "react";
import { Acontext } from "../App";
import { Button, Typography } from "@mui/material";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import BuyNowButton from "./Action/BuyNowButton";
import AddToCartButton from "./Action/AddToCartButton";

const ProductDetail = () => {
  const { product, setCartItems, user, isLogin } = useContext(Acontext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const calculateDiscountedPrice = () => {
    const discountPercentage = displayedProduct.discount || 0;
    const discount = (displayedProduct.price * discountPercentage) / 100;
    const totalPrice = (displayedProduct.price - discount) * quantity;
    return totalPrice;
  };

  useEffect(() => {
    if (product) {
      localStorage.setItem("product", JSON.stringify(product));
    }
  }, [product]);

  const storedProduct = JSON.parse(localStorage.getItem("product"));

  const displayedProduct = product ? product : storedProduct;

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <>
      <div className="product-detail">
        <div className="product-image">
          <img
            src={displayedProduct.image}
            alt={displayedProduct.name}
            height={300}
            width={400}
          />
        </div>
        <div className="product-info">
          <Typography variant="h2" component="h2">
            {displayedProduct.name}
          </Typography>
          <Typography variant="body1" className="product-description">
            {displayedProduct.description}
          </Typography>
          <div className="product-details">
            <Typography variant="body2" className="product-origin">
              Origin: {displayedProduct.origin}
            </Typography>
            <Typography variant="body2" className="product-strength">
              Strength: {displayedProduct.strength}
            </Typography>
            {displayedProduct.discount && (
              <>
                <Typography variant="body2" className="product-discount">
                  <span style={{ fontSize: "20px", color: "red" }}>
                    -{displayedProduct.discount}%{" "}
                  </span>{" "}
                  ₹{calculateDiscountedPrice() / quantity}
                </Typography>
              </>
            )}
            {displayedProduct.discount ? (
              <Typography variant="body2" className="product-price">
                Price:{" "}
                <span style={{ textDecoration: "line-through" }}>
                  ₹{displayedProduct.price}
                </span>
              </Typography>
            ) : (
              <Typography variant="body2" className="product-price">
                Price: ₹{displayedProduct.price}
              </Typography>
            )}
            {quantity > 1 && (
              <Typography variant="body2" className="total-price">
                Total Price: ₹{calculateDiscountedPrice()}
              </Typography>
            )}
          </div>
          {isLogin ? (
            <>
              <div className="quantity-control">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleDecreaseQuantity}
                  disabled={quantity === 1}
                >
                  -
                </Button>
                <Typography variant="body2" className="quantity-display">
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleIncreaseQuantity}
                >
                  +
                </Button>
              </div>
              <BuyNowButton
                user={user}
                variety={displayedProduct}
                variant="contained"
                color="primary"
                className="buy-now-button my-2"
              />
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              className="buy-now-button my-2"
              onClick={() => navigate("/login")}
            >
              Buy Now
            </Button>
          )}
          <AddToCartButton
            user={user}
            variety={displayedProduct}
            setCartItems={setCartItems}
            disabled={!isLogin}
            quantity={quantity}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
