import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Config from '../../Config';
import { Button } from '@mui/material';

const PlaceOrderButton = ({ filteredItems, setFilteredItems }) => {
  const handleOrder = async () => {
    try {
      const orderResponses = [];
      const deleteResponses = [];

      for (const item of filteredItems) {
        const currentDate = new Date();
        const itemWithDate = { ...item, date: currentDate };

        const orderResponse = await axios.post(
          Config.apikeyorder,
          itemWithDate
        );
        orderResponses.push(orderResponse);
      }

      console.log(orderResponses);

      toast(
        <div>
          <p>Are you sure to order all these products?</p>
          <button
            onClick={async () => {
              toast.dismiss();
              const confirmation = await new Promise((resolve) => {
                resolve(true);
              });

              if (!confirmation) {
                return; 
              }

              toast.success('Your products were added successfully');

              for (const item of filteredItems) {
                const deleteResponse = await axios.delete(
                  `${Config.apikeycart}/${item.id}`
                );
                deleteResponses.push(deleteResponse);
              }

              console.log(deleteResponses);
              setFilteredItems([]);
            }}
            className="btn btn-primary"
          >
            Yes
          </button>
          <button
            onClick={() => {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      variant="contained"
      color="warning"
      className="Place-Order-button my-2"
      onClick={handleOrder}
    >
      Place Order
    </Button>
  );
};

export default PlaceOrderButton;
