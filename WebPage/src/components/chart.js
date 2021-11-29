import React, { Component } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardFooter, Col, Row } from 'reactstrap';
import Solana from '../assets/bitmap.png';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

class Chart extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let labels = [];
        let datas = [];
        try {
            labels = (this.props.data.labels.reverse()).map(item => `${new Date(item * 1000).toLocaleTimeString()}`);
            datas = (this.props.data.data.reverse()).map(item => {
                let temp = item.split(',');
                let temperature = temp[0].split(':')[1];
                let humidity = temp[1].split(':')[1];
                temp = [temperature, humidity];
                return temp;
            });
        }
        catch (e) {
            labels = this.props.data.labels;
        }
        const data = {
            labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: datas.map(item => item[0]),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Humidity (%)',
                    data: datas.map(item => item[1]),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };


        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Product Last 5 checkpoints'
                },
            },
        };
        return (
            <Row>
                <Col style={{ width: "60%" }}>
                    <Bar options={options} data={data} />
                    <p />
                    <div style={{ fontSize: "1.2rem" }}>
                        Last location of the product.
                        <div>
                            {() => {

                                try {
                                    return("Lat:" +
                                        JSON.stringify(this.props.location[0]))
                                }
                                catch (e) {
                                    return("Lat: 19.14")
                                }
                            }

                            }
                        </div>
                        <div>
                            {() => {
                                try {
                                    return("Lon:" +
                                        JSON.stringify(this.props.location[1]))
                                }
                                catch (e) {
                                    return("Lon: -99.25")
                                }
                            }

                            }


                        </div>
                    </div>
                </Col>
                <Col style={{ width: "40%" }}>
                    <Card style={{ fontSize: "1.4rem" }}>
                        <CardBody>
                            Solana Tracking account
                        </CardBody>
                        <CardFooter>
                            <div>
                                Solana Explorer {"\n"}
                            </div>
                            <div>
                                <img src={Solana} alt="solana" style={{ width: "100px" }} />
                            </div>
                            <a href={`https://explorer.solana.com/address/${this.props.address}?cluster=devnet`} target="_blank">
                                <div>
                                    {this.props.address.substring(0, 22)}
                                </div>
                                <div>
                                    {this.props.address.substring(22, 44)}
                                </div>
                            </a>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Chart;
