import React from "react";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import {Drawer,AppBar,Toolbar,CssBaseline,Typography} from "@material-ui/core";
import {List,ListItem,ListItemIcon,ListItemText,Divider,IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { Button } from '@material-ui/core';
import LOGO from '../../assets/logo.png';

import useStyles from './styles';

import { Link } from 'react-router-dom';

import {SidebarData} from '../../components/SidebarData.js';


const Navbar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
            })}
          >
            <MenuIcon />
          </IconButton>
          <img src={LOGO} width="40" style={{marginRight: '40px'}}/>
          <Typography variant="h5" style={{color: 'black'}}>
            <b>Prajwal Healthcare</b>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
      >
        <div className={classes.toolbar}>
        <Button variant="contained" color="primary"  className={classes.btn} onClick={props.handleLogout}>
          Logout
        </Button>
          <IconButton onClick={handleDrawerClose} className={classes.close}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
         {SidebarData.map((items, index) => (

           <Link  key={index} to={items.path} className={classes.linkitems}>
           <ListItem button key={items.title}>
             <ListItemIcon >
               {items.icon}
             </ListItemIcon>
             <ListItemText primary={items.title} />
           </ListItem>
           </Link>
         ))}
       </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  );
}

export default Navbar;
