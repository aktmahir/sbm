import React from "react";
import "../css/Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";

function Order({ order }) {
  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")} </p>
      <p className="order__id">
        <small>{order?.id}</small>
      </p>
      {order.data.basket?.map((item) => (
        <CheckoutProduct
          id={item.id}
          title={item.title}
          image={item.image}
          currencyType={item.currencyType}
          price={item.price}
          rating={item.ratings}
          hideButton={true}
        />
      ))}
      <h3 className="order__total">Order Total: {order?.data.amount / 100}</h3>
    </div>
  );
}

export default Order;
