import React from 'react';
import {Typography,Paper} from '@material-ui/core';
import classes from './ProdDetails.module.css';
import { Container,Row,Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


const ProdDetails = ({res, selIndex}) => {

  const[details,setDetails]=React.useState([]);
  const[image,setImage]=React.useState([]);


  React.useEffect(() => {
      res =res.filter((result) => result.id == selIndex[0]);
      setDetails(res[0]);
      if(res[0].url[0]){
        setImage(res[0].url[0].url)
      }
  },[])

  return(
    <Container>
  <Row>
  <Paper elevation={3} style={{marginLeft: 80, marginRight: -300}}>
    <img src={image} className={classes.image} height= "100" width="200"/></Paper>
    <Col></Col>
    <Col className={classes.body}>
    <Typography variant="h5" style={{fontFamily: 'Alfa Slab One'}} className={classes.heading}>{details.name}</Typography>
    <h4>Product Id:</h4>
    <h5>{details.prodId}</h5>
    <h4>Category:</h4>
    <h5>  {details.category}</h5>
    <Link style={{textDecoration: 'none'}} to={{
       pathname: `/ProdDescription/${details.id}`
     }} className={classes.btn}>
    <Button  variant="contained">More...</Button>
    </Link>
    </Col>
  </Row>
</Container>
  );
}

export default ProdDetails;
