import React, { useEffect, useState } from "react";
import "../css/ContactUs.css";
import { useStateValue } from "../components/StateProvider";
import renderHTML from "../components/renderHTML";
import axios from "axios";


function ContactUs() {
  const [{ home }, dispach] = useStateValue();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }, []);
/////https://stackoverflow.com/questions/42995433/how-firebase-cloud-functions-handle-http-post-method
  const sendEmail = (e) => {
    e.preventDefault();
    return axios.post("https://us-central1-serbirmakina-3bbe1.cloudfunctions.net/sendEmail",{
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
   }, {
      name: name,
      email: email,
      phone: phone,
      message: message,
      subject: "Serbirmakina.com İletişim Formu",
    })
      .then((a) => {
        if (a) {
          alert("mesajınızı aldık!!!")
          return a;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return <div className="contactUs">
    <form className="contact-form" onSubmit={sendEmail}>
      <label>İsim: * </label>
      <input type="text" name="user_name" required onChange={(e) => setName(e.target.value)} value={name} />
      <label>Telefon: * </label>
      <input type="tel" name="contact_number" required onChange={(e) => setPhone(e.target.value)} value={phone} />
      <label>Email: </label>
      <input type="email" name="user_email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <label>Mesajınız: *</label>
      <textarea name="message" required onChange={(e) => setMessage(e.target.value)} value={message} />
      <input type="submit" value="Send" />
    </form>
    {renderHTML(home.data.contactUsContent)}
  </div>;
}

export default ContactUs;
