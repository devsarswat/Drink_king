import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import axios from 'axios';
import Config from '../../Config';
import { Button } from '@mui/material';

const BuyNowButton = ({ user, variety }) => {
  const handleBuyNow = () => {
    const currentDate = new Date();
    const generatedUuid = uuidv4();
    const truncatedUuid = generatedUuid.slice(0, 5);
    const usercart = {
      id: truncatedUuid,
      userid: user.id,
      date: currentDate,
      ...variety,
    };

    toast(
      <div>
        <p>Are you sure to order this product?</p>
        <button
          onClick={() => {
            axios
              .post(Config.apikeyorder, usercart)
              .then((res) => {
                console.log(res);
                toast.success('Your product added successfully');
              })
              .catch((error) => {
                console.log(error);
                toast.error("Pleas Try Again")
              });
            toast.dismiss();
          }}
          className="btn btn-primary"
        >
          Yes
        </button>
        <button
          onClick={() => {
            console.log('Product addition canceled');
            toast.dismiss();
          }}
          className="btn btn-secondary mx-2"
        >
          Cancel
        </button>
      </div>,
      {
        closeButton: false,
        hideProgressBar: true,
        draggable: false,
        pauseOnHover: true,
        autoClose: false,
      }
    );
  };

  return (
    <Button onClick={handleBuyNow}  variant="contained"
    color="primary"
    className="buy-now-button my-2 mx-2">
      Buy Now
    </Button>
  );
};

export default BuyNowButton;
