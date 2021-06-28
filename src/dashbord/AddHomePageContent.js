import React, { useEffect, useState, useRef } from "react";
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
import JoditEditor from "jodit-react";


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

export default function AddHomePageContent({ openAdd }) {
    const [{ home, products, companies, categories }, dispatch] =
        useStateValue();

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [imageArray, setImageArray] = useState([]);
    const [contentData, setContentData] = useState({
        id: "",
        title: "",
        type: "",
        content: "",
        images: "",
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
    }, [openAdd, home.data.homeContent]);

    const loadDataOnlyOnce = () => {
        setContentData({ ...contentData, id: home?.id })
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
        setContentData((prewState) => ({
            ...prewState,
            [id]: value,
        }));
    };
    const handleUpload = ({ file }) => {
        const uploadTask = storage.ref(`content_images/${file.name}`).put(file);
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
                    .ref("content_images")
                    .child(file.name)
                    .getDownloadURL()
                    .then((imageUrl) => {
                        const item = { name: file.name, url: imageUrl };
                        // setImageArray(() => [item]);
                        setImageArray((preArray) => [...preArray, item]);
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
        let array = home.data.homeContent;
        array.push({
            title: contentData.title,
            type: contentData.type,
            content: contentData.content,
            images: imageArray,
            state: contentData.state,
            created: new Date().toLocaleString(),
        });
        let data = {
            homeContent: array,
        };
        db.collection("home")
            .doc(home.id)
            .update(data)
            .then(() => {
                setUploading(false);
                alert("Slayt güncellendi " + home.id);
                dispatch({ type: "RELOAD_TRUE" });
                setOpen(false);
                setContentData({
                    id: "",
                    title: "",
                    type: "",
                    content: "",
                    images: "",
                    state: "",
                    created: "",
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
            //const file = e.target.files[0];
            //handleUpload({ file: file });
            let newArray = [];
            let count;
            for (let i = 0; i < e.target.files.length; i++) {
                console.log(i);
                count = i + 1;
                let newItem = e.target.files[i];
                newArray.push(newItem);

                if (
                    count === e.target.files.length ||
                    newArray.length === e.target.files.length
                ) {
                    console.log(newArray);
                    let count1 = newArray?.length;
                    newArray?.map((file) => {
                        count1--;
                        handleUpload({ file: file, count: count1 });
                    });
                }
            }

        }
    };

    const renderPhotos = () => {
        return imageArray?.map((photo) => {
            return <img className="img" src={photo.url} alt="" key={photo?.url} />;
        });
    };

    const editor = useRef(null);
    const config = { readonly: false };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Anasayfa İçerik Ekle
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
                                Anasayfa İçerik Ekle
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
                                primary="İçerik Başlığı"
                                secondary={
                                    <input
                                        required
                                        placeholder="İçerik Başlığı"
                                        className={classes.inputField}
                                        value={contentData?.title}
                                        type="text"
                                        id="title"
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="İçerik Tipi"
                                secondary={
                                    <select
                                        required
                                        className={classes.inputField}
                                        id="type"
                                        value={contentData?.type || "default"}
                                        onChange={handleChange}
                                    >
                                        <option value="default" disabled>
                                            İçerik
                                        </option>
                                        <option value="product">Makine / Ürün</option>
                                        <option value="category">Kategori</option>
                                        <option value="company">Şirket</option>
                                        <option value="other">Diğer(Duyuru, Haber vb.)</option>
                                    </select>
                                }
                            />
                        </ListItem>
                        <Divider />
                        {contentData?.type === "other" ? <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="İçerik"
                                secondary={
                                    <JoditEditor
                                        ref={editor}
                                        value={contentData?.content}
                                        config={config}
                                        tabIndex={1}
                                        onBlur={newContent => setContentData({
                                            ...contentData,
                                            content: newContent
                                        })}
                                        onChange={newContent => { }}
                                    />
                                }
                            />
                        </ListItem> : <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="İçerik"
                                secondary={
                                    <select
                                        required
                                        className={classes.inputField}
                                        id="content"
                                        value={contentData?.content}
                                        onChange={handleChange}
                                    >
                                        <option value="default" disabled>
                                            İçerik
                                        </option>
                                        {contentData.type === "product" ? Array.isArray(products) && products?.map(item => {
                                            return <option value={item.id}>{item.data.title} </option>
                                        }) : contentData.type === "category" ? Array.isArray(categories) && categories?.map(item => {
                                            return <option value={item.id}>{item.data.title} </option>
                                        }) : contentData.type === "company" ? Array.isArray(companies) && companies?.map(item => {
                                            return <option value={item.id}>{item.data.title} </option>
                                        }) : ""}
                                    </select>
                                }
                            />
                        </ListItem>}

                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Durumu"
                                secondary={
                                    <select
                                        required
                                        className={classes.inputField}
                                        id="state"
                                        value={contentData?.state || "default"}
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
                        {contentData?.type === "other" ? <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="İçerik Fotografı"
                                secondary={
                                    <div>
                                        <input
                                            type="file"
                                            id="file"
                                            multiple
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
                        </ListItem> : ""}
                        <Divider />
                    </List>
                </form>
            </Dialog>
        </div>
    );
}
