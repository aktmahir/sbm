import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditHomeSlider from "./EditHomeSlider";
import AddHomePageSlider from "./AddHomePageSlider";
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

export default function DashboardSlider() {
    const [{ reload, home }, dispatch] = useStateValue();

    const classes = useStyles();
    const setTable = () => {
        return (
            <TableBody>
                {home.data.slides && Array.isArray(home.data.slides) && home.data.slides.map((slide, index) => {
                    return (
                        <TableRow key={slide?.id}>
                            <TableCell>{slide.created}</TableCell>
                            <TableCell>{slide.title}</TableCell>
                            <TableCell>
                                {slide.state === "active"
                                    ? "Aktif"
                                    : slide?.state === "deleted"
                                        ? "Silindi"
                                        : slide?.state === "passive"
                                            ? "Pasif"
                                            : "Hata"}
                            </TableCell>
                            <TableCell align="right">
                                <EditHomeSlider key={slide.id} slide={slide} index={index} />
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
                <Title>B??t??n Slaytlar</Title>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <AddHomePageSlider />
            </div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Eklenme Tarihi</TableCell>
                        <TableCell>??sim</TableCell>
                        <TableCell>Aktiflik Durumu</TableCell>
                        <TableCell align="right">D??zenle</TableCell>
                    </TableRow>
                </TableHead>
                {setTable()}
            </Table>
        </React.Fragment>
    );
}
