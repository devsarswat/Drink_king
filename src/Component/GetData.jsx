import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { Acontext } from "../App";
import axios from "axios";
import Popup from "./Popup";
import Config from "../Config";
import { useNavigate } from "react-router-dom";
import BuyNowButton from "./Action/BuyNowButton";
import AddToCartButton from "./Action/AddToCartButton";

const ITEMS_PER_PAGE = 6;

const GetData = () => {
  const { search, setCartItems, isLogin, user, setproduct } =
    useContext(Acontext);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredVarieties, setFilteredVarieties] = useState([]);
  const [sortType, setSortType] = useState(null);
  const [data, setdata] = useState([]);
  const [selectedcard, setselectedcard] = useState();
  const nevigate = useNavigate();

  useEffect(() => {
    axios.get(Config.apikeydata).then((res) => {
      setdata([...res.data.Teadata, ...res.data.varieties]);
    });
  }, [setdata]);

  useEffect(() => {
    const searchQuery = search ? search.toString().toLowerCase() : "";

    let filteredData = data.filter((variety) =>
      variety.name.toLowerCase().includes(searchQuery)
    );

    if (sortType) {
      filteredData = filteredData.filter(
        (variety) => variety.strength === sortType
      );
    }

    setFilteredVarieties(filteredData);
    setCurrentPage(1);
  }, [search, sortType, data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (type) => {
    setSortType((prevSortType) => (prevSortType === type ? null : type));
  };

  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedVarieties = filteredVarieties.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleOpenPopup = (variety) => {
    setselectedcard(variety);
  };
  const handleClosePopup = () => {
    setselectedcard(null);
  };
  const handlePeoduct = (variety) => {
    setproduct(variety);
    nevigate("/productdetail");
  };

  return (
    <div className="Sbar">
      <div className="d-flex justify-content-center">
        <div className="button-container">
          <Button
            variant="contained"
            color="warning"
            className={sortType === "Light" ? "active-button" : ""}
            onClick={() => handleSort("Light")}
            style={{ margin: 10 }}
          >
            Light
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={sortType === "Medium" ? "active-button" : ""}
            onClick={() => handleSort("Medium")}
            style={{ margin: 10 }}
          >
            Medium
          </Button>
          <Button
            variant="contained"
            color="warning"
            className={sortType === "Strong" ? "active-button" : ""}
            onClick={() => handleSort("Strong")}
          >
            Strong
          </Button>
        </div>
      </div>

      <div className="card-container">
        {displayedVarieties.map((variety, index) => (
          <Card key={index} className="card">
            <CardMedia
              component="img"
              height="140"
              image={variety.image}
              alt={variety.name}
              onClick={() => handleOpenPopup(variety)}
            />
            <CardContent>
              <div onClick={() => handlePeoduct(variety)}>
                <Typography variant="h5" component="div">
                  {variety.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {variety.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="my-2"
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "15px",
                    }}
                  >
                    ₹ {variety.price}
                  </span>
                </Typography>
              </div>
              {isLogin && <BuyNowButton user={user} variety={variety} />}
              <AddToCartButton user={user} variety={variety} setCartItems={setCartItems} quantity={1} disabled={!isLogin}/>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pagination-container">
        {Array.from(
          { length: Math.ceil(filteredVarieties.length / ITEMS_PER_PAGE) },
          (_, index) => (
            <Button
              key={index}
              variant={index + 1 === currentPage ? "contained" : "outlined"}
              onClick={() => handlePageChange(index + 1)}
              className="pagination-button"
            >
              {index + 1}
            </Button>
          )
        )}
      </div>
      <Popup variety={selectedcard} onClose={handleClosePopup} />
    </div>
  );
};

export default GetData;
