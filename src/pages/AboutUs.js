import React from "react";
import "../css/AboutUs.css";
import { useStateValue } from "../components/StateProvider";
import renderHTML from "../components/renderHTML";

function AboutUs() {
  const [{ home }, dispach] = useStateValue();
  return <div className="aboutUs">
    {renderHTML(home.data.aboutUsContent)}
  </div>;
}

export default AboutUs;
