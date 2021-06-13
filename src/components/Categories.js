import React, { useState, useEffect } from "react";
import "../css/Categories.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

function Categories({ categories, sub_categories }) {
  const [categoryOpen, setCategoryOpen] = useState([]);
  useEffect(() => {
    console.log(categoryOpen);
  }, [categoryOpen]);
  return (
    <div className="categories">
      {Array.isArray(categories) && categories?.map((category) => {
        let subCats;
        if (Array.isArray(sub_categories))
          subCats = sub_categories.filter(x => x.data.parentCategory === category.id);
        return (
          <div className="categories__category">
            <span className="categories__title">{category?.data.title}</span>
            <div
              hidden={!categoryOpen.find(x => x === category?.id)}
              className="categories__icon"
              onClick={() =>
                setCategoryOpen(
                  categoryOpen?.filter((item) => item !== category?.id)
                )
              }
            >
              <ArrowDropUpIcon />
            </div>
            <div
              hidden={categoryOpen.find(x => x === category?.id) || !subCats.length}
              className="categories__icon"
              onClick={() => setCategoryOpen([...categoryOpen, category?.id])}
            >
              <ArrowDropDownIcon />
            </div>
            <div className="categories__subcategories" hidden={!categoryOpen.includes(category?.id)}>
              {subCats && subCats.map((subCat) => (
                <div className="categories__subcategory">
                  <span className="categories__subtitle">{subCat.data.title}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default Categories;
