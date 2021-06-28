import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import "./AddProduct.css";
import { db, storage } from "../firebase";
import { useStateValue } from "../components/StateProvider";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "relative",
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    input: {
        width: "100%",
        minHeight: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },
    inputText: {
        width: "100%",
    },
    inputField: {
        width: "100%",
        height: "30px",
    },
    inputFieldArea: {
        width: "100%",
        minHeight: "130px",
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddHomePageSlider({ openAdd }) {
    const [{ home }, dispatch] =
        useStateValue();

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [imageArray, setImageArray] = useState([]);
    const [slideData, setSlideData] = useState({
        id: "",
        title: "",
        slide: "",
        state: "",
    });
    useEffect(() => {
        loadDataOnlyOnce();
        if (openAdd && !open) {
            setOpen(true);
        }
        if (!openAdd && open) {
            setOpen(false);
        }
    }, [openAdd, home.data.slides]);

    const loadDataOnlyOnce = () => {
        setSlideData({ ...slideData, id: home?.id })
    };


    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setSlideData((prewState) => ({
            ...prewState,
            [id]: value,
        }));
    };
    const handleUpload = ({ file }) => {
        const uploadTask = storage.ref(`slide_images/${file.name}`).put(file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage
                    .ref("slide_images")
                    .child(file.name)
                    .getDownloadURL()
                    .then((imageUrl) => {
                        const item = { name: file.name, url: imageUrl };
                        setImageArray(() => [item]);
                        //  setSlideData({ slideData, slide: imageUrl });
                    });
            }
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setUploading(true);
        handleDBUpload();
    };

    const handleDBUpload = () => {
        let array = home.data.slides;
        array.push({
            title: slideData.title,
            slide: imageArray[0].url,
            state: slideData.state,
            created: new Date().toLocaleString(),
        });
        let data = {
            slides: array,
        };
        db.collection("home")
            .doc(home.id)
            .update(data)
            .then(() => {
                setUploading(false);
                alert("Slayt güncellendi " + home.id);
                dispatch({ type: "RELOAD_TRUE" });
                setOpen(false);
                setSlideData({
                    id: "",
                    title: "",
                    slide: "",
                    state: "",
                });
                setImageArray([]);
            })
            .catch((err) => {
                console.log(err);
                setUploading(false);
            });
    };

    const handleImageChange = (e) => {
        e.preventDefault();
        if (e.target.files) {
            const file = e.target.files[0];
            handleUpload({ file: file });

            // const url = URL.createObjectURL(file);
            // setImageArray(() => [
            //      { name: file.name, url: url },
            // ]);
            // URL.revokeObjectURL(file) // avoid memory leak
        }
    };

    const renderPhotos = () => {
        return imageArray?.map((photo) => {
            return <img className="img" src={photo.url} alt="" key={photo?.url} />;
        });
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Anasayfa Slayt Ekle
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <form name="addproduct_form" className="" onSubmit={handleSubmit}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Anasayfa Slayt Ekle
                            </Typography>
                            <Button
                                disabled={uploading}
                                autoFocus
                                color="inherit"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Kaydet
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <List>
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Slide Başlığı"
                                secondary={
                                    <input
                                        required
                                        placeholder="Slide Başlığı"
                                        className={classes.inputField}
                                        value={slideData?.title}
                                        type="text"
                                        id="title"
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </ListItem>
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Durumu"
                                secondary={
                                    <select
                                        required
                                        className={classes.inputField}
                                        id="state"
                                        value={slideData?.state || "default"}
                                        onChange={handleChange}
                                    >
                                        <option value="default" disabled>
                                            Durumu
                                        </option>
                                        <option value="active">Aktif</option>
                                        <option value="passive">Pasif</option>
                                    </select>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Slide Fotografı"
                                secondary={
                                    <div>
                                        <input
                                            type="file"
                                            id="file"
                                            multiple={false}
                                            onChange={handleImageChange}
                                        />
                                        <div className="label-holder">
                                            <label htmlFor="file" className="label">
                                                <InsertDriveFileIcon />
                                            </label>
                                        </div>
                                        <div className="result">{renderPhotos()}</div>
                                    </div>
                                }
                            />
                        </ListItem>
                        <Divider />
                    </List>
                </form>
            </Dialog>
        </div>
    );
}
