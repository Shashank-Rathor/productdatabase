import {React,useEffect,useState} from 'react';
import { Container,Row,Col } from 'react-bootstrap';
import instance from '../../components/firebase/instance';
import { useHistory, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import classes from './ProdDescription.module.css';
import {Typography,Paper} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {Link} from 'react-router-dom';
import jsPDF from 'jspdf';
import utf8 from 'utf8';
import LinearProgress from '@material-ui/core/LinearProgress';

const ProdDescription = (props) => {

  const[prods,setProds]=useState({});
  const[img,setImg]=useState({});
  const[url,setUrl]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  let history = useHistory();
  const { id } = useParams();



  useEffect(() => {
    instance.get("/products/" + id + ".json").then((response) => {
      let fetchedResults = [];


      fetchedResults=response.data
      setProds(fetchedResults);
      setImg(fetchedResults.url)
      setUrl(fetchedResults.url)

    })

  },[])

  const generatePDF = (e) => {
    e.preventDefault();
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
       `${prods.prodId}`,
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
       `${prods.name}`,
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
     utf8.decode (`${prods.description}`),
      100 * 2.83,
      86 * 2.83,
      {
   maxWidth: 280,
   align: 'justify'
   }
    );

     // doc.addImage(imageData, format, x, y, width, height);
     let j=0;
     for(let i=0;i<url.length;i++){
       var img = document.createElement('img');
       img.src = url[i].url;
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

  doc.save(`${prods.name}.pdf`)
}


  return(
    <>
    <Navbar/>
    <Container>
  <Row>
  <Link to="/Products" className={classes.lin}>
  <CloseIcon color="primary" style={{fontSize: "40px"}} className={classes.lin}/>
  </Link>
    <Col lg={12} md={12} xs={12}><h4 className={classes.title}>Product Description</h4></Col>
  </Row>
  <Row>
  { img[0] ?
    <Col ><ul>{img.map((item) => <Paper elevation={5} className={classes.paper}><li>
    <img height= "400" width="400" src={item.url}/></li></Paper>)}</ul>
    </Col> : null}
    <Col>
    <h4>Product Id:</h4>
    <h5>{prods.prodId}</h5>
    <h4>Name:</h4>
    <h5>{prods.name}</h5>
    <h4>Category:</h4>
    <h5>{prods.category}</h5>
    <h4>Description:</h4>
    <h5 style={{textAlign: 'justify'}}>{prods.description}</h5>
    </Col>
  </Row>
</Container>
<button onClick={(e) => generatePDF(e)}>
    {isLoading ?  <LinearProgress /> : null}
    Download Pdf</button>
</>
  )
}

export default ProdDescription;
