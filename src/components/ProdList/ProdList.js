import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {Table,TableBody,TableCell,TableContainer,TableHead,
  TablePagination,TableRow,TableSortLabel,Toolbar,Typography,
  Paper,Checkbox,IconButton,Tooltip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from "@material-ui/icons/FilterList";
import instance from '../firebase/instance';
import {projectStorage} from '../../fire';
import { Link } from 'react-router-dom';
import Prodet from '../Prodet/Prodet';
import ProdDetails from '../../containers/ProdDetails/ProdDetails';
import ProdDescription from '../../containers/ProdDescription/ProdDescription'
import VisibilityIcon from '@material-ui/icons/Visibility';
import jsPDF from 'jspdf';
import utf8 from 'utf8';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import GetAppIcon from '@material-ui/icons/GetApp';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


import Modal from 'react-modal';
Modal.setAppElement("#root");


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


const headCells = [

  {
    id: "prodId",
    numeric: false,
    disablePadding: false,
    label: "Product Id"
  },
  {
    id: "image",
    numeric: true,
    disablePadding: true,
    label: "Image"
  },
  {
    id: "name",
    numeric: true,
    disablePadding: true,
    label: "Name"
  },
  { id: "category", numeric: true, disablePadding: false, label: "Category" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    isAdmin
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
      {isAdmin ? <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={rowCount > 0 && numSelected === rowCount}
          onChange={onSelectAllClick}
          inputProps={{ "aria-label": "select all desserts" }}
        />
      </TableCell> : null}

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >

              <strong>{headCell.label}</strong>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    }
  },
  del: {
    width: 50
  },
  container: {
    ['@media (max-width:479px)']: { // eslint-disable-line no-useless-computed-key
      top: '-20px',
      left: '10px'
    }
  },
  formControl: {
    ['@media (max-width:479px)']: { // eslint-disable-line no-useless-computed-key
      top: '60px',
      marginBottom: '40px',
      left: '-100px'
    }
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%",
    color: '#bc6ff1'
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [open, setOpen] = React.useState(false);
  const { numSelected,modalIsOpen } = props;
  const { selIndex,setSelIndex,handleModalOpen } = props;
  const { res,query,setQuery,coloumnToQuery,setColoumnToQuery } = props


  function  Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleOpen = () => {
   setOpen(true);
 };

 const handleClose = (event, reason) => {
   if (reason === 'clickaway') {
     return;
   }

   setOpen(false);
 };

  const handleRemove = (selIndex) => {
    {selIndex.map((id) => {
    instance.delete(`/products/${id}.json`).then((response) => {
        window.location.reload(false);
        setSelIndex([]);
      })
    } )
    }

    let prod = "";

      {res.map((item) => {(item.id === selIndex[0]) ? prod = (item.prodId) : prod=""})}

      var delref = projectStorage.ref().child(`images/${prod}`)
      delref.listAll().then(function (result) {
              result.items.forEach(function (file) {
                 file.delete();
              });
          }).catch(function (error) {
              // Handle any errors
          });

    {/*var desertRef = projectStorage.ref(`images/${image.name}`)
    desertRef.delete().then((response) => {
      console.log("deleted")
    })
    .catch(() => {
      console.log("error")
    })*/}
  }
  const handleChange = (event) => {
    setColoumnToQuery(event.target.value);
  };
  const generatePDF = (selIndex) => {
    const result=[];

    {selIndex.map((id) => {
      res.map((item) => {if (item.id === id){
        result.push(item)
      }})
    } )
    }

    result.map((item) => {
      const doc = new jsPDF("p", "pt", "a4"); // default values

       // set font
       doc.setFont("Lato-Regular", "bold");

       // font size
       doc.setFontSize(20);

       // title, centered around x
       // doc.text(text, x, y, flags, angle, align);
       doc.text(
         "Product Description",
         105 * 2.83,
         20 * 2.83,
         null,
         null,
         "center"
       );
       doc.line(75 * 2.83,22 * 2.83,135 * 2.83,22 * 2.83);


       doc.setFontSize(15);
       doc.setFont('Lato-Regular', 'bold');
       doc.text(
         `Product Id:`,
         100 * 2.83,
         45 * 2.83,
         null,
         null
       );

       doc.setFont('courier', 'normal');
       doc.text(
         `${item.prodId}`,
         100 * 2.83,
         51 * 2.83,
         null,
         null
       );

         doc.setFont('Lato-Regular', 'bold');
       doc.text(
         `Name:`,
         100 * 2.83,
         59 * 2.83,
         {
      maxWidth: 280,
      align: 'justify'
      }
       );

        doc.setFont('courier', 'normal');
       doc.text(
         `${item.name}`,
         100 * 2.83,
         65 * 2.83,
         {
      maxWidth: 280,
      align: 'justify'
      }
       );



        doc.setFont('Lato-Regular', 'bold');
       doc.text(
        utf8.decode (`Description:`),
         100 * 2.83,
         80 * 2.83,
         {
      maxWidth: 280,
      align: 'justify'
      }
       );
       doc.setFont('courier', 'normal');
      doc.text(
       utf8.decode (`${item.description}`),
        100 * 2.83,
        86 * 2.83,
        {
     maxWidth: 280,
     align: 'justify'
     }
      );

       // doc.addImage(imageData, format, x, y, width, height);
       let j=0;
       for(let i=0;i<item.url.length;i++){
         var img = document.createElement('img');
         img.src = item.url[i].url;
           doc.addImage(
              img,
              "JPEG",
              15 * 2.83,
              (j+40) * 2.83,
              70 * 2.83,
              80 * 2.83
            );
            j=j+90;
       }

    doc.save(`${item.name}.pdf`)
    })

}

  const submit = (selIndex) => {


    confirmAlert({
      title: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleRemove(selIndex)
        },
        {
          label: 'No',
          onClick:  (e) => handleOpen(e)
        }
      ]
    });
  };


  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
          align="center"
        >
          Products <br/>/ {res.length} Results
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
        <Tooltip title="Download">
        <IconButton aria-label="download" className={classes.del} onClick={(e) => generatePDF(selIndex)}>
            <GetAppIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
        <IconButton aria-label="delete" className={classes.del} onClick={(e) => submit(selIndex)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
         <Link to= {{
           pathname: `/UpdateProd`,
           selIndex: {selIndex},
              res: {res}
         }}
         className={classes.linkitems}>
        <Tooltip title="Edit">
        <IconButton aria-label="edit" className={classes.del}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        </Link>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert  onClose={handleClose} severity="error">Not Deleted!</Alert>
      </Snackbar>
      </>
      ) : (
        <>
        <TextField
        className={classes.container}
        id="standard-basic"
        label="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        />
         <FormControl className={classes.formControl}>
        <InputLabel style={{marginLeft: 30}}>Coloumn</InputLabel>
        <Select
          labelId="select-a-coloumn"
          value={coloumnToQuery}
          onChange={handleChange}
          style={{width:150,marginRight: 60,marginLeft: 30}}
        >
          <MenuItem value="prodId">Product Id</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="category">Category</MenuItem>
        </Select></FormControl>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "93%",
    position: "absolute",
    top: "25%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    ['@media (max-width:479px)']: { // eslint-disable-line no-useless-computed-key
      width: '85%'
    }
  },
  del: {
    width: 50
  },
  table: {
    minWidth: 750
  },
  modal: {
    margin: "6rem",
    width: "75rem",
    height: "32rem",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default function ProdList({prods,isAdmin}) {
  const classes = useStyles();
  let [res,setRes] = React.useState([])
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [prevImg, setPrevImg] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [selIndex,setSelIndex] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const[modalIsOpen, setModalIsOpen] = React.useState(false);

    const [query, setQuery] = React.useState("");
    const [coloumnToQuery, setColoumnToQuery] = React.useState("name");

  const handleModalOpen = (event, prodId) => {
    setModalIsOpen(true);
    const selectedIndex = selected.indexOf(prodId);
    let newSelIndex = [];
    if (selectedIndex === -1) {
      newSelIndex = newSelIndex.concat(selected, prodId);
    } else if (selectedIndex === 0) {
      newSelIndex = newSelIndex.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelIndex = newSelIndex.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelIndex = newSelIndex.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelIndex(newSelIndex);
  }

  const handleModalClose = () => {
    setModalIsOpen(false)
  }


  React.useEffect(() => {
    if(prods.prods){
    setRes( prods.prods)}
  },[prods.prods])


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = res.map((n) => n.id);
      setSelected(newSelecteds);
      const newSelIndexs = res.map((n) => n.id);
      setSelIndex(newSelIndexs);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelIndex = [];
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      newSelIndex = newSelIndex.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelIndex = newSelIndex.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelIndex = newSelIndex.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      newSelIndex = newSelIndex.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    setSelIndex(newSelIndex);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, prods.length - page * rowsPerPage);

    const lowerCaseQuery = query.toLowerCase();

    {query ? res = res.filter(x => x[coloumnToQuery].toLowerCase().includes(lowerCaseQuery)): res = res}

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
        numSelected={selected.length}
        selIndex={selIndex}
        res={res}
        setSelIndex={setSelIndex}
        modalIsOpen={modalIsOpen}
        handleModalOpen={handleModalOpen}
        query={query}
        setQuery={setQuery}
        coloumnToQuery={coloumnToQuery}
        setColoumnToQuery={setColoumnToQuery}
        />
        <TableContainer id="pdfdiv">
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              isAdmin={isAdmin}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              rowCount={res.length}
            />
            <Modal
            isOpen={modalIsOpen}
            className={classes.modal}
            onRequestClose={() => handleModalClose()}
            style={{
              overlay: {
                backgroundColor: "rgba(255, 255, 255, 0.4)"
              },
              content: {
                border: "none",
                background: "#ebebeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }
            }}><ProdDetails res={res} selIndex={selIndex}/>
            </Modal>
            <TableBody>
              {res
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >{isAdmin ?   <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell> : null}

                      <TableCell
                      checked={isItemSelected} >  <Link style={{color: "black", textDecoration: 'none'}} to={{
                         pathname: `/ProdDescription/${row.id}`,
                         data:  'add'
                       }} className={classes.linkitems}>{row.prodId}</Link></TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                      > <Link style={{color: "black", textDecoration: 'none'}} to={{
                         pathname: `/ProdDescription/${row.id}`,
                         data:  'add'
                       }} className={classes.linkitems}>{row.url ? <img src={row.url[0].url} height="50" width="50"/> : null}
                      </Link>
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                        checked={isItemSelected}
                      ><Tooltip title="Details">
                      <IconButton aria-label="details" className={classes.del} onClick={(e) =>handleModalOpen(e, row.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip> <Link style={{color: "black", textDecoration: 'none'}} to={{
                         pathname: `/ProdDescription/${row.id}`,
                         data:  'add'
                       }} className={classes.linkitems}>
                        {row.name}</Link>

                      </TableCell>

                      <TableCell
                      checked={isItemSelected}
                        align="right"> <Link style={{color: "black", textDecoration: 'none'}} to={{
                           pathname: `/ProdDescription/${row.id}`,
                           data:  'add'
                         }} className={classes.linkitems}>{row.category}</Link></TableCell>

                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height:  53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={res.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
      </Paper>
    </div>
  );
}
