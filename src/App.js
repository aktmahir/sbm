import React, { useEffect } from "react";
import "./css/App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProductList from "./pages/ProductList";
import ProductView from "./pages/ProductView";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import { useStateValue } from "./components/StateProvider";
import Dashboard from "./dashbord/Dashboard";

function App() {
  const [{ reload, user, adminArr }, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      // console.log("The user is >>>", authUser);
      if (authUser) {
        // user logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //user logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);
  useEffect(() => {
    getDataOnlyOnce();
  }, [reload]);

  const getDataOnlyOnce = () => {
    let a,
      b,
      c = false;
    if (reload) {
      db.collection("products")
        .get()
        .then((querySnapshot) => {
          let array = [];
          querySnapshot.forEach((doc) => {
            let newElement = { id: doc.id, data: doc.data() };
            array.push(newElement);
          });
          dispatch({ type: "SET_PRODUCTS", products: array });
        })
        .catch((err) => {
          console.log(err);
        });
      db.collection("categories")
        .get()
        .then((querySnapshot) => {
          let array = [];
          querySnapshot.forEach((doc) => {
            let newElement = { id: doc.id, data: doc.data() };
            array.push(newElement);
          });
          dispatch({ type: "SET_CATEGORIES", categories: array });
        })
        .catch((err) => {
          console.log(err);
        });
      db.collection("sub_categories")
        .get()
        .then((querySnapshot) => {
          let array = [];
          querySnapshot.forEach((doc) => {
            let newElement = { id: doc.id, data: doc.data() };
            array.push(newElement);
          });
          dispatch({ type: "SET_SUB_CATEGORIES", sub_categories: array });
        })
        .catch((err) => {
          console.log(err);
        });
      db.collection("category_properties")
        .get()
        .then((querySnapshot) => {
          let array = [];
          querySnapshot.forEach((doc) => {
            let newElement = { id: doc.id, data: doc.data() };
            array.push(newElement);
          });
          dispatch({
            type: "SET_CATEGORY_PROPERTIES",
            category_properties: array,
          });
        })
        .catch((err) => {
          console.log(err);
        });
      db.collection("companies")
        .get()
        .then((querySnapshot) => {
          let array = [];
          querySnapshot.forEach((doc) => {
            let newElement = { id: doc.id, data: doc.data() };
            array.push(newElement);
          });
          dispatch({ type: "SET_COMPANIES", companies: array });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    dispatch({ type: "RELOAD_FALSE" });
  };
  return (
    <Router>
      <div className="app">
        {user ? Array.isArray(adminArr) ? adminArr.includes(user?.email) ?
          <Switch>
            <Route path="/checkout">
              <Header />
              <Checkout />
              <Footer />
            </Route>
            <Route path="/payment">
              <Header />
              <Payment />
              <Footer />
            </Route>
            <Route path="/orders">
              <Header />
              <Orders />
              <Footer />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path="/aboutus">
              <Header />
              <AboutUs />
              <Footer />
            </Route>
            <Route path="/contactus">
              <Header />
              <ContactUs />
              <Footer />
            </Route>
            <Route path="/productlist">
              <Header />
              <ProductList />
              <Footer />
            </Route>
            <Route path="/productview">
              <Header />
              <ProductView />
              <Footer />
            </Route>
            <Route path="/profile">
              <Header />
              <Profile />
              <Footer />
            </Route>
            <Route path="/admin">
              <Dashboard />
            </Route>
            <Route path="/">
              <Header />
              <Home />
              <Footer />
            </Route>
          </Switch> :
          <Switch>
            <Route path="/checkout">
              <Header />
              <Checkout />
              <Footer />
            </Route>
            <Route path="/payment">
              <Header />
              <Payment />
              <Footer />
            </Route>
            <Route path="/orders">
              <Header />
              <Orders />
              <Footer />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path="/aboutus">
              <Header />
              <AboutUs />
              <Footer />
            </Route>
            <Route path="/contactus">
              <Header />
              <ContactUs />
              <Footer />
            </Route>
            <Route path="/productlist">
              <Header />
              <ProductList />
              <Footer />
            </Route>
            <Route path="/productview">
              <Header />
              <ProductView />
              <Footer />
            </Route>
            <Route path="/profile">
              <Header />
              <Profile />
              <Footer />
            </Route>
            <Route path="/admin">
              <Dashboard />
            </Route>
            <Route path="/">
              <Header />
              <Home />
              <Footer />
            </Route>
          </Switch> :
          <Switch>
            <Route path="/checkout">
              <Header />
              <Checkout />
              <Footer />
            </Route>
            <Route path="/payment">
              <Header />
              <Payment />
              <Footer />
            </Route>
            <Route path="/orders">
              <Header />
              <Orders />
              <Footer />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path="/aboutus">
              <Header />
              <AboutUs />
              <Footer />
            </Route>
            <Route path="/contactus">
              <Header />
              <ContactUs />
              <Footer />
            </Route>
            <Route path="/productlist">
              <Header />
              <ProductList />
              <Footer />
            </Route>
            <Route path="/productview">
              <Header />
              <ProductView />
              <Footer />
            </Route>
            <Route path="/profile">
              <Header />
              <Profile />
              <Footer />
            </Route>
            <Route path="/admin">
              <Dashboard />
            </Route>
            <Route path="/">
              <Header />
              <Home />
              <Footer />
            </Route>
          </Switch> :
          <Switch>
            <Route path="/checkout">
              <Header />
              <Checkout />
              <Footer />
            </Route>
            <Route path="/payment">
              <Header />
              <Payment />
              <Footer />
            </Route>
            <Route path="/orders">
              <Header />
              <Orders />
              <Footer />
            </Route>
            <Route path="/login">
              <Login />
              <Footer />
            </Route>
            <Route path="/aboutus">
              <Header />
              <AboutUs />
              <Footer />
            </Route>
            <Route path="/contactus">
              <Header />
              <ContactUs />
              <Footer />
            </Route>
            <Route path="/productlist">
              <Header />
              <ProductList />
              <Footer />
            </Route>
            <Route path="/productview">
              <Header />
              <ProductView />
              <Footer />
            </Route>
            <Route path="/profile">
              <Header />
              <Profile />
              <Footer />
            </Route>
            <Route path="/admin">
              <Dashboard />
            </Route>
            <Route path="/">
              <Header />
              <Home />
              <Footer />
            </Route>
          </Switch>}

      </div>
    </Router>
  );
}

export default App;
