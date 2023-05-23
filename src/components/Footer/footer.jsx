/* eslint-disable */
import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';
import classes from './footer.module.css';

const Footer = () => {
    return (
        <div className={classes.main} id="footer">
            <Container>
                <Row>
                    <Col lg="3" md="6" className="m-b-30">
                        <h5 className="m-b-20">Address</h5>
                        <p> 374, 19th Main Rd, 1st Block, Rajajinagar, Bengaluru, Karnataka 560010</p>
                    </Col>
                    <Col lg="3" md="6" className="m-b-30">
                        <h5 className="m-b-20">Phone</h5>
                        <p>Mobile :  +91 9108740369</p>
                        <p>Office :  (080) 4545 1511</p>
                    </Col>
                    <Col lg="3" md="6" className="m-b-30">
                        <h5 className="m-b-20">Email</h5>
                        <p>Office : naveen@rehamo.com</p>
                    </Col>
                    <Col lg="3" md="6">
                        <h5 className="m-b-20">Social</h5>
                        <div className="round-social light" >
                            <a href="https://www.facebook.com/rehamoexperiencestore/" className="link"><i className="fa fa-facebook"></i></a>
                            <a href="https://twitter.com/rehamocares?lang=en" className="link"><i className="fa fa-twitter"></i></a>
                            <a href="https://www.instagram.com/rehamo.experiencestore/?hl=en" className="link"><i className="fa fa-instagram"></i></a>
                            <a href="https://www.youtube.com/channel/UC3QpAjsBT6SGFbUb0Dr6cUg" className="link"><i className="fa fa-youtube"></i></a>
                        </div>
                    </Col>
                </Row>
                <div className="f4-bottom-bar">
                    <Row>
                        <Col md="12">
                            <div className="d-flex font-14">
                                <div className="m-t-10 m-b-10 copyright">All Rights Reserved by Rehamo.</div>
                               <div className="links ml-auto m-t-10 m-b-10">
                                    <Link className="p-10" to={"/about"} style={{color: "white"}}>About Us</Link>
                                    <Link className="p-10" to={"/privacy"} style={{color: "white"}}>Privacy Policy</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
}
export default Footer;
