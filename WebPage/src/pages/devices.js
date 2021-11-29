import React, { Component } from 'react';
import Header from '../components/header';
import autoBind from 'react-autobind';
import { Button, Card, CardBody, FormGroup, Input, Label, Form, Row, Col, CardFooter, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons'

String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
}

function randomHexString(min, max) {
    return Math.floor(Math.random() * (max - min) + min).toString(16);
}
class Devices extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.state = {
            appeui: "",
            deveui: "",
            devices: []
        }
        this.unirest = require('unirest');
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.my_pubkey.pubkey !== "" && JSON.stringify(prevProps.my_pubkey.pubkey) !== JSON.stringify(this.props.my_pubkey.pubkey)) {
            this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getDevices')
                .headers({
                    'pubkey': this.props.my_pubkey.pubkey
                })
                .end((res) => {
                    if (res.error) throw new Error(res.error);
                    console.log(res.body);
                    try {
                        var devices = JSON.parse(res.body[0].devices.replaceAll("'", '"'));
                    }
                    catch (err) {
                        var devices = [];
                    }
                    devices.push({
                        "appeui": randomHexString(0x6000000000000000, 0x6999999999999999),
                        "deveui": randomHexString(0x6000000000000000, 0x6999999999999999),
                    });
                    devices.push({
                        "appeui": randomHexString(0x6000000000000000, 0x6999999999999999),
                        "deveui": randomHexString(0x6000000000000000, 0x6999999999999999),
                    });
                    devices.push({
                        "appeui": randomHexString(0x6000000000000000, 0x6999999999999999),
                        "deveui": randomHexString(0x6000000000000000, 0x6999999999999999),
                    });
                    devices.push({
                        "appeui": randomHexString(0x6000000000000000, 0x6999999999999999),
                        "deveui": randomHexString(0x6000000000000000, 0x6999999999999999),
                    });
                    devices.push({
                        "appeui": randomHexString(0x6000000000000000, 0x6999999999999999),
                        "deveui": randomHexString(0x6000000000000000, 0x6999999999999999),
                    });
                    this.setState({
                        devices: devices
                    })
                });
        }
    }

    formCallback(data) {
        if (data.target.id === "appeui") {
            this.setState({
                appeui: data.target.value
            })
        }
        else if (data.target.id === "deveui") {
            this.setState({
                deveui: data.target.value
            })
        }
    }

    addDevice() {
        this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getDevices')
            .headers({
                'pubkey': this.props.my_pubkey.pubkey
            })
            .end((res) => {
                if (res.error) throw new Error(res.error);
                try {
                    var devices = JSON.parse(res.body[0].devices.replaceAll("'", '"'));
                }
                catch (err) {
                    var devices = [];
                }
                var found = false;
                console.log(devices);
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].deveui === this.state.deveui && devices[i].appeui === this.state.appeui) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    devices.push({
                        appeui: this.state.appeui,
                        deveui: this.state.deveui,
                    })
                    this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/putDevices')
                        .headers({
                            'pubkey': this.props.my_pubkey.pubkey,
                            "devices": JSON.stringify(devices).replaceAll('"', "'")
                        })
                        .end((res) => {
                            if (res.error) throw new Error(res.error);
                            alert("Device added successfully!");
                        });
                }
                else {
                    alert("Device already exists");
                }
            });
    }

    render() {
        return (
            <div className="App" style={{ background: "whitesmoke" }}>
                <Header />
                <Card style={{ minWidth: "30vw", maxWidth: "50vw", borderRadius: "10px", top: "15vh", left: "25vw" }}>
                    <CardBody>
                        <Form onChange={this.formCallback}>
                            <FormGroup>
                                <Label>App EUI</Label>
                                <Input id="appeui" type="text" name="appeui" placeholder="XXXXXXXXX" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Dev EUI</Label>
                                <Input id="deveui" type="text" name="deveui" placeholder="XXXXXXXXX" />
                            </FormGroup>
                        </Form>
                        <Button onClick={this.addDevice} style={{ marginTop: "20px", width: "30vw", height: "6vh", fontSize: "1.2rem", background: "#474dff", color: "white", borderRadius: "25px" }}>
                            Add Device
                        </Button>
                    </CardBody>
                </Card>
                <Row md="2" style={{ width: "90vw", marginLeft: "5vw" }}>
                    {this.state.devices.map((device, i) => {
                        return (
                            <Col xs="6" key={i} style={{ marginTop: "1vh" }}>
                                <Card style={{ minWidth: "30vw", maxWidth: "50vw", borderRadius: "10px", top: "15vh" }}>
                                    <CardBody>
                                        Device {i + 1} {" "} {
                                            i === 0 ?
                                                <CardText>Online{" "}<FontAwesomeIcon style={{ color: "green" }} icon={faCircle} /></CardText> :
                                                <CardText>Offline{" "}<FontAwesomeIcon style={{ color: "red" }} icon={faCircle} /></CardText>
                                        }
                                    </CardBody>
                                    <CardFooter>
                                        DevEUI: {device.deveui}, AppEUI: {device.appeui}
                                    </CardFooter>
                                    <CardFooter>
                                        Temperature and Humidity Sensor
                                    </CardFooter>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
                <p />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        my_pubkey: state.my_pubkey,
    }
}

export default connect(mapStateToProps, null)(Devices);