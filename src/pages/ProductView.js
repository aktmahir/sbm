import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/ProductView.css";
import { Carousel } from 'react-responsive-carousel';
import { useStateValue } from "../components/StateProvider";


function ProductView() {
  const [{ products }, dispach] = useStateValue();
  const [product, setProduct] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const productId = currentPath.substring(19, currentPath.length);
  useEffect(() => {
    loadDataOnlyOnce();
  }, []);
  const loadDataOnlyOnce = () => {
    

    const curProduct = products.find(x => x.id === productId);
    if (curProduct) {
      setProduct(curProduct);
    } else {
      alert("hata !!!!!");
    }
  }

  return <div className="productView">
    <div className="productView__container">
      <Carousel className="home__image" showArrows={true} showThumbs={false} stopOnHover={true} infiniteLoop={true}>
        {product && product.data.slides.map(slide => {
          return <div>
            <img style={{ maxHeight: "500px" }} src={slide.slide} alt="örnek" />
            <p className="legend">{slide.title} </p>
          </div>
        })}
      </Carousel>
    </div>
    <h1>{product.data.title}</h1>
  </div>;
}

export default ProductView;
