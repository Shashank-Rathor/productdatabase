import { React, useEffect, useState} from 'react';
import Prodet from '../../components/Prodet/Prodet';
import { Link } from 'react-router-dom';
import classes from './Products.module.css';
import { Button } from "@material-ui/core";
import Navbar from '../Navbar/Navbar';
import Footer from '../../components/Footer/footer';
import ProdList from '../../components/ProdList/ProdList';
import instance from '../../components/firebase/instance';
import UpdateProd from '../../components/UpdateProd/UpdateProd';
import TextField from '@material-ui/core/TextField';
import { db } from '../../fire';
import {ExcelRenderer, OutTable} from 'react-excel-renderer';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';



const Products = ({handleLogout,userId,email}) => {
  const[prods,setProds]=useState([]);
  const[isAdmin,setIsAdmin]=useState(false);
  const[isLoading,setIsLoading]=useState(false);
  const [open, setOpen] = useState(false);
  const[excelData, setExcelData] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);


 const handleCloseSnack = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }

   setOpenSnack(false);

     window.location.href = "/Products"
 };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    instance.get("/products.json").then((response) => {
      const fetchedResults = [];

        for (let key in response.data) {
          fetchedResults.push({
            ...response.data[key],
            id: key,
          });
        }

        setProds({
          prods: fetchedResults,
        });
    })
    db.collection("users")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.filter((doc) => doc.data().email == email)
      if(data[0]){
      {(data[0].data().admin == true) ? setIsAdmin(true) : setIsAdmin(false);}
    }
    });
  },[])


  const fileHandler = (event) => {
    let fileObj = event.target.files[0];

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if(err){
        console.log(err);
      }
      else{
        resp.rows.map((item) => {
          excelData.push({
            prodId: item[0],
            name: item[1],
            category: item[2],
            description: item[3],
            })
        })
      }
    });
    }

    const importHandler = (e) => {
      setIsLoading(true);
      console.log(excelData);
      setExcelData([]);

      e.preventDefault();
      excelData.map((item) => {
        const Data = {
        name: item.name,
        description: item.description,
        category:item.category,
        prodId: item.prodId,
        url: [""]
      };

      instance.post("/products.json", Data).then((response) => {
        setIsLoading(false);
        setOpenSnack(true);

      })
      .catch((error) => {
        alert(error);
      })
      })

    }

  return (
    <div>
     <Navbar handleLogout={handleLogout}>
     <div className={classes.area} >
          <ul className={classes.circles}>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
          </ul>
  </div >
     {isAdmin ?  <Link to={{
        pathname: `/Prodet`,
        data:  'add'
      }} className={classes.linkitems}>
      <Button variant="contained" color="primary" className={classes.btn}>
      Add Product
      </Button>
      </Link> : null}
      {isAdmin ?
       <Button variant="contained" color="primary" className={classes.btn} onClick={() => handleClickOpen()}>
       Import Product
       </Button> : null}

       <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
       <DialogTitle id="form-dialog-title">Import</DialogTitle>
       <DialogContent>
         <DialogContentText>
           Select the excel file
         </DialogContentText>
         <input
         multiple
          type="file"
          onChange={(e) => fileHandler(e)}/>
       </DialogContent>
       <DialogActions>
         <Button onClick={handleClose} color="primary">
           Cancel
         </Button>
         <Button onClick={handleClose} color="primary" onClick={(e) => importHandler(e)}>
           Ok
         </Button>
         {isLoading ? <div className={classes.root}>
         <CircularProgress />
         </div> : null}
       </DialogActions>
     </Dialog>

     <ProdList
     isAdmin={isAdmin}
     prods={prods}
     />

     <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
        message="Products added"
        action={
          <>
            <Button color="secondary" size="small" onClick={handleCloseSnack}>
              Ok
            </Button>
          </>
        }
      />
      
     </Navbar>
     </div>
  )
}

export default Products;
