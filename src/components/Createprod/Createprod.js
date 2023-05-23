import React from 'react';
import classes from './Createprod.module.css';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Button} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import instance from '../firebase/instance';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import {Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 200,
    height: 100,
  },
  rootLoad: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Createprod = (props) => {

  const [openCat, setOpenCat] = React.useState(false);
  const [catItem, setCatItem] = React.useState("");
  const [catList, setCatList] = React.useState([]);


  const { name,
    prodId,
    description,
    category,url,
    handleChange,
    handlePost,
    prods,
    handleUpload,
    handleChangeUp,
    isDuplicate,
    handleClose,
    open,
    handleChangeCat,prevList,
    isLoading
     } = props;


     React.useEffect(() => {
       instance.get("/categories.json").then((response) => {
         const fetchedResults = [];

           for (let key in response.data) {
             fetchedResults.push({
               ...response.data[key],
               id: key,
             });
           }
           setCatList(fetchedResults);
       })
     },[])

      const handleClickOpenCat = () => {
       setOpenCat(true);
     };

     const handleCloseCat = (e) => {
       setOpenCat(false);
     };

     const handlebtnCat = (e) => {
       setOpenCat(false);

       e.preventDefault();
       const data={ catItem };

       instance.post("/categories.json", data).then((response) => {
         let catListNew = [...catList]
         catListNew.push(data)

         setCatList(catListNew)
       })
       .catch((error) => {
         alert(error);
       })
     }
     const handleChangeList = (e) => {
       setCatItem( e.target.value)
     }

  return(
      <div className={classes.results_add}>
      <div className={classes.wrapper}>
      <div className={classes.wave}></div></div>
      <form
       id="addResultsForm"
       className={classes.ui_form}
       autoComplete="off"
       onSubmit={handlePost}
     >
     <Link to="/Products">
     <ArrowBackIcon className={classes.arrow}/>
     </Link>
       <h2>New Entry</h2>
       <input
         autoFocus
         name="name"
         type="text"
         required
         placeholder="Name"
         value={name}
         onChange={handleChange}
       />
       <input
         autoFocus
         name="prodId"
         type="text"
         required
         placeholder="Product Id"
         value={prodId}
         onChange={handleChange}
       />
       <span>{isDuplicate ?<Alert severity="error">Product already exist</Alert> : null}</span>
       <label>Category:
       <Tooltip title="Add">
        <IconButton aria-label="add" className={classes.del} onClick  ={handleClickOpenCat}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
         </label>
       <FormControl className={classes.formControl}>
       <InputLabel id="category">Category</InputLabel>
       <Select
         required
         name="category"
         labelId="category"
         id="category"
         value={category}
         onChange={handleChangeCat}
         style={{marginBottom:"8px"}}
       >
       {catList.map((item) => <MenuItem value={item.catItem.toLowerCase()}>{item.catItem.toLowerCase()}</MenuItem>)}
       </Select>

     </FormControl>
     <TextareaAutosize
     name="description"
     rowsMax={4}
     required
     aria-label="description"
     placeholder="Description"
     value={description}
     onChange={handleChange}
     className={classes.describe}
      />

       <label>Image: </label>
       <input
       disabled={isDuplicate}
       multiple
        type="file"
        onChange={handleChangeUp}/>
        <div className={classes.root}>
     <GridList   cellWidth={400} className={classes.gridList} cols={4}>
       {prevList.map((tile) => (
         <GridListTile key={tile} cols={tile.cols || 1}>
           <img src={tile} height= "100"/>
         </GridListTile>
       ))}
     </GridList>
   </div>

        <button className={classes.btn} onClick={handleUpload}>
         Upload
         { isLoading ? <div className={classes.rootLoad}> <LinearProgress /></div> : null}
        </button>
       <input type="submit" />
       <Snackbar
       anchorOrigin={{
         vertical: 'bottom',
         horizontal: 'left',
       }}
       open={open}
       autoHideDuration={6000}
       onClose={handleClose}
       message="Product added"
       action={
         <React.Fragment>
           <Button color="secondary" size="small" onClick={handleClose}>
             OK
           </Button>
           </React.Fragment>
      }
    />
    <Dialog open={openCat} onClose={handleCloseCat} aria-labelledby="form-dialog-title">
       <DialogTitle id="form-dialog-title">Add Category</DialogTitle>
       <DialogContent>
         <DialogContentText>
           Enter a new Category
         </DialogContentText>
         <TextField
           autoFocus
           margin="dense"
           id="category"
           label="category"
           type="email"
           fullWidth
           onChange={handleChangeList}
         />
       </DialogContent>
       <DialogActions>
         <Button onClick={handlebtnCat} color="primary">
           Ok
         </Button>
         <Button onClick={handleCloseCat} color="primary">
           Cancel
         </Button>
         </DialogActions>
     </Dialog>
     </form>

      </div>
  )
}

export default Createprod;
