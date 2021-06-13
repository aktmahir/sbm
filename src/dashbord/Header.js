import React, { useState } from "react";
import { ReactComponent as CloseMenu } from "./x.svg";
import { ReactComponent as MenuIcon } from "./menu.svg";
import { ReactComponent as Logo } from "./logo.svg";
import { Link } from "react-router-dom";

const Header = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    return (
        <div className="header">
            <div className="logo-nav">
                <div className="logo-container">
                    <Link to="/">
                        <Logo className="logo" />
                    </Link>
                </div>
                <ul className={click ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={closeMobileMenu}>
                        <Link to="#">ABOUT</Link>
                    </li>
                    <li className="option" onClick={closeMobileMenu}>
                        <Link to="#">CONTACT</Link>
                    </li>
                    <li className="option" onClick={closeMobileMenu}>
                        <Link to="#">BLOG</Link>
                    </li>

                    <li className="option mobile-option" onClick={closeMobileMenu}>
                        <Link to="#">SIGN-IN</Link>
                    </li>
                    <li className="option mobile-option" onClick={closeMobileMenu}>
                        <Link to="" className="sign-up">
                            SIGN-UP
            </Link>
                    </li>
                </ul>
            </div>
            <ul className="signin-up">
                <li className="sign-in" onClick={closeMobileMenu}>
                    <Link to="#">SIGN-IN</Link>
                </li>
                <li onClick={closeMobileMenu}>
                    <Link to="" className="signup-btn">
                        SIGN-UP
          </Link>
                </li>
            </ul>
            <div className="mobile-menu" onClick={handleClick}>
                {click ? (
                    <CloseMenu className="menu-icon" />
                ) : (
                    <MenuIcon className="menu-icon" />
                )}
            </div>
        </div>
    );
};

export default Header;
