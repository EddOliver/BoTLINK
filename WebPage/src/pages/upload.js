import React, { Component } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';
import '../assets/main.css';
import { connect } from 'react-redux';
import { set_contracturl_action } from "../redux/actions/syncActions/updateContractUrlaction"
import { set_pubkey_action } from "../redux/actions/syncActions/updatePublicKeyaction"
import { set_activetab_action } from '../redux/actions/syncActions/setActiveTabaction';
import autoBind from 'react-autobind';
import SimpleReactFileUpload from '../components/Upload';
import Header from '../components/header';
import { Grid } from 'react-loading-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { abi, bytecode, content } from '../contracts/nftContract';
import Web3 from 'web3';
import iot from '../assets/iot.png';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';

var unitMap = {
    'wei': '1',
    'kwei': '1000',
    'ada': '1000',
    'femtoether': '1000',
    'mwei': '1000000',
    'babbage': '1000000',
    'picoether': '1000000',
    'gwei': '1000000000',
    'shannon': '1000000000',
    'nanoether': '1000000000',
    'nano': '1000000000',
    'szabo': '1000000000000',
    'microether': '1000000000000',
    'micro': '1000000000000',
    'finney': '1000000000000000',
    'milliether': '1000000000000000',
    'milli': '1000000000000000',
    'ether': '1000000000000000000',
    'kether': '1000000000000000000000',
    'grand': '1000000000000000000000',
    'einstein': '1000000000000000000000',
    'mether': '1000000000000000000000000',
    'gether': '1000000000000000000000000000',
    'tether': '1000000000000000000000000000000'
};

