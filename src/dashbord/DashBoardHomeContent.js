import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import EditHomePageContent from "./EditHomePageContent";
import AddHomePageContent from "./AddHomePageContent";
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

export default function DashboardHomeContent() {
    const [{ reload, home }, dispatch] = useStateValue();

    const classes = useStyles();
    const setTable = () => {
        return (
            <TableBody>
                {home?.data?.homeContent && Array.isArray(home?.data.homeContent) && home?.data.homeContent.map((content, index) => {
                    return (
                        <TableRow key={content?.id}>
                            <TableCell>{content?.created}</TableCell>
                            <TableCell>{content?.title}</TableCell>
                            <TableCell>{content?.type}</TableCell>
                            <TableCell>{content?.type === "other" ? "....." : content?.content}</TableCell>
                            <TableCell>
                                {content?.state === "active"
                                    ? "Aktif"
                                    : content?.state === "deleted"
                                        ? "Silindi"
                                        : content?.state === "passive"
                                            ? "Pasif"
                                            : "Hata"}
                            </TableCell>
                            <TableCell align="right">
                                <EditHomePageContent key={content?.id} content={content} index={index} />
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
                <Title>Bütün Anasayfa İçerikleri</Title>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <AddHomePageContent />
            </div>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Eklenme Tarihi</TableCell>
                        <TableCell>İsim</TableCell>
                        <TableCell>Tip</TableCell>
                        <TableCell>İçerik</TableCell>
                        <TableCell>Aktiflik Durumu</TableCell>
                        <TableCell align="right">Düzenle</TableCell>
                    </TableRow>
                </TableHead>
                {setTable()}
            </Table>
        </React.Fragment>
    );
}
