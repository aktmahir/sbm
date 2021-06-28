import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import "../css/Login.css";
import { useStateValue } from "../components/StateProvider";

function Login() {
  const [{  }, dispach] = useStateValue();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((authen) => {
        if (authen) {
          history.push("/");
        }
      })
      .catch((error) => alert(error.message));
  };

  const register = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authen) => {
        if (authen) {
          db.collection("users")
          .add({email: email})
          .then((newUser) => {
            if(newUser){
              dispach({ type: "RELOAD_TRUE" });
              history.push("/profil");
            }
          })
          .catch((err) => {
            console.log(err);
          });
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
          alt="logo"
        />
      </Link>
      <div className="login__container">
        <h1>Sign-In</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            onClick={signIn}
            className="login__signInButton"
          >
            Sign In
          </button>
        </form>
        <p>
          By signing-in you agree to the THIS PROJECT Conditions of Use & Sale.
          Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>
        <button onClick={register} className="login__registerButton">
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
}

export default Login;
