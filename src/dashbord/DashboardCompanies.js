import React, { useEffect, useState } from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditCompany from "./EditCompany";
import AddCompany from "./AddCompany";
import { db, storage } from "../firebase";
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

export default function DashboardCompanies() {
  const [{ reload, companies }, dispatch] = useStateValue();
  /*  const [companies, setCompanies] = useState([]);
    useEffect(() => {
      getDataOnlyOnce();
    }, []);
    useEffect(() => {
      console.log(companies)
    }, [companies]);
    const getDataOnlyOnce = () => {
      db.collection("companies")
        .get()
        .then((querySnapshot) => {
          //let array = [];
          setCompanies([]);
          querySnapshot.forEach((doc) => {
            //array.push({ id: doc.id, data: doc.data() });
            let newElement = { id: doc.id, data: doc.data() };
            setCompanies((oldArray) => [...oldArray, newElement]);
            //setCompanies(array);
            //console.log(doc.id, " => ", doc.data());
            //setCompanies(querySnapshot);
          //   querySnapshot.forEach((doc) => {
           //   // doc.data() is never undefined for query doc snapshots
          //    console.log(doc.id, " => ", doc.data());
         // });
          });
        });
    };*/
  const classes = useStyles();

  const setTable = () => {
    return (
      <TableBody>
        {Array.isArray(companies) && companies?.map((company) => (
          <TableRow key={company?.id}>
            <TableCell>{company?.data.created}</TableCell>
            <TableCell>{company?.data.title}</TableCell>
            <TableCell>{company?.data.isDealer}</TableCell>
            <TableCell>
              {company?.data.state === "active"
                ? "Aktif"
                : company?.data.state === "deleted"
                  ? "Silindi"
                  : company?.data.state === "passive"
                    ? "Pasif"
                    : "Hata"}
            </TableCell>
            <TableCell align="right">
              <EditCompany company={company} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };
  return (
    <React.Fragment>
      <div className={classes.title}>
        <Title>Bütün Firmalar</Title>
                &nbsp;&nbsp;&nbsp;&nbsp;
        <AddCompany />
      </div>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ekleme Tarihi</TableCell>
            <TableCell>İsim</TableCell>
            <TableCell>Bayilik Durumu</TableCell>
            <TableCell>Aktiflik Durumu</TableCell>
            <TableCell align="right">Düzenle</TableCell>
          </TableRow>
        </TableHead>
        {setTable()}
      </Table>
    </React.Fragment>
  );
}
