import React from "react";
import { useStateValue } from "./StateProvider";
import "../css/Product.css";

function Product({ id, title, image, currencyType, price, rating }) {
  const [{ basket }, dispatch] = useStateValue();
  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        currencyType: currencyType,
        price: price,
        rating: rating,
      },
    });
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product_price">
          <small>{currencyType}</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={i}>🌟</p>
            ))}
        </div>
      </div>
      <img src={image} alt="Product İmage" />
      <button onClick={addToBasket}>Add to Basket</button>
    </div>
  );
}

export default Product;
