import React, { Component } from 'react';
import { Col, Input, Row, Button } from 'reactstrap';
//import { FaDiscord } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import logo from '../assets/logof.png';
import ipfs from '../assets/IPFS.png';
import polygon from '../assets/polygon.png';
import moralis from '../assets/moralis.png';
import chainlink from '../assets/chainlink.png';
import { connect } from 'react-redux';

class Footer extends Component {

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div id="footer-content" className="footer-style" style={{ overflowY: "hidden", overflowX: "hidden" }}>
                <div id="footer-mover" style={{ backgroundColor: '#333' }}>
                </div>
                <br />
                <div id="footer-div1">
                    <Row style={{ fontSize: "1.2rem" }}>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <img src={logo} alt="logos" style={{ width: "auto", height: "100px", paddingBottom: "2vh" }} />
                            <div className="flexbox-style">
                                <div>
                                    <Input style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem", width: "30vw" }} type="email" placeholder="Subscribe and stay up to date" />
                                </div>
                                <div>
                                    <Button style={{ width: "12vw", borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: `#474dff`, borderWidth: "2px", borderColor: "white" }}>
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ width: "30vw" }}>
                                <div>
                                    Follow BoTLINK!
                                </div>
                                <p />
                                <Row>
                                    <Col>
                                        <FaTwitter
                                            onClick={() => window.open("https://twitter.com/BoTLINK_", "_blank")}
                                            style={{ fontSize: "4rem", color: "#1DA1F2" }}
                                        />
                                    </Col>

                                    <Col>
                                        <FaFacebook
                                            onClick={() => window.open("https://www.facebook.com/Botlink-102160675641657", "_blank")}
                                            style={{ fontSize: "4rem", color: "#4267B2" }}
                                        />
                                    </Col>
                                    <Col>
                                        <FaYoutube
                                            onClick={() => window.open("https://www.youtube.com/watch?v=Tymdr2j9Dug", "_blank")}
                                            style={{ fontSize: "4rem", color: "#FF0000" }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                    </Row>
                </div>
                <hr />
                <div id="footer-div2" style={{ paddingBottom: "1vh" }}>
                    <Row>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ color: "white", fontWeight: "bolder", fontSize: "1.7rem", width: "40vw" }}>
                                Welcome to BoTLINK
                                <p />
                                NFTizing and connecting blockchains with the Internet of Things.
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                        <Col>
                            <div style={{ color: "white", width: "40vw" }}>
                                <Row md="2">
                                    <Col>
                                        <div>
                                            <div style={{ fontSize: "1.3rem", fontWeight: "bolder" }}>
                                                BoTLINK
                                            </div>
                                            <Col>
                                                <a className="nostyle" href="/gallery">
                                                    Products
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="https://github.com/EddOliver/BoTLINK" target="_blank" rel="noopener noreferrer">
                                                    FAQ's
                                                </a>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <div style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                                                Connect
                                            </div>
                                            <Col>
                                                <a className="nostyle" href="https://twitter.com/BoTLINK_" target="_blank" rel="noopener noreferrer">
                                                    Twitter
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="https://www.youtube.com/watch?v=Tymdr2j9Dug" target="_blank" rel="noopener noreferrer">
                                                    YouTube
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="hhttps://www.facebook.com/Botlink-102160675641657" target="_blank" rel="noopener noreferrer">
                                                    Facebook
                                                </a>
                                            </Col>
                                            <Col>
                                                <a className="nostyle" href="mailto:botlinknft@protonmail.com">
                                                    Contact
                                                </a>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col>
                            {""}
                        </Col>
                    </Row>
                </div>
                <hr />
                <div id="footer-div3" style={{ paddingBottom: "2vh" }}>
                    <Row>
                        <Col>
                            Build on <img alt="imagens" src={polygon} height="20px" /> powered by<img alt="imagsens" src={ipfs} height="20px" /> pumped by <img alt="imagens" src={moralis} height="20px" /> connected by <img alt="imagens" src={chainlink} height="30px" />
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                            <div style={{ textAlign: "end" }}>
                                <div className="flexbox-style">
                                    <div style={{ paddingRight: "10px" }}>
                                        <a className="nostyle" href="/privacy" target="_blank">
                                            Privacy Policy
                                        </a>
                                    </div>
                                    <div>
                                        <a className="nostyle" href="/terms" target="_blank">
                                            Terms of Use
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey
    }
}

export default connect(mapStateToProps, null)(Footer)