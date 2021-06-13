import axios from "../components/axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CheckoutProduct from "../components/CheckoutProduct";
import { getBasketTotal } from "../components/reducer";
import { useStateValue } from "../components/StateProvider";
import "../css/Payment.css";
import { db } from "../firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    const getClientSecret = async () => {
      // const response = await axios({
      //   method: "post",
      //   url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      // });
      // setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    const paymentIntent = {
      id: "1321231",
      amaunt: "1212",
      created: "11.01.1111",
    };
    //const payload = await stripe
    setSucceeded(true);
    setError(null);
    setProcessing(false);

    db.collection("users")
      .doc(user?.uid)
      .collection("orders")
      .doc(paymentIntent.id)
      .set({
        basket: basket,
        amaunt: paymentIntent.amaunt,
        created: paymentIntent.created,
      });

    dispatch({
      type: "EMPTY_BASKET",
    });

    history.replace("/orders");
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email} </p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket?.map((item) => (
              <CheckoutProduct
                key={item?.id}
                id={item?.id}
                title={item?.title}
                image={item?.image}
                currencyType={item?.currencyType}
                price={item?.price}
                rating={item?.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <input onChange={handleChange} type="text" />

              <div className="payment__priceContainer">
                <h3>Order Total: {getBasketTotal(basket)}</h3>
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"} </span>
                </button>
              </div>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
