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
import EditIcon from "@material-ui/icons/Edit";
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

export default function EditCategoryProperty({ openAdd, category }) {
  const [{ sub_categories, categories }, dispatch] = useStateValue();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryData, setCategoryData] = useState({
    title: "",
    type: "",
    isSubCategory: "",
    parentCategory: "",
    categoryInfo: "",
    state: "",
    created: "",
  });
  useEffect(() => {
    loadDataOnlyOnce();
    if (openAdd && !open) {
      setOpen(true);
    }
    if (!openAdd && open) {
      setOpen(false);
    }
  }, [openAdd]);

  const loadDataOnlyOnce = () => {
    const data = {
      id: category?.id,
      type: category?.data.type,
      isSubCategory: category?.data.isSubCategory,
      title: category?.data.title,
      parentCategory: category?.data.parentCategory,
      categoryInfo: category?.data.categoryInfo,
      state: category?.data.state,
      created: category?.data.created,
    };
    console.log(data);
    setCategoryData(data);
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
    setCategoryData((prewState) => ({
      ...prewState,
      [id]: value,
    }));
    if (id === "isSubCategory") {
      setCategoryData((prewState) => ({
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
      title: categoryData?.title,
      type: categoryData?.type,
      isSubCategory: categoryData?.isSubCategory,
      parentCategory: categoryData?.parentCategory,
      categoryInfo: categoryData?.categoryInfo,
      state: categoryData?.state,
      created: categoryData?.created,
    };
    console.log(data);
    // ------------ Edit error------------
    db.collection("category_properties")
      .doc(categoryData.id)
      .update(data)
      .then((newCategory) => {
        setUploading(false);
        alert("kategori özelliği güncellendi " + newCategory?.id);
        dispatch({ type: "RELOAD_TRUE" });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <EditIcon />
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
                Kategori Özelliği Düzenle
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
                primary="Kategori İsmi"
                secondary={
                  <input
                    required
                    placeholder="Kategori İsmi"
                    className={classes.inputField}
                    type="text"
                    value={categoryData?.title}
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
                primary="Kategori Tipi"
                secondary={
                  <input
                    required
                    placeholder="Kategori Tipi"
                    className={classes.inputField}
                    type="text"
                    value={categoryData?.type}
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
                    value={categoryData?.isSubCategory || "default"}
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
                primary="Üst Kategori"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="parentCategory"
                    value={categoryData?.parentCategory || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Üst Kategori
                    </option>
                    {categoryData.isSubCategory === "evet"
                      ? Array.isArray(sub_categories) &&
                        sub_categories.map((cat) => {
                          return (
                            <option value={cat.id}>{cat.data.title}</option>
                          );
                        })
                      : categoryData.isSubCategory === "hayır"
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
                primary="Durumu"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="state"
                    value={categoryData?.state || "default"}
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
                primary="Kategori Bilgileri"
                secondary={
                  <textarea
                    required
                    placeholder="Kategori Bilgileri"
                    className={classes.inputFieldArea}
                    type="text"
                    value={categoryData?.categoryInfo}
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
