import React, { useState, useEffect } from "react";
import "../css/Categories.css";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

function Companies({ companies }) {
    //const [categoryOpen, setCategoryOpen] = useState([]);
    // useEffect(() => {
    //     console.log(categoryOpen);
    // }, [categoryOpen]);
    return (
        <div className="categories">
            {Array.isArray(companies) && companies?.map((company) => {
                return (
                    <div className="categories__category">
                        <span className="categories__title">{company?.data.title}</span>
                    </div>
                )
            })}
        </div>
    );
}

export default Companies;
