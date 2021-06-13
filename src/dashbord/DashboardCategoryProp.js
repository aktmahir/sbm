import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { db, storage } from "../firebase";
import { useStateValue } from "../components/StateProvider";
import AddCategoryProperty from "./AddCategoryProperty";
import EditCategoryProperty from "./EditCategoryProperty";

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  title: {
    display: "flex",
    justifyContent: "spaceBeetween",
  },
}));

export default function DashboardCategoryProp() {
  const [
    { reload, categories, sub_categories, category_properties },
    dispatch,
  ] = useStateValue();
  const classes = useStyles();
  const setTable = () => {
    return (
      <TableBody>
        {Array.isArray(category_properties) &&
          category_properties?.map((category) => {
            let parentCat;
            if (category.data.isSubCategory === "evet") {
              if (Array.isArray(sub_categories))
                parentCat = sub_categories.find(
                  (x) => x.id === category.data.parentCategory
                );
            } else if (category.data.isSubCategory === "hayır") {
              if (Array.isArray(categories))
                parentCat = categories.find(
                  (x) => x.id === category.data.parentCategory
                );
            }
            return (
              <TableRow key={category?.id}>
                <TableCell>{category.data.created}</TableCell>
                <TableCell>{category.data.title}</TableCell>
                <TableCell>{category.data.isSubCategory}</TableCell>
                <TableCell>{parentCat?.data?.title}</TableCell>
                <TableCell>{category.data.type}</TableCell>
                <TableCell>
                  {category.data.state === "active"
                    ? "Aktif"
                    : category?.data.state === "deleted"
                    ? "Silindi"
                    : category?.data.state === "passive"
                    ? "Pasif"
                    : category?.data.state === "sold"
                    ? "Satıldı"
                    : "Hata"}
                </TableCell>
                <TableCell align="right">
                  <EditCategoryProperty key={category.id} category={category} />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  };
  return (
    <React.Fragment>
      <div className={classes.title}>
        <Title>Bütün Kategori Özellikleri</Title>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <AddCategoryProperty />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Eklenme Tarihi</TableCell>
            <TableCell>İsim</TableCell>
            <TableCell>Alt Kategori Mi?</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>Tipi</TableCell>
            <TableCell>Aktiflik Durumu</TableCell>
            <TableCell align="right">Düzenle</TableCell>
          </TableRow>
        </TableHead>
        {setTable()}
      </Table>
    </React.Fragment>
  );
}
