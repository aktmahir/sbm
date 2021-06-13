import React, { useState } from "react";
import "../css/Header.css";
import SearchIcon from "@material-ui/icons/Search";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "../firebase";
import useWindowDimensions from "./useWindowDimensions";

function Header() {
  const [{ basket, user }, dispach] = useStateValue();
  const { height, width } = useWindowDimensions();
  const [toggle, setToggle] = useState(false);

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };
  return (
    <div className={width >= 520 ? "header" : "header_toggle"}>
      {width >= 520 ? (
        <>
          <Link to="/">
            <img className="header__logo" src="logo.jpg" alt="Logo" />
          </Link>

          <div className="header__search">
            <input className="header__searchInput" type="text" />
            <SearchIcon className="header__searchIcon" />
          </div>
          <div className="header__nav">
            <Link to={!user && "/login"}>
              <div onClick={handleAuthentication} className="header__option">
                <span className="header__optionLineOne">
                  Hello {!user ? "Guest" : user?.email}
                </span>
                <span className="header__optionLineTwo">
                  {user ? "SignOut" : "SignIn"}
                </span>
              </div>
            </Link>
            <Link to="/orders">
              <div className="header__option">
                <span className="header__optionLineOne">Return</span>
                <span className="header__optionLineTwo">&Orders</span>
              </div>
            </Link>
            <Link to="/productlist">
              <div className="header__option">
                <span className="header__optionLineOne">All</span>
                <span className="header__optionLineTwo">Products</span>
              </div>
            </Link>
            <Link to="/checkout">
              <div className="header__optionBasket">
                <ShoppingBasketIcon />
                <span className="header__optionLineTwo header__basketCount">
                  {basket?.length}
                </span>
              </div>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="header__toggleButton">
            <Link to="/">
              <img
                className="header__logo"
                src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                alt="Logo"
              />
            </Link>
            <div onClick={() => setToggle(!toggle)}>
              {!toggle ? <MenuIcon /> : <CloseIcon />}
            </div>
          </div>

          {toggle && (
            <>
              <div className="header__search">
                <input className="header__searchInput" type="text" />
                <SearchIcon className="header__searchIcon" />
              </div>
              <div className="header__nav">
                <Link to={!user && "/login"}>
                  <div
                    onClick={handleAuthentication}
                    className="header__option"
                  >
                    <span className="header__optionLineOne">
                      Hello {!user ? "Guest" : user?.email}
                    </span>
                    <span className="header__optionLineTwo">
                      {user ? "SignOut" : "SignIn"}
                    </span>
                  </div>
                </Link>
                <Link to="/orders">
                  <div className="header__option">
                    <span className="header__optionLineOne">Return</span>
                    <span className="header__optionLineTwo">&Orders</span>
                  </div>
                </Link>
                <div className="header__option">
                  <span className="header__optionLineOne">Your</span>
                  <span className="header__optionLineTwo">Prime</span>
                </div>
                <Link to="/checkout">
                  <div className="header__optionBasket">
                    <ShoppingBasketIcon />
                    <span className="header__optionLineTwo header__basketCount">
                      {basket?.length}
                    </span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Header;