class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalUrl: '',
            loading: false,
            price: 0,
            currency: 'wei',
            mintButton: true,
            nftNumber: 0,
            nftaws: "",
            devices: [],
            selection: 0,
            lat: 0,
            lng: 0,
        }
        autoBind(this);
        this.unirest = require('unirest');
        this.web3 = new Web3(window.ethereum);
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.my_pubkey.pubkey !== "" && JSON.stringify(prevProps.my_pubkey.pubkey) !== JSON.stringify(this.props.my_pubkey.pubkey)) {
            this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getDB')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    this.setState({ nftNumber: res.body.length }, () => {
                        this.props.set_activetab_action(1);
                    });
                });
                
            this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getDevices')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    var devices;
                    try {
                        devices = JSON.parse(res.body[0].devices.replaceAll("'", '"'));
                    }
                    catch (err) {
                        devices = [];
                    }
                    console.log(devices);
                    this.setState({
                        devices: devices
                    })
                });
        }

    }

    componentWillUnmount() {
        clearInterval(this.ETHCheck);
    }

    createContract() {
        this.setState({ loading: true });
        const deploy_contract = new this.web3.eth.Contract(abi());
        // Function Parameter
        let payload = {
            data: "0x" + bytecode()
        }

        let parameter = {
            from: this.props.my_pubkey.pubkey
        }

        // Function Call
        deploy_contract.deploy(payload).send(parameter, (err, transactionHash) => {
        }).on('confirmation', () => { }).then((newContractInstance) => {
            this.props.set_contracturl_action(newContractInstance.options.address);
            this.setState({ loading: false });
            this.props.set_activetab_action(3);
            var myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("X-API-Key", "XXXXXXXXXXXXXX");

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            this.ETHCheck = setInterval(() => {
                fetch(`https://deep-index.moralis.io/api/v2/${newContractInstance.options.address}/balance?chain=mumbai`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.balance !== undefined) {
                            this.props.set_activetab_action(4);
                            clearInterval(this.ETHCheck);
                        }
                    })
            }, 5000);
        });
    }

    selectionChange(e) {
        console.log(e);
        this.setState({ selection: e },
            () => {
                console.log(this.state.devices[this.state.selection]);
            });
    }

    mintNFT() {
        this.setState({ loading: true });
        const mint_contract = new this.web3.eth.Contract(abi(), this.props.my_contracturl.contracturl, { from: this.props.my_pubkey.pubkey });
        mint_contract.methods.mintNFT(this.props.my_ipfslink.ipfslink.nft, `[${this.state.lat},${this.state.lng}]` ).send().on('transactionHash', (hash) => {
            this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/pubDB')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey,
                    'data': JSON.stringify(this.props.my_nft.nft),
                    'etherscan': `https://mumbai.polygonscan.com/tx/${hash}`,
                    'contract': this.props.my_contracturl.contracturl,
                    'aws': this.props.my_ipfslink.ipfslink.nftaws,
                    'appEUI': this.state.devices[this.state.selection].appeui,
                    'devEUI': this.state.devices[this.state.selection].deveui,
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    console.log(res.body);
                    
                    this.setState({
                        loading: false,
                        finalUrl: `https://mumbai.polygonscan.com/tx/${hash}`
                    });
                });
        }).on('confirmation', () => { this.props.set_activetab_action(6) })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="body-style" style={{ fontSize: "1.5rem" }} id="body-style">
                    <div>
                        {
                            this.props.my_activetab.activetab === 0 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="#474dff" />
                                <br />
                                <br />
                                <div>
                                    Waiting for MetaMask to connect...
                                </div>
                                <br />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 1 &&
                            <div style={{ paddingTop: "4vh", width: "98%" }}>
                                <img src={iot} width="10%" />
                                <h2>
                                    How it works?
                                </h2>
                                <br />
                                <Row md="2">
                                    <Col xs={6} style={{ background: "#474dff", color: "white" }}>
                                        <br />
                                        <h2>Mint an offline asset</h2>
                                        <p />
                                        <div>
                                            1. Upload and identificator image.
                                        </div>
                                        <p />
                                        <div>
                                            2. Complete the metadata, assign a device.
                                        </div>
                                        <p />
                                        <div>
                                            3. Review the NFT history.
                                        </div>
                                        <p />
                                        <div>
                                            4. Get your product and its NFT.
                                        </div>
                                        <br />
                                    </Col>
                                    <Col xs={6} style={{ background: "white", color: "#474dff" }}>
                                        <br />
                                        <h2>Track</h2>
                                        <p />
                                        <div>
                                            1. Track your parcel.
                                        </div>
                                        <p />
                                        <div>
                                            2. Observe data feeds, powered by Chainlink.
                                        </div>
                                        <p />
                                        <div>
                                            3. After reaching terms, the hybrid smart contract will activate.
                                        </div>
                                        <p />
                                        <div>
                                            4. Enjoy a new and improved IoT experience.
                                        </div>
                                    </Col>
                                </Row>
                                <br />
                                <Button onClick={() => this.props.set_activetab_action(2)} style={{ width: "200px", borderRadius: "25px 25px 25px 25px", fontSize: "1.5rem", background: `#474dff` }}>
                                    Continue
                                </Button>
                                <br />
                                <br />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 2 &&
                            <div style={{ paddingTop: "5vh" }}>
                                <div>
                                    Deploy NFT contract on Polygon.
                                </div>
                                <textarea id="upload1" style={{ fontSize: "1rem", width: "60vw", height: "40vh", overflowY: "scroll", overflowX: "scroll", resize: "none" }} value={content()} readOnly />
                                <p />
                                <Button id="button-upload1" color="primary" style={{ fontSize: "1.5rem", borderRadius: "25px", background: ` #474dff` }} onClick={() => {
                                    document.getElementById('button-upload1').disabled = true;
                                    document.getElementById('button-upload1').innerHTML = 'Deploying...';
                                    this.createContract();
                                }}>
                                    Deploy Contract
                                </Button>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 3 &&
                            <div style={{ paddingTop: "20vh" }}>
                                <Grid fill="#474dff" />
                                <br />
                                <br />
                                <div>
                                    Waiting for Polygon network
                                </div>
                                <br />
                                <div>
                                    <a href={`https://mumbai.polygonscan.com/address/${this.props.my_contracturl.contracturl}`} target="_blank" rel="noopener noreferrer">
                                        {this.props.my_contracturl.contracturl}
                                    </a>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 4 &&
                            <div style={{ paddingTop: "12vh" }}>
                                <SimpleReactFileUpload callback={this.selectionChange} devices={this.state.devices} url={"	https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/upload-NFT-Storage"} />
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 5 &&
                            <div className="flexbox-style3">
                                <div style={{ paddingTop: "2vh" }}>
                                    <p />
                                    <LazyLoadImage width="256" height="256" alt="NFT Loading..." src={this.props.my_ipfslink.ipfslink.nftaws} />
                                    <p />
                                    <Input type="number" name="Latitude" placeholder="Latitude" onChange={(event) => {
                                        this.setState({
                                            lat: event.target.value
                                        });
                                    }} />
                                    <Input type="number" name="Longitude" placeholder="Longitude" onChange={(event) => {
                                        this.setState({
                                            lng: event.target.value
                                        });
                                    }} />
                                    <p />
                                    <Button disabled={!(this.state.lng !== 0 && this.state.lat !== 0)} id="upload3" color="primary" style={{ fontSize: "1.5rem", borderRadius: "25px", background: ` #474dff` }} onClick={() => {
                                        this.setState({ mintButton: true });
                                        document.getElementById('upload3').innerHTML = 'Minting...';
                                        this.mintNFT();
                                    }}>
                                        Mint and Post
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            this.props.my_activetab.activetab === 6 &&
                            <>
                                <div style={{ paddingTop: "2vh" }}>
                                    <LazyLoadImage width="400" height="400" alt="NFT Loading..." src={this.props.my_ipfslink.ipfslink.nftaws} />
                                </div>
                                <div style={{ paddingTop: "3vh" }}>
                                    <Button style={{ borderRadius: "25px 0px 0px 25px", fontSize: "1.5rem", borderRight: "1px solid #474dff", background: ` #474dff` }} onClick={() => window.open(this.state.finalUrl, "_blank")}>View on PolygonScan</Button>
                                    {
                                        console.log(this.state.finalUrl)
                                    }
                                    <Button style={{ borderRadius: "0px 25px 25px 0px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => window.open(`/nft/${this.props.my_pubkey.pubkey}?id=${this.state.nftNumber}`, "_blank")}>View on Products</Button>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps =
{
    set_contracturl_action,
    set_pubkey_action,
    set_activetab_action
}

const mapStateToProps = (state) => {
    return {
        my_contracturl: state.my_contracturl,
        my_pubkey: state.my_pubkey,
        my_ipfslink: state.my_ipfslink,
        my_activetab: state.my_activetab,
        my_nft: state.my_nft
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload);