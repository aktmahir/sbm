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

export default function EditHomeSlider({ openAdd, slide, index }) {
  const [{ home }, dispatch] =
    useStateValue();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [allSlides, setAllSlides] = useState([]);
  const [slideData, setSlideData] = useState({
    title: "",
    slide: "",
    state: "",
    index: "",
  });
  const [indexNArray, setIndexNArray] = useState([]);
  useEffect(() => {
    loadDataOnlyOnce();
    if (openAdd && !open) {
      setOpen(true);
    }
    if (!openAdd && open) {
      setOpen(false);
    }
    setIndexArray();
  }, [openAdd, home.data.slides]);

  const setIndexArray = () => {
    let array = [];
    if (home.data.slides && Array.isArray(home.data.slides)) {
      for (let i = 0; i < home.data.slides.length; i++) {
        array.push(i);
        if (i === home.data.slides.length - 1) {
          setIndexNArray(array);
        }
      }
    }
  }

  const loadDataOnlyOnce = () => {
    setSlideData({
      slide: slide.slide,
      state: slide.state,
      title: slide.title,
      created: slide.created,
      index: index,
    });
    setAllSlides(home.data.slides);
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
            setSlideData({ ...slideData, slide: imageUrl });
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
    let array = allSlides;
    array.splice(index, 1);
    array.splice(slideData.index, 0, {
      title: slideData.title,
      slide: slideData.slide,
      state: slideData.state,
      created: slideData.created,
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
    }
  };

  const renderPhotos = () => {
    return <img className="img" src={slideData?.slide} alt="" />;
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Anasayfa Slide Düzenle <EditIcon />
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
                Anasayfa Slide Düzenle
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
                primary="Durumu"
                secondary={
                  <select
                    required
                    className={classes.inputField}
                    id="index"
                    value={slideData?.index}
                    onChange={handleChange}
                  >
                    <option value="default" disabled>
                      Slayt Sırası
                    </option>
                    {Array.isArray(indexNArray) && indexNArray?.map(item => {
                      return <option value={item}>{item + 1} </option>
                    })}
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
