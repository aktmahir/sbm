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
  const [{ sub_categories, categories }, dispatch] = useStateValue();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    title: "",
    type: "",
    isSubCategory: "",
    parentCategory: "",
    categoryInfo: "",
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
    if (id === "isSubCategory") {
      setNewCategoryData((prewState) => ({
        ...prewState,
        parentCategory: "",
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    handleDBUpload();
  };

  const handleDBUpload = () => {
    const data = {
      title: newCategoryData?.title,
      type: newCategoryData?.type,
      isSubCategory: newCategoryData?.isSubCategory,
      parentCategory: newCategoryData?.parentCategory,
      categoryInfo: newCategoryData?.categoryInfo,
      state: newCategoryData?.state,
      created: newCategoryData?.created,
    };
    db.collection("category_properties")
      .add(data)
      .then((newProduct) => {
        setUploading(false);
        alert("Yeni kategori özelliği eklendi " + newProduct?.id);
        dispatch({ type: "RELOAD_TRUE" });
        setOpen(false);
        setNewCategoryData({
          title: "",
          type: "",
          isSubCategory: "",
          parentCategory: "",
          categoryProperties: "",
          categoryInfo: "",
          categoryImages: [],
          state: "active",
          created: new Date().toLocaleString(),
        });
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Kategori Özelliği Ekle
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
                Kategori Özelliği Ekle
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
                primary="Kategori Özelliği İsmi"
                secondary={
                  <input
                    required
                    placeholder="Kategori Özelliği İsmi"
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
                primary="Kategori Özelliği Tipi"
                secondary={
                  <input
                    required
                    placeholder="Kategori Özelliği Tipi"
                    className={classes.inputField}
                    type="text"
                    id="type"
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Alt Kategori mi?"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="isSubCategory"
                    value={newCategoryData?.isSubCategory || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Alt Kategori mi?
                    </option>
                    <option value={"evet"}>Evet</option>
                    <option value={"hayır"}>Hayır</option>
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Kategorisi"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="parentCategory"
                    value={newCategoryData?.parentCategory || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Kategorisi
                    </option>
                    {newCategoryData.isSubCategory === "evet"
                      ? Array.isArray(sub_categories) &&
                        sub_categories.map((cat) => {
                          return (
                            <option value={cat.id}>{cat.data.title}</option>
                          );
                        })
                      : newCategoryData.isSubCategory === "hayır"
                      ? Array.isArray(categories) &&
                        categories.map((cat) => {
                          return (
                            <option value={cat.id}>{cat.data.title}</option>
                          );
                        })
                      : ""}
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Kategori Özelliği Bilgileri"
                secondary={
                  <textarea
                    required
                    placeholder="Kategori Özelliği Bilgileri"
                    className={classes.inputFieldArea}
                    type="text"
                    id="categoryInfo"
                    onChange={handleChange}
                  />
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
