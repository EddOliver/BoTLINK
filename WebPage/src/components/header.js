import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import { Button, Row, Col } from 'reactstrap';
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { connect } from 'react-redux';
import logo from '../assets/logo.png';

class Header extends Component {
    constructor(props) {
        super(props);
        reactAutobind(this);
        this.unirest = require('unirest');
    }

    async componentDidMount() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('connect', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                console.log("Connect:" + account);
                this.props.set_pubkey_action(account);
            });
            window.ethereum.on('accountsChanged', (accounts) => {
                const account = accounts[0];
                console.log("Change:" + account);
                this.props.set_pubkey_action(account);
            });
        }
    }

    async enableEthereum() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            this.props.set_pubkey_action(account);
        }
        else {
            alert("Please install MetaMask to use this feature.")
            window.open("https://metamask.io/", "_blank");
        }
    }

    render() {
        return (
            <div className="header-style">
                <br />
                <Row style={{ fontSize: "1.2rem" }}>
                    <Col>
                        {""}
                    </Col>
                    <Col>
                        <div style={{ position: "absolute", top: "8px" }}>
                            <a className="nostyle" href="/">
                                <img src={logo} alt="logo" style={{ width: "60px" }} />
                            </a>
                        </div>
                    </Col>
                    <Col>
                        {""}
                    </Col>
                    <Col style={{ paddingTop: "8px" }}>
                        <a className="nostyle" href="/gallery">
                            Products
                        </a>
                    </Col>
                    <Col style={{ paddingTop: "8px" }}>
                        <a className="nostyle" href="/scan">
                            Scan QR
                        </a>
                    </Col>
                    {
                        this.props.my_pubkey.pubkey !== "" ?
                            <Col style={{ paddingTop: "8px" }}>
                                <a className="nostyle" href="/upload">
                                    Mint
                                </a>
                            </Col>
                            :
                            <></>
                    }
                    {
                        this.props.my_pubkey.pubkey !== "" ?
                            <Col style={{ paddingTop: "8px" }}>
                                <a className="nostyle" href="/devices">
                                    Devices
                                </a>
                            </Col>
                            :
                            <></>
                    }
                    <Col>
                        <Button onClick={this.enableEthereum} style={{ width: "200px", borderRadius: "25px", fontSize: "1.2rem", background: `#474dff` }} color="primary">{
                            this.props.my_pubkey.pubkey !== "" ?
                                "Connected"
                                :
                                "Connect Wallet"
                        }</Button>
                    </Col>
                    <Col>
                        {""}
                    </Col>
                </Row>
                <div className="myhr-header" />
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_pubkey_action
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);