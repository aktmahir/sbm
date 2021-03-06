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

export default function AddSubCategory({ openAdd }) {
    const [{ companies, categories }, dispatch] = useStateValue();

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const year = dateObj.getUTCFullYear();

    const minYear = "1950-1";
    const maxYear = year + "-" + month;

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFiles1, setSelectedFiles1] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [newCategoryData, setNewCategoryData] = useState({
        title: "",
        parentCategory: "",
        categoryProperties: "",
        categoryInfo: "",
        categoryImages: [],
        state: "active",
        created: new Date().toLocaleString(),
    });
    useEffect(() => {
        if (openAdd && !open) {
            setOpen(true);
        }
        if (!openAdd && open) {
            setOpen(false);
        }
    }, [openAdd]);

    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleChange = (e) => {
        const value = e.target.value;
        const id = e.target.id;
        setNewCategoryData((prewState) => ({
            ...prewState,
            [id]: value,
        }));
    };
    const handleUpload = ({ file, count }) => {
        const uploadTask = storage.ref(`subcategory_images/${file.name}`).put(file);
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
                    .ref("subcategory_images")
                    .child(file.name)
                    .getDownloadURL()
                    .then((imageUrl) => {
                        const item = { name: file.name, url: imageUrl };
                        setImageArray((preArray) => [...preArray, item]);
                        // if (count === 0) {
                        //handleDBUpload({ images: imageArray });
                        // }
                    });
            }
        );
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setUploading(true);
        // if (Array.isArray(selectedFiles1) && selectedFiles1?.length > 0) {
        //  let count = selectedFiles?.length;
        //  selectedFiles1?.map((file) => {
        //   count--;
        //    setImage(file);
        //    handleUpload({ file: file, count: count });
        //  });
        //} else {
        handleDBUpload({ images: imageArray });
        //}
    };

    const handleDBUpload = ({ images }) => {
        const data = {
            title: newCategoryData?.title,
            parentCategory: newCategoryData?.parentCategory,
            categoryProperties: newCategoryData?.categoryProperties,
            categoryInfo: newCategoryData?.categoryInfo,
            categoryImages: imageArray || images,
            state: newCategoryData?.state,
            created: newCategoryData?.created,
        };
        console.log(imageArray);
        console.log(images);

        db.collection("sub_categories")
            .add(data)
            .then((newProduct) => {
                setUploading(false);
                alert("Yeni kategori eklendi " + newProduct?.id);
                dispatch({ type: "RELOAD_TRUE" });
                setOpen(false);
                setImage(null);
                setImageArray([]);
                setNewCategoryData({
                    title: "",
                    parentCategory: "",
                    categoryProperties: "",
                    categoryInfo: "",
                    categoryImages: [],
                    state: "active",
                    created: new Date().toLocaleString(),
                });
                setSelectedFiles([]);
                setSelectedFiles1([]);
            })
            .catch((err) => {
                console.log(err);
                setUploading(false);
            });
    };



    const handleImageChange = (e) => {
        e.preventDefault();
        if (e.target.files) {
            let newArray = [];
            let count;
            for (let i = 0; i < e.target.files.length; i++) {
                console.log(i);
                count = i + 1;
                let newItem = e.target.files[i];
                newArray.push(newItem);
                setSelectedFiles1(newArray);
                if (
                    count === e.target.files.length ||
                    newArray.length === e.target.files.length
                ) {
                    console.log(newArray);
                    let count1 = newArray?.length;
                    newArray?.map((file) => {
                        count1--;
                        setImage(file);
                        handleUpload({ file: file, count: count1 });
                    });
                }
            }
            const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedFiles((prevImages) => prevImages.concat(filesArray));
            Array.from(e.target.files).map(
                (file) => URL.revokeObjectURL(file) // avoid memory leak
            );
        }
    };

    const renderPhotos = (source) => {
        return source.map((photo) => {
            return <img className="img" src={photo} alt="" key={photo} />;
        });
    };
    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Alt Kategori Ekle
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
                                Alt Kategori Ekle
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
                                primary="Kategori ??smi"
                                secondary={
                                    <input
                                        required
                                        placeholder="Kategori ??smi"
                                        className={classes.inputField}
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
                                primary="??st Kategori"
                                secondary={
                                    <select
                                        required
                                        className={classes.inputField}
                                        id="parentCategory"
                                        defaultValue="default"
                                        onChange={handleChange}
                                    >
                                        <option value="default" disabled>
                                            ??st Kategori
                                        </option>
                                        {Array.isArray(categories) && categories.map((company) => {
                                            return (
                                                <option value={company.id}>{company.data.title}</option>
                                            )
                                        })}
                                    </select>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Kategori ??zellikleri"
                                secondary={
                                    <textarea
                                        required
                                        placeholder="Kategori ??zellikleri"
                                        className={classes.inputFieldArea}
                                        type="text"
                                        id="categoryProperties"
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Kategori Bilgileri"
                                secondary={
                                    <textarea
                                        required
                                        placeholder="Kategori Bilgileri"
                                        className={classes.inputFieldArea}
                                        type="text"
                                        id="categoryInfo"
                                        onChange={handleChange}
                                    />
                                }
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.input}>
                            <ListItemText
                                className={classes.inputText}
                                primary="Kategori Fotograflar??"
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
                                        <div className="result">{renderPhotos(selectedFiles)}</div>
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
