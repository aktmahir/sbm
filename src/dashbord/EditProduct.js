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

export default function EditProduct({ openAdd, product }) {
  const [{ companies, categories, category_properties }, dispatch] =
    useStateValue();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles1, setSelectedFiles1] = useState([]);
  const [productData, setProductData] = useState({
    id: "",
    title: "",
    productCategory: "",
    productionCompany: "",
    productionYear: "",
    productState: 0,
    productProperties: "",
    productExtraInfo: "",
    productPhysical: "",
    productImages: [],
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
      id: product?.id,
      title: product?.data.title,
      productCategory: product?.data.productCategory,
      productionCompany: product?.data.productionCompany,
      productionYear: product?.data.productionYear,
      productState: product?.data.productState,
      productProperties: product?.data.productProperties,
      productExtraInfo: product?.data.productExtraInfo,
      productPhysical: product?.data.productPhysical,
      productImages: product?.data.productImages,
      state: product?.data.state,
      created: product?.data.created,
    };
    console.log(data);
    setProductData(data);
    setImageArray(product?.data.productImages);
    setSelectedFiles(product?.data.productImages);
    /*const data = {};
    db.collection("products")
      .doc(data?.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setProductData(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });*/
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
    setProductData((prewState) => ({
      ...prewState,
      [id]: value,
    }));
  };
  const handleUpload = ({ file, count }) => {
    const uploadTask = storage.ref(`images/${file.name}`).put(file);
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
          .ref("images")
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
    let data = {
      title: productData?.title,
      productCategory: productData?.productCategory,
      productionCompany: productData?.productionCompany,
      productionYear: productData?.productionYear,
      productState: productData?.productState,
      productProperties: productData?.productProperties,
      productExtraInfo: productData?.productExtraInfo,
      productPhysical: productData?.productPhysical,
      productImages: imageArray || images,
      state: productData?.state,
      created: productData?.created,
    };
    data = productData;
    data.productImages = imageArray || images;
    console.log(data);
    db.collection("products")
      .doc(productData.id)
      .update(data)
      .then((newProduct) => {
        console.log(newProduct);
        setUploading(false);
        alert("Ürün güncellendi " + newProduct?.id);
        dispatch({ type: "RELOAD_TRUE" });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const year = dateObj.getUTCFullYear();

  const minYear = "1950-1";
  const maxYear = year + "-" + month;

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
      const filesArray = Array.from(e.target.files).map((file) => {
        const url = URL.createObjectURL(file);
        setImageArray((preArray) => [
          ...preArray,
          { name: file.name, url: url },
        ]);
        return URL.createObjectURL(file);
      });
      setSelectedFiles((prevImages) => prevImages.concat(filesArray));
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }
  };

  const renderPhotos = (source) => {
    return imageArray?.map((photo) => {
      console.log(photo.url);
      return <img className="img" src={photo.url} alt="" key={photo?.url} />;
    });
  };
  const renderDynamicProperties = () => {
    return (
      Array.isArray(category_properties) &&
      category_properties.map((prop) => {
        return (
          <>
            <ListItem key={prop?.id} className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary={prop?.data.title}
                secondary={
                  <input
                    required
                    placeholder={prop?.data.title}
                    className={classes.inputField}
                    value={productData?.[prop?.data.title]}
                    type="text"
                    id={prop?.data.title}
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
          </>
        );
      })
    );
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
                Makine Düzenle
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
                primary="Makine İsmi"
                secondary={
                  <input
                    required
                    placeholder="Makina İsmi"
                    className={classes.inputField}
                    value={productData?.title}
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
                primary="Makine Kategorisi"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="productCategory"
                    value={productData?.productCategory || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Makine Kategorisi
                    </option>
                    {Array.isArray(categories) &&
                      categories.map((category) => {
                        return (
                          <option value={category.id}>
                            {category.data.title}
                          </option>
                        );
                      })}
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Üretici Firma"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="productionCompany"
                    value={productData?.productionCompany || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Makine Üretici Firma
                    </option>
                    {Array.isArray(companies) &&
                      companies.map((company) => {
                        return (
                          <option value={company.id}>
                            {company.data.title}
                          </option>
                        );
                      })}
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Üretim Yılı"
                secondary={
                  <input
                    required
                    placeholder="Makine Üretim Yılı"
                    className={classes.inputField}
                    value={productData?.productionYear}
                    type="month"
                    min={minYear}
                    max={maxYear}
                    id="productionYear"
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Kullanım Durumu"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    value={productData?.productState}
                    id="productState"
                    defaultValue="default"
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Makine Kullanım Durumu
                    </option>
                    <option value={0}>Sıfır</option>
                    <option value={1}>İkinci El</option>
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
                    value={productData?.state || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Durumu
                    </option>
                    <option value="active">Aktif</option>
                    <option value="deleted">Silindi</option>
                    <option value="sold">Satıldı</option>
                    <option value="passive">Pasif</option>
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Özellikleri"
                secondary={
                  <textarea
                    required
                    placeholder="Makine Özellikleri"
                    className={classes.inputFieldArea}
                    type="text"
                    id="productProperties"
                    value={productData?.productProperties}
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Ek Bilgiler"
                secondary={
                  <textarea
                    required
                    placeholder="Makine Ek Bilgiler"
                    className={classes.inputFieldArea}
                    value={productData?.productExtraInfo}
                    type="text"
                    id="productExtraInfo"
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Fiziksel Özellikler"
                secondary={
                  <textarea
                    required
                    placeholder="Makine Fiziksel Özellikler"
                    className={classes.inputFieldArea}
                    value={productData?.productPhysical}
                    type="text"
                    id="productPhysical"
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            {renderDynamicProperties()}
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Makine Fotografları"
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
