 import React from 'react';
 import Navbar from '../Navbar/Navbar';
 import classes from './Dashboard.module.css';

 import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import sample1 from '../../assets/videos/products.mp4';
import sample2 from '../../assets/videos/sample2.mp4';
import { Container,Row,Col } from 'react-bootstrap';
import Divider from '@material-ui/core/Divider';
import Footer from '../../components/Footer/footer';

 const Dashboard = ({handleLogout}) => {
   return (
      <div className={classes.background}>
        <img src="https://meteor-strike.com/wp-content/uploads/2019/03/server-room-camera-pan-cold-tint_s6zil2zgpl_thumbnail-full05.png" className={classes.back}/>
          <Navbar handleLogout={handleLogout}/>

          <h1 className={classes.title}>Product <br/> Information <br/> Management(PIM)</h1>
          <div className={classes.root}>
          <h3 className={classes.leftTitle} style={{marginBottom: '30px'}}>
            Why Prajwal PIM System?
           </h3>
          <h5>  A Product Information Management System enables the user to manage all the information and business needs that
            one needs to sell and market the products within a single system which thereby increases the business agility
            with effective content and process efficiency.</h5>
            <h5>
             Prajwal PIM System, we have created high-scale enterprise grade solution which enables businesses to manage, analyse and find
              the required product information. We use high-grade and best in class PIM system where you can update the basics
              of product which helps to develop highly collaborative efficient digital supply chain and thus reducing manual processes.
               The PIM System also helps the user to search the required product in a short span of time and provide the
               necessity information to the customers and clients.
            </h5>
                </div>
            <Divider style={{marginBottom: '150px', width: '74%', marginLeft: '200px'}}/>
            <Container >
              <Row style={{marginBottom: '150px'}}>
              <Col>
              <h1 className={classes.leftTitle}>View & Search Products</h1>
              <h5>View products in table and in descriptive mode.<br/> Search products with names, categories or product id. </h5>
              </Col>
              <Col>
              <video className={classes.vid} autoPlay loop muted>
              <source src={sample1} type='video/mp4' />
              </video>
              </Col>
              </Row>
              <Divider style={{marginBottom: '150px'}}/>
              <Row>
              <Col>
              <video className={classes.vid} autoPlay loop muted>
              <source src={sample2} type='video/mp4' />
              </video>
              </Col>
              <Col>
              <h1 className={classes.rightTitle}>Add & Modify Products</h1>
              <h5 style={{textAlign: 'right'}}>Admin can add new products,edit or delete the products. </h5>
              </Col>
              </Row>
            </Container>
            <Footer/>
      </div>
   )
 }

 export default Dashboard;
