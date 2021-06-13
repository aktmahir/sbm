import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct";
import { db } from "../firebase";
import { useStateValue } from "../components/StateProvider";


/*// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719",
    312.44
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574",
    866.99
  ),
  createData(
    2,
    "16 Mar, 2019",
    "Tom Scholz",
    "Boston, MA",
    "MC ⠀•••• 1253",
    100.81
  ),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000",
    654.39
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919",
    212.79
  ),
];

function preventDefault(event) {
  event.preventDefault();
}
*/
const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  title: {
    display: "flex",
    justifyContent: "spaceBeetween",
  },
}));

export default function DashboardProducts() {
  const [{ reload, products, categories, companies }, dispatch] = useStateValue();
  //const [products, setProducts] = useState([]);
  /*useEffect(() => {
    getDataOnlyOnce();
  }, []);
  const getDataOnlyOnce = () => {
    db.collection("products")
      .get()
      .then((querySnapshot) => {
        //let array = [];
        setProducts([]);
        querySnapshot.forEach((doc) => {
          //array.push({ id: doc.id, data: doc.data() });
          let newElement = { id: doc.id, data: doc.data() };
          setProducts((oldArray) => [...oldArray, newElement]);
          //setProducts(array);
          //console.log(doc.id, " => ", doc.data());
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };*/
  const classes = useStyles();

  const setTable = () => {
    return (
      <TableBody>
        {Array.isArray(products) && products?.map((product) => {
          let company;
          let category;
          if (Array.isArray(categories)) {
            category = categories.find(x => x.id === product.data.productCategory);
          }
          if (Array.isArray(companies)) {
            company = companies.find(x => x.id === product.data.productionCompany);
          }
          return (
            <TableRow key={product?.id}>
              <TableCell>{product.data.productionYear}</TableCell>
              <TableCell>{product.data.title}</TableCell>
              <TableCell>{category?.data.title}  </TableCell>
              <TableCell>{company?.data.title}</TableCell>
              <TableCell>{product.data.productState}</TableCell>
              <TableCell>
                {product.data.state === "active"
                  ? "Aktif"
                  : product?.data.state === "deleted"
                    ? "Silindi"
                    : product?.data.state === "passive"
                      ? "Pasif"
                      : "Hata"}
              </TableCell>
              <TableCell align="right">
                <EditProduct key={product.id} product={product} />
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
        <Title>Bütün Makineler</Title>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <AddProduct />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Üretim Yılı</TableCell>
            <TableCell>İsim</TableCell>
            <TableCell>Kategori</TableCell>
            <TableCell>Üreten Firma</TableCell>
            <TableCell>Aktiflik Durumu</TableCell>
            <TableCell>Durumu</TableCell>
            <TableCell align="right">Düzenle</TableCell>
          </TableRow>
        </TableHead>
        {setTable()}
      </Table>
      {/* 
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>*/}
    </React.Fragment>
  );
}
