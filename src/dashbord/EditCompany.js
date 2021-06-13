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

export default function EditCompany({ openAdd, company }) {
  const [{ companies, categories }, dispatch] = useStateValue();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFiles1, setSelectedFiles1] = useState([]);

  const [companyData, setCompanyData] = useState({
    id: "",
    title: "",
    companyProperties: "",
    isDealer: 0,
    companyInfo: "",
    companyImages: [],
    state: "active",
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
      id: company?.id,
      title: company?.data.title,
      companyProperties: company?.data.companyProperties,
      isDealer: company?.data.isDealer,
      companyInfo: company?.data.companyInfo,
      companyImages: company?.data.productImages,
      state: company?.data.state,
      created: company?.data.created,
    };
    console.log(data);
    setCompanyData(data);
    setImageArray(company?.data.productImages);
    setSelectedFiles(company?.data.productImages);

    /* db.collection("companies")
       .doc(data?.uid)
       .get()
       .then((doc) => {
         if (doc.exists) {
           console.log("Document data:", doc.data());
           setCompanyData(doc.data());
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
    setCompanyData((prewState) => ({
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
      title: companyData?.title,
      companyProperties: companyData?.companyProperties,
      isDealer: companyData?.isDealer,
      companyInfo: companyData?.companyInfo,
      companyImages: imageArray || images,
      state: companyData?.state,
      created: companyData?.created,
    };
    console.log(data);
    // ------------ Edit error------------
    db.collection("companies")
      .doc(companyData.id)
      .update(data)
      .then((newCompany) => {
        console.log(newCompany);
        setUploading(false);
        alert("Firma güncellendi " + newCompany?.id);
        dispatch({ type: "RELOAD_TRUE" });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };
  /*const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const year = dateObj.getUTCFullYear();

  const minYear = "1950-1";
  const maxYear = year + "-" + month;*/

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
                Kategori Düzenle
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
                    value={companyData?.title}
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
                primary="Durumu"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="state"
                    value={companyData?.state || "default"}
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
                primary="Kategori Özellikleri"
                secondary={
                  <textarea
                    required
                    placeholder="Kategori Özellikleri"
                    className={classes.inputFieldArea}
                    type="text"
                    value={companyData?.companyProperties}
                    id="companyProperties"
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
                    value={companyData?.companyInfo}
                    id="companyInfo"
                    onChange={handleChange}
                  />
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Bayilik Durumu"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="isDealer"
                    value={companyData?.isDealer || "default"}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Bayilik Durumu
                    </option>
                    <option value={0}>Yetkili Bayi Değil</option>
                    <option value={1}>Yetkili Bayi</option>
                  </select>
                }
              />
            </ListItem>
            <Divider />
            <ListItem className={classes.input}>
              <ListItemText
                className={classes.inputText}
                primary="Kategori Fotografları"
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