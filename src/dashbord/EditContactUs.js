import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import Slide from "@material-ui/core/Slide";
import "./AddProduct.css";
import { db } from "../firebase";
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

export default function EditContactUs({ openAdd }) {
  const [{ home }, dispatch] =
    useStateValue();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contactUsData, setContactUsData] = useState("");
  useEffect(() => {
    loadDataOnlyOnce();
    if (openAdd && !open) {
      setOpen(true);
    }
    if (!openAdd && open) {
      setOpen(false);
    }
  }, [openAdd, home.data.contactUsContent]);

  const loadDataOnlyOnce = () => {
    setContactUsData(home.data.contactUsContent);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUploading(true);
    handleDBUpload();
  };

  const handleDBUpload = () => {
    let data = {
      contactUsContent: contactUsData,
      oldContactUs: home.data.contactUsContent,
      olderContactUs: home.data.oldContactUs,
    };
    db.collection("home")
      .doc(home.id)
      .update(data)
      .then((aaa) => {
        console.log(aaa);
        setUploading(false);
        alert("İletişim güncellendi " + home?.id);
        dispatch({ type: "RELOAD_TRUE" });
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  const editor = useRef(null)
  const config = { readonly: false }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        İletişim Metni Düzenle <EditIcon />
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
                İletişim Metni Düzenle
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
                primary="İletişim Metni"
                secondary={
                  <JoditEditor
                    ref={editor}
                    value={contactUsData}
                    config={config}
                    tabIndex={1}
                    onBlur={newContent => setContactUsData(newContent)}
                    onChange={() => { }}
                  />
                }
              />
            </ListItem>
          </List>
        </form>
      </Dialog>
    </div >
  );
}
