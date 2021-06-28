import React from "react";
import "../css/Footer.css";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import InstagramIcon from "@material-ui/icons/Instagram";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import YouTubeIcon from "@material-ui/icons/YouTube";
import RoomIcon from "@material-ui/icons/Room";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-distributed">
      <div className="footer-left">
        <Link className={{ textDecoration: "none" }} to="/">
          <img className="header__logo" src="logo.jpg" alt="Logo" />
          <h3>
            Ser&Bir<span>Makine</span>
          </h3></Link>

        <p className="footer-links">
          <Link to="/">Anasayfa</Link>
          <Link to="/productlist">Ürünlerimiz</Link>
          <Link to="/aboutus">Hakkımızda</Link>
          <Link to="/contactus">Bize Ulaşın</Link>
        </p>

        <p className="footer-company-name">© 2021 Mahir Aktaş</p>
      </div>

      <div className="footer-center">
        <div>
          <RoomIcon />
          <p>
            <span>Nato Yolu Cad. No: 42/1</span>
            Ümraniye, İstanbul, Türkiye
          </p>
        </div>

        <div>
          <PhoneIcon />
          <p>+90 531 839 54 15</p>
        </div>
        <div>
          <EmailIcon className="footer_email" />
          <p>
            <a href="mailto:support@eduonix.com">info@serbirmakina.com</a>
          </p>
        </div>
      </div>
      <div className="footer-right">
        <p className="footer-company-about">
          <span>Hakkımızda</span>
          We offer training and skill building courses across Technology,
          Design, Management, Science and Humanities.
        </p>
        <div className="footer-icons">
          <a href="#">
            <FacebookIcon />
          </a>
          <a href="#">
            <TwitterIcon />
          </a>
          <a href="#">
            <InstagramIcon />
          </a>
          <a href="#">
            <LinkedInIcon />
          </a>
          <a href="#">
            <YouTubeIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
