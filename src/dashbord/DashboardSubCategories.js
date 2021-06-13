import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditSubCategory from "./EditSubCategory";
import { db, storage } from "../firebase";
import { useStateValue } from "../components/StateProvider";
import AddSubCategory from "./AddSubCategory";


const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
    title: {
        display: "flex",
        justifyContent: "spaceBeetween",
    },
}));

export default function DashboardSubCategories() {
    const [{ reload, categories, sub_categories }, dispatch] = useStateValue();

    /*const [categories, setCategories] = useState([]);
    useEffect(() => {
      getDataOnlyOnce();
    }, []);
  
    const getDataOnlyOnce = () => {
      db.collection("categories")
        .get()
        .then((querySnapshot) => {
          //let array = [];
          setCategories([]);
          querySnapshot.forEach((doc) => {
            //array.push({ id: doc.id, data: doc.data() });
            let newElement = { id: doc.id, data: doc.data() };
            setCategories((oldArray) => [...oldArray, newElement]);
            //setProducts(array);
            //console.log(doc.id, " => ", doc.data());
          });
          //setCategories(querySnapshot);
           querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
        });
    };*/
    const classes = useStyles();
    const setTable = () => {
        return (
            <TableBody>
                {Array.isArray(sub_categories) && sub_categories?.map((category) => {
                    let parentCat;
                    if (Array.isArray(categories))
                        parentCat = categories.find(x => x.id === category.data.parentCategory);
                    return (
                        <TableRow key={category?.id}>
                            <TableCell>{category.data.created}</TableCell>
                            <TableCell>{category.data.title}</TableCell>
                            <TableCell>{parentCat.data?.title}</TableCell>
                            <TableCell>
                                {category.data.state === "active"
                                    ? "Aktif"
                                    : category?.data.state === "deleted"
                                        ? "Silindi"
                                        : category?.data.state === "passive"
                                            ? "Pasif"
                                            : "Hata"}
                            </TableCell>
                            <TableCell align="right">
                                <EditSubCategory key={category.id} category={category} />
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
                <Title>Bütün Alt Kategoriler</Title>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <AddSubCategory />
            </div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Eklenme Tarihi</TableCell>
                        <TableCell>İsim</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Aktiflik Durumu</TableCell>
                        <TableCell align="right">Düzenle</TableCell>
                    </TableRow>
                </TableHead>
                {setTable()}
            </Table>
        </React.Fragment>
    );
}
