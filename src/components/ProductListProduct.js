import React from "react";
import "../css/ProductListProduct.css";
import { useStateValue } from "./StateProvider";
import "../css/ProductListProduct.css";

function ProductListProduct({ id, title, image, currencyType, price }) {
  const [{ basket }, dispatch] = useStateValue();
  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image[0],
        currencyType: currencyType,
        price: price,
      },
    });
  };
  return (
    <div className="productListProduct">
      <img className="productListProduct__image" src={image[0]?.url} alt="" />
      <div className="productListProduct__info">
        <p className="productListProduct__title">{title}</p>
        <p className="productListProduct__price">
          <small>{currencyType} </small>
          <strong>{price}</strong>
        </p>

        <button onClick={addToBasket}>Add to Basket</button>
      </div>
    </div>
  );
}

export default ProductListProduct;
