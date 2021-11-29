import '../assets/main.css';
import { Component } from 'react';
import autoBind from 'react-autobind';
import Header from '../components/header';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardTitle, Col } from 'reactstrap';
import { Grid } from 'react-loading-icons';
import { abi } from '../contracts/nftContract';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import maticToken from "../assets/matic-token.png"
import { connect } from 'react-redux';
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const dataweb3 = createAlchemyWeb3("https://polygon-mumbai.g.alchemy.com/v2/XXXXXXXXXXXXXX");

function stringToLowerCase(str) {
  return str.toLowerCase();
}

class Artist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
      prices: [],
      status: [],
      orders: [],
      orderState: "0",
      LabelOrder: "Activate Orders",
      buttonDisabled: false,
      pendingButton: false
    }
    autoBind(this);
    this.unirest = require('unirest');
    this.url_params = new URLSearchParams(this.props.location.search)
  }

  async componentDidMount() {
    const pub = stringToLowerCase(this.props.match.params.pub)
    this.updateData();
    this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getDB')
      .headers({
        'pubkey': pub
      })
      .end((res) => {
        if (res.error) throw new Error(res.error);
        if (res.body.length > 0) {
          let temp = [];
          for (let i = 0; i < res.body.length; i++) {
            temp.push("0");
          }
          this.setState({
            elements: res.body,
            prices: temp
          }, () => {
            for (let i = 0; i < res.body.length; i++) {
              this.updatePrice(res.body[i]["Contract"], i)
            }
          });
        }
      });
  }

  updatePrice(contract, id) {
    const mint_contract = new dataweb3.eth.Contract(abi(), contract);
    mint_contract.methods.flag().call().then(status => {
      let temp = this.state.status;
      temp[id] = status;
      this.setState({
        status: temp
      });
    });
    mint_contract.methods.price().call().then(price => {
      let temp = this.state.prices;
      temp[id] = price;
      this.setState({
        prices: temp
      });
    });
  }

  updateData() {
    const pub = stringToLowerCase(this.props.match.params.pub)
    this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/getExtraData')
      .headers({
        'pubkey': pub,
        'id': 1000000
      })
      .end((res) => {
        if (res.error) throw new Error(res.error);
        if (res.body.order === undefined) {
          this.setState({
            LabelOrder: "Activate Orders",
            buttonDisabled: true
          })
        }
        else {
          if (res.body.state === "0") {
            this.setState({
              LabelOrder: "Activate Orders",
              orders: JSON.parse(res.body.order),
              orderState: res.body.state,
              buttonDisabled: true
            })
          }
          else {
            this.setState({
              LabelOrder: "Deactivate Orders",
              orders: JSON.parse(res.body.order),
              orderState: res.body.state,
              buttonDisabled: true
            })
          }
          let temp = false;
          if (this.state.orders.length > 0) {
            temp = true;
          }
          this.setState({
            pendingButton: temp
          })
        }
      });
  }

  toogleStateOrders() {
    this.setState({
      buttonDisabled: false
    })
    const pub = stringToLowerCase(this.props.match.params.pub)
    let temp = this.state.orderState;
    if (temp === "0") {
      temp = "1";
    }
    else {
      temp = "0";
    }
    this.unirest('GET', 'https://XXXXXXXXXXXXXX.execute-api.us-east-1.amazonaws.com/pubExtraDataDB')
      .headers({
        'pubkey': pub,
        'id': '1000000',
        'state': temp,
        'order': JSON.stringify(this.state.orders)
      })
      .end((res) => {
        if (res.error) throw new Error(res.error);
        this.updateData();
      });
  }

  render() {
    return (
      <div className="App">
        <Header />
        {
          this.state.elements.length > 0 ?
            <div className="body-style" id="body-style">
              <div style={{ paddingTop: "40px" }}>
                <h1>{JSON.parse(this.state.elements[0].Data).attributes[0].artist}</h1>
                <Col>
                  <Button style={{ width: "16vw", borderRadius: "10px", fontSize: "1.5rem", borderRight: "1px solid #474dff", background: ` #474dff`, marginRight: "10px" }} onClick={() => window.open(JSON.parse(this.state.elements[0].Data).external_url, "_blank")}>Artist URL</Button>
                  {
                    this.props.my_pubkey.pubkey === this.props.match.params.pub &&
                    <Button disabled={!this.state.buttonDisabled} style={{ width: "16vw", borderRadius: "10px", fontSize: "1.5rem", background: ` #474dff` }} onClick={this.toogleStateOrders}>{this.state.LabelOrder}</Button>
                  }
                  <Button style={{ marginLeft: "10px", width: "16vw", borderRadius: "10px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => window.open(`https://mumbai.polygonscan.com/address/${this.props.match.params.pub}`, "_blank")}> View on Etherscan</Button>
                </Col>
                {
                  this.props.my_pubkey.pubkey === this.props.match.params.pub &&
                  <h3 style={{ paddingTop: "4vh" }}>
                    <Button disabled={!this.state.pendingButton} style={{ width: "16vw", borderRadius: "10px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => {
                      //pending
                    }}> Pending Orders: {" "}{JSON.stringify(this.state.orders.length)}</Button>
                  </h3>
                }
                <br />
                <div>
                  <hr style={{ width: "98.6vw" }} />
                </div>
                <br />
                <div className="flexbox-style">
                  {
                    this.state.elements.map((item, index) => {
                      return (
                        <div key={"element" + index} style={{ margin: "10px" }}>
                          <Card style={{ width: "15vw", height: "34vh" }}>
                            <div style={{ opacity: "100%", textAlign: "center", paddingTop: "10px" }} >
                              <CardImg style={{ width: "110px", height:"110px", borderRadius: "10px", border: "1px solid #bbb" }} top src={item.Url} alt="Card image cap" />
                            </div>
                            <CardBody>
                              <CardTitle tag="h5">{JSON.parse(item.Data).attributes[0].artist}</CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">
                                <div className="flexbox-style">
                                  <div>
                                    {"Price:"}
                                    <>&nbsp;</>
                                  </div>
                                  <div>
                                    {
                                      this.state.prices[index] === "0" ?
                                        "....."
                                        :
                                        dataweb3.utils.fromWei(this.state.prices[index], 'ether')
                                    }
                                  </div>
                                  <>&nbsp;</>
                                  <img width="30px" src={maticToken}></img>
                                  {
                                    !this.state.status[index] &&
                                    <div style={{ color: "red" }}>
                                      <>&nbsp;</>
                                      Sold
                                    </div>
                                  }
                                </div>
                              </CardSubtitle>
                              <Button style={{ width: "200px", borderRadius: "25px", fontSize: "1.5rem", background: ` #474dff` }} onClick={() => {
                                window.open(`/nft/${item.PubKey}?id=${index}`, "_blank");
                              }}>Open Product</Button>
                            </CardBody>
                          </Card>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            :
            <>
              <div className="body-style">
                <div>
                  <Grid fill="#474dff" />
                </div>
              </div>
            </>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    my_pubkey: state.my_pubkey,
  }
}

export default connect(mapStateToProps, null)(Artist);