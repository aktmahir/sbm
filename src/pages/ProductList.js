import React from "react";
import Categories from "../components/Categories";
import ProductListProduct from "../components/ProductListProduct";
import { useStateValue } from "../components/StateProvider";
import "../css/ProductList.css";

function ProductList() {
  const [{ products, categories, sub_categories }, dispatch] = useStateValue();
  return (
    <div className="productList">
      <div className="productList__row">
        <div className="productList__side">
          <h3>Kategoriler</h3>
          <Categories categories={categories} sub_categories={sub_categories} />
        </div>
        <div className="productList__main">
          <h2>Makineler</h2>
          <h5>Bütün Makineler</h5>
          {products?.map((product) => (
            <ProductListProduct
              key={product?.id}
              id={product?.id}
              title={product?.data.title}
              image={product?.data.productImages}
              currencyType={product?.data.currencyType}
              price={product?.data.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
