import React from 'react';
import classes from './UpdateProd.module.css';
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Button} from '@material-ui/core';
import instance from '../firebase/instance';
import {projectStorage} from '../../fire.js';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {fire} from '../../fire';

import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import {Tooltip } from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
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

const UpdateProd = (props) => {

  const[name,setName] = React.useState("");
  const[prodId,setProdId] = React.useState("");
  const[category,setCategory] = React.useState("");
  const[description,setDescription] = React.useState("");
  const[url,seturl] = React.useState([]);
  const[newUrl,setNewUrl] = React.useState([]);
  const[image,setImage] = React.useState(null);
  const[id,setId] = React.useState("");
  const [catList, setCatList] = React.useState([]);
  let [prevList, setPrevList] = React.useState([]);
  let [newList, setNewList] = React.useState([]);
  const [openCat, setOpenCat] = React.useState(false);
  const [isPrev, setIsPrev] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [catItem, setCatItem] = React.useState("");
  const [openCatEdit, setOpenCatEdit] = React.useState(false);
  const [categoryEdit, setCategoryEdit] = React.useState("");


  React.useEffect(() => {
    const res = props.location.res.res.filter((result) => result.id == props.location.selIndex.selIndex[0]);
    setName(res[0].name);
    setProdId(res[0].prodId);
    setCategory(res[0].category);
    seturl(res[0].url);
    setPrevList(res[0].url);
    setDescription(res[0].description);
    setId(props.location.selIndex.selIndex[0])

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
    setNewUrl([])
  },[])

  const handleClickOpenCat = () => {
   setOpenCat(true);
 };

  const handleChangeCat = (e) => {
    setCategory( e.target.value)

  };

  const handleCloseCat = (e) => {
    setOpenCat(false);
    setOpenCatEdit(false);

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
    setCatItem( e.target.value);
    const resul=props.location.res.res.filter((result) => result.category === category);
    setNewList(resul);
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    let Data={};
    {newUrl.length!=0 ? Data = {
       name: name,
       description: description,
       category: category,
       prodId: prodId,
       url: newUrl,
       image: null
     } :  Data = {
        name: name,
        description: description,
        category: category,
        prodId: prodId,
        url: url,
        image: null
      };}


   instance.put(`/products/${id}.json`,Data).then((response) => {
     window.location.href = "/Products"

   })

  }

  const handleUpload = (e) => {
    e.preventDefault();
    var delref = projectStorage.ref().child(`images/${prodId}`)
    if(image){
    delref.listAll().then(function (result) {
            result.items.forEach(function (file) {
               file.delete();
               console.log(prevList)
            });
        }).catch(function (error) {
            // Handle any errors
        });
        image.forEach((file) => {
          setIsLoading(true);
        const uploadTask = projectStorage.ref(`images/${prodId}/${file.name}`).put(file)
        uploadTask.on('state changed', (snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if(progress === 100 ) {alert(`${file.name} uploaded`);
            setIsLoading(false);}
      },
        (error) => {console.log(error);},
        () => {projectStorage.ref(`images`).child(`${prodId}/${file.name}`).getDownloadURL()
        .then(url => newUrl.push({url}) )})
      })
    }
  };

  const handleClickOpenCatEdit = () => {
   setOpenCatEdit(true);
 };


  const handlebtnCatEdit = (e) => {
    setOpenCatEdit(false);

    e.preventDefault();
    const res = catList.filter((result) => result.catItem.toLowerCase() == category.toLowerCase())
    const data={ catItem };

    instance.put(`/categories/${res[0].id}.json`, data).then((response) => {
      let catListNew = [...catList]
      catListNew.push(data)

      setCatList(catListNew);
    })
    .catch((error) => {
      alert(error);
    })

   newList.map((item) => {
    fire.database().ref(`products/${item.id}`).update({category: catItem})
   })

  };

  const handleChangeUp = (e) => {
    const file = Array.from(e.target.files);
   setImage(file);
   setIsPrev(true);

   for(let i=0;i<file.length;i++){
        prevList[i] = URL.createObjectURL(e.target.files[i])
   }
  }

  return(
      <div className={classes.results_add}>
      <div className={classes.wrapper}>
      <div className={classes.wave}></div></div>
      <Link to="/Products">
      <ArrowBackIcon className={classes.arrow}/>
      </Link>
      <form
       id="addResultsForm"
       className={classes.ui_form}
       autoComplete="off"
       onSubmit={handleUpdate}
     >
       <h2>Update Product</h2>
       <input
         autoFocus
         name="name"
         type="text"
         required
         placeholder="Name"
         value={name}
         onChange={e => setName(e.target.value)}
       />

       <input
         autoFocus
         name="prodId"
         type="text"
         required
         placeholder="Product Id"
         value={prodId}
         onChange={e => setProdId(e.target.value)}
       />
       <label>Category:
       <Tooltip title="Add">
        <IconButton aria-label="add" className={classes.del} onClick  ={handleClickOpenCat}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
             <IconButton aria-label="edit" className={classes.del} onClick  ={handleClickOpenCatEdit}>
                 <EditIcon />
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
     <Dialog open={openCat} onClose={handleCloseCat} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new Category
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category"
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
      <Dialog open={openCatEdit} onClose={handleCloseCat} aria-labelledby="form-dialog-title">
         <DialogTitle id="form-dialog-title">Edit Category</DialogTitle>
         <DialogContent>
           <DialogContentText>
             Select a category
           </DialogContentText>
           <FormControl className={classes.formControl}>
           <InputLabel id="category">Category</InputLabel>
           <Select
             required
             name="category"
             labelId="category"
             id="category"
             value={category}
             onChange={handleChangeCat}
           >
           {catList.map((item) => <MenuItem value={item.catItem.toLowerCase()}>{item.catItem.toLowerCase()}</MenuItem>)}
           </Select>
         </FormControl>
         <DialogContentText>
          Edit
         </DialogContentText>
           <TextField
             autoFocus
             margin="dense"
             id="name"
             label="Edit"
             type="email"
             fullWidth
             onChange={handleChangeList}
           />
         </DialogContent>
         <DialogActions>
           <Button onClick={handlebtnCatEdit} color="primary">
             Ok
           </Button>
           <Button onClick={handleCloseCat} color="primary">
             Cancel
           </Button>
           </DialogActions>
       </Dialog>
       <TextareaAutosize
       name="description"
       rowsMax={4}
       aria-label="description"
       placeholder="Description"
       value={description}
       onChange={e => setDescription(e.target.value)}
       className={classes.describe}
        />
       <label>Image: </label>
       <input
        type="file"
        multiple
        onChange={handleChangeUp}/>
        <div className={classes.root}>
        {isPrev ?
            prevList.map((tile) => (
                <img src={tile} height= "200"/>

            )) :
              prevList.map((tile) => (

                  <img src={tile.url} height= "200"/>

              ))}

        </div>
        <button className={classes.btn} onClick={e => handleUpload(e)}>
        { isLoading ? <div className={classes.root}>
      <LinearProgress />
    </div> : null}
         Upload
        </button>
       <input type="submit" value="Update"/>
     </form>
      </div>
  )
}

export default UpdateProd;
