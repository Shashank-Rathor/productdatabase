import {React,useState,useEffect} from 'react';
import Navbar from '../Navbar/Navbar';
import {db} from '../../fire';
import classes from './Users.module.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const Users = ({handleLogout,email}) => {

  const [users,setUsers]=useState([]);
  const[isAdmin,setIsAdmin]=useState(false);
  const[superAdmin,setSuperAdmin]=useState(false);

  useEffect(() => {
    db.collection("users")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
     setUsers(data);

     const udata = querySnapshot.docs.filter((doc) => doc.data().email == email)
     if(udata[0]){
       {(udata[0].data().admin == true) ? setIsAdmin(true) : setIsAdmin(false);}
       {(udata[0].data().superAdmin == true) ? setSuperAdmin(true) : setSuperAdmin(false);}
   }
    });
  },[])

  const changeAdmin = (email) => {
    db.collection("users").doc(`${email}`).update({
    "admin": true
  })
     setTimeout(() => {
    window.location.reload(false)
  }, 1000);

  }

  const removeAdmin = (email) => {
    db.collection("users").doc(`${email}`).update({
    "admin": false
  })
   setTimeout(() => {
  window.location.reload(false)
}, 1000);

  }


  return (
     <div>

       <Navbar handleLogout={handleLogout}/>
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
       <div className={classes.root}>
       <Grid item xs={12} md={6}>
         <h1 className={classes.title}>
           Users
         </h1>
         <div className={classes.demo}>
         <List>
          {users.map((items, index) => (
            <Paper elevation={3} className={classes.paper}>
            <ListItem>
            {(items.admin==true) ?   <StarIcon style={{ color: "#fecd1a"}}/> : null}

              <ListItemText primary={items.email} />
              <ListItemSecondaryAction>
              {(items.admin==false && isAdmin == true) ? <Button variant="outlined" color="primary" onClick={() => changeAdmin(items.email)} className={classes.btn}>Make Admin</Button> : null}
              { (isAdmin == true && superAdmin == true) ? <Button variant="outlined" color="primary" onClick={() => removeAdmin(items.email)} className={classes.btnRem}>Remove Admin</Button> : null}
              </ListItemSecondaryAction>
              </ListItem>
                <ListItem>
                 <ListItemText primary="Created On:" />
                  <ListItemText secondary={items.creationTime}  />
                  <ListItemText primary="Last Signed in:" />
                   <ListItemText secondary={items.lastSignInTime} />
                </ListItem>
              </Paper>
          ))}
        </List>
         </div>
       </Grid>
   </div>
     </div>
  )
}

export default Users;
