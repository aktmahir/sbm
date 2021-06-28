import React
  //, { useEffect, useState } 
  from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditCategory from "./EditCategory";
import AddCategory from "./AddCategory";
import { useStateValue } from "../components/StateProvider";


const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  title: {
    display: "flex",
    justifyContent: "spaceBeetween",
  },
}));

export default function DashboardCategories() {
  const [{ categories },
    //  dispatch
  ] = useStateValue();

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
        {Array.isArray(categories) && categories?.map((category) => {
          return (
            <TableRow key={category?.id}>
              <TableCell>{category.data.created}</TableCell>
              <TableCell>{category.data.title}</TableCell>
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
                <EditCategory key={category.id} category={category} />
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
        <Title>Bütün Kategoriler</Title>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <AddCategory />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Eklenme Tarihi</TableCell>
            <TableCell>İsim</TableCell>
            <TableCell>Aktiflik Durumu</TableCell>
            <TableCell align="right">Düzenle</TableCell>
          </TableRow>
        </TableHead>
        {setTable()}
      </Table>
    </React.Fragment>
  );
}
