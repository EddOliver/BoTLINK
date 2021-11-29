'use strict';
var atob = require('atob');
const dirTree = require("directory-tree");
let tree = dirTree('./solana-signer/');
const fs = require('fs');
const express = require('express')
const morgan = require('morgan');
const { exec } = require('child_process');
const unirest = require('unirest');
const path = require('path');
const app = express()
const port = 8080

const APIGATEWAY = "api.kharonprotocol.com"
const APIGATEWAY2 = "xxxxxxxx.execute-api.us-east-1.amazonaws.com"

function check(json) {
  try {
    if (json.headers.forwarded.replace("host=", "").split(";")[2] === APIGATEWAY || json.headers.forwarded.replace("host=", "").split(";")[2] === APIGATEWAY2) {
      return true
    }
    else {
      return false
    }
  }
  catch (err) {
    return false
  }
}

function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result.toUpperCase();
}

function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 32) {
      output += input.charAt(i);
    }
  }
  return output;
}

function hexStringtoHexArray(str) {
  let result = [];
  for (let i = 0; i < str.length; i += 2) {
    result.push(parseInt(str.substr(i, 2), 16));
  }
  return result;
}

function hexArraytoCharArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(String.fromCharCode(arr[i]));
  }
  return result;
}

function charArraytoString(array) {
  let result = '';
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== '\n' && array[i] !== '\r') {
      result += array[i];
    }
  }
  return result;
}

function processing(input) {
  let result = base64ToHex(input);
  result = hexStringtoHexArray(result);
  result = hexArraytoCharArray(result);
  result = cleanString(charArraytoString(result))
  //result = result.split(',');
  return result;
}

function fileExist(filename) {
  tree = dirTree('./solana-signer/').children
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].name === filename) {
      return true;
    }
  }
  return false;
}

function fileExist2(filename) {
  tree = dirTree('./solana-user/').children
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].name === filename) {
      return true;
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getTransactionFromSolana(transactionId) {
  return new Promise((resolve, reject) => {

  })
}

app.use(morgan('dev'));
app.use(express.json())

app.get('/', async (req, res) => {
  if (check(req)) {
    res.send(`Hello From Kharon Server`)
  }
  else {
    res.status(401).send("Unauthorized");
  }
})

app.get('/get-account-devdata', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    if (!fileExist(register)) {
      res.send(`No Account Yet`)
    }
    else {
      var json = require(`./solana-data/${register}`);
      res.send(json["solana-account"])
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }
})

app.get('/check-transactions-devdata', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    if (!fileExist(register)) {
      res.send(`No Account Yet`)
    }
    else {
      var json = require(`./solana-data/${register}`);
      let limit = 1000
      if (req.headers.limit !== undefined) {
        limit = req.headers.limit
      }
      exec(`solana transaction-history ${json["solana-account"]} --limit ${limit}`, async (error, stdout, stderr) => {
        if (error) {
          res.send(`Error, try again`)
        }
        else if (stderr) {
          res.send(`Error, try again`)
        }
        else {
          let result = stdout.split('\n');
          result.pop();
          result.pop();
          res.send({ "transactions": result })
        }
      });
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }
})

app.get('/check-last-transaction-data-devdata', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    console.log(register)
    if (!fileExist(register)) {
      res.send(`No Account Yet`)
    }
    else {
      var json = require(`./solana-data/${register}`);
      let limit = 1
      exec(`solana transaction-history ${json["solana-account"]} --limit ${limit}`, async (error, stdout, stderr) => {
        if (error) {
          res.send(`Error, try again`)
        }
        else if (stderr) {
          res.send(`Error, try again`)
        }
        else {
          let result = stdout.split('\n');
          result.pop();
          result.pop();
          unirest('POST', 'https://explorer-api.devnet.solana.com/')
            .headers({
              'Content-Type': 'application/json'
            })
            .send(JSON.stringify({
              "method": "getConfirmedTransaction",
              "jsonrpc": "2.0",
              "params": [
                result[0],
                {
                  "encoding": "jsonParsed"
                }
              ],
              "id": "6f0a96ff-89f8-4083-b9fa-2514761d0692"
            }))
            .end((resp) => {
              if (resp.error) throw new Error(resp.error);
              
              if (resp.body.result === null) {
                res.status(304).send("No Transaction Yet")
              }
              else {
                console.log(resp.body.result.transaction.message.instructions[1].parsed);
                res.send({ "data": [resp.body.result.transaction.message.instructions[1].parsed], "transaction": [result[0]], "blockTime": [resp.body.result.blockTime] })
              }
            });
        }
      });
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }
})

app.get('/check-all-transactions-data-devdata', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    if (!fileExist(register)) {
      res.send(`No Account Yet`)
    }
    else {
      var json = require(`./solana-data/${register}`);
      let limit = 1000
      if (req.headers.limit !== undefined) {
        limit = req.headers.limit
      }
      exec(`solana transaction-history ${json["solana-account"]} --limit ${limit}`, async (error, stdout, stderr) => {
        if (error) {
          res.send(`Error, try again`)
        }
        else if (stderr) {
          res.send(`Error, try again`)
        }
        else {
          let result = stdout.split('\n');
          result.pop();
          result.pop();
          let data = []
          let transaction = []
          let blockTime = []
          for (let i = 0; i < result.length; i++) {
            let temp = await getTransactionFromSolana(result[i])
            data.push(temp[0])
            transaction.push(temp[1])
            blockTime.push(temp[2])
          }
          res.send({ "data": data, "transaction": transaction, "blockTime": blockTime })
        }
      });
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/check-one-transaction', async (req, res) => {
  if (check(req)) {
    let data = []
    let transaction = []
    let blockTime = []
    let temp = await getTransactionFromSolana(req.headers.transaction)
    data.push(temp[0])
    transaction.push(temp[1])
    blockTime.push(temp[2])
    res.send({ "data": data, "transaction": transaction, "blockTime": blockTime })
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/check-devices-by-pubkey', async (req, res) => {
  if (check(req)) {
    if (!fileExist2(`${req.headers.pub_key}.json`)) {
      res.send(JSON.stringify({
        "devices": []
      }));
    }
    else {
      var json = require(`./solana-user/${req.headers.pub_key}.json`);
      res.send(JSON.stringify(json));
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/register-device-mod', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    if (!fileExist(register)) {
      res.send(`No Device Yet`)
    }
    else {
      if (!fileExist2(`${req.headers.pub_key}.json`)) {
        let temp = JSON.stringify({
          "devices": [register]
        })
        fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, temp, (err) => {
          if (err) {
            res.send(`Error Write File`);
          }
          else {
            res.send(`Success`);
          }
        });
      }
      else {
        var json = require(`./solana-user/${req.headers.pub_key}.json`);
        const found = json["devices"].find(element => element === register);
        if (found === undefined) {
          json["devices"].push(register)
          fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, JSON.stringify(json), (err) => {
            if (err) {
              res.send(`Error Write File`);
            }
            else {
              res.send(`Success`);
            }
          });
        }
        else {
          res.send(`Device already registered`);
        }
      }
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/register-device', async (req, res) => {
  if (check(req)) {
    let register = `${req.headers.app_eui + req.headers.dev_eui}.json`
    if (!fileExist(register)) {
      exec(`solana-keygen new --outfile /home/ubuntu/solana-signer/${register} --no-bip39-passphrase`, async (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          res.send(`Error, try again`)
        }
        else if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(`Error, try again`)
        }
        else {
          account = stdout.substr(stdout.indexOf('pubkey: ') + 8)
          index = account.indexOf('==========')
          account = account.substr(0, index - 1);
          dictstring = JSON.stringify({
            "solana-account": `${account}`,
            "solana-sign": `${register}`,
          });
          fs.writeFile(`./solana-data/${register}`, dictstring, function (err) {
            if (err) {
              res.send(`Error Write File`);
            }
            else {
              if (!fileExist2(`${req.headers.pub_key}.json`)) {
                let temp = {
                  "devices": [register]
                }
                fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, temp, (err) => {
                  if (err) {
                    res.send(`Error Write File`);
                  }
                  else {
                    res.send(`Success`);
                  }
                });
              }
              else {
                var json = require(`./solana-user/${req.headers.pub_key}.json`);
                json["devices"].push(register)
                fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, temp, (err) => {
                  if (err) {
                    res.send(`Error Write File`);
                  }
                  else {
                    res.send(`Success`);
                  }
                });
              }
            }
          });
        }
      });
    }
    else {
      if (!fileExist2(`${req.headers.pub_key}.json`)) {
        let temp = JSON.stringify({
          "devices": [register]
        })
        fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, temp, (err) => {
          if (err) {
            res.send(`Error Write File`);
          }
          else {
            res.send(`Success`);
          }
        });
      }
      else {
        var json = require(`./solana-user/${req.headers.pub_key}.json`);
        const found = json["devices"].find(element => element === register);
        if (found === undefined) {
          json["devices"].push(register)
          fs.writeFile(`./solana-user/${req.headers.pub_key}.json`, JSON.stringify(json), (err) => {
            if (err) {
              res.send(`Error Write File`);
            }
            else {
              res.send(`Success`);
            }
          });
        }
        else {
          res.send(`Device already registered`);
        }
      }
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.post('/hook', async (req, res) => {
  if (check(req)) {
    let dictstring;
    let index;
    let account;
    let register = `${req.body.app_eui + req.body.dev_eui}.json`
    if (!fileExist(register)) {
      exec(`solana-keygen new --outfile /home/ubuntu/solana-signer/${register} --no-bip39-passphrase`, async (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          res.send(`Error, try again`)
        }
        else if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(`Error, try again`)
        }
        else {
          account = stdout.substr(stdout.indexOf('pubkey: ') + 8)
          index = account.indexOf('==========')
          account = account.substr(0, index - 1);
          dictstring = JSON.stringify({
            "solana-account": `${account}`,
            "solana-sign": `${register}`
          });
          fs.writeFile(`./solana-data/${register}`, dictstring, function (err) {
            if (err) {
              res.send(`Error Write File`);
            }
            else {
              var json = require(`./solana-data/${register}`);
              let command = `solana transfer --from /home/ubuntu/solana-signer/${json['solana-sign']} 7f3kitEfm72V6daGbR5mYgbw8eGbLcNvR1GSKgPwCUvK 0 --with-memo ${JSON.stringify(processing(req.body.payload))} --allow-unfunded-recipient --fee-payer /home/ubuntu/solana-signer/1.json`
              exec(command, (error, stdout, stderr) => {
                if (error) {
                  res.send(`${error}`)
                }
                else if (stderr) {
                  res.send(`${stderr}`)
                }
                else {
                  res.send(`${stdout}`)
                }
              });
            }
          });
        }
      });
    }
    else {
      var json = require(`./solana-data/${register}`);
      console.log(JSON.stringify(processing(req.body.payload)));
      console.log(json['solana-sign'])
      let command = `solana transfer --from /home/ubuntu/solana-signer/${json['solana-sign']} 7f3kitEfm72V6daGbR5mYgbw8eGbLcNvR1GSKgPwCUvK 0 --with-memo ${JSON.stringify(processing(req.body.payload))} --allow-unfunded-recipient --fee-payer /home/ubuntu/solana-signer/1.json`
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error}`);
          res.send(`${error}`)
        }
        else if (stderr) {
          console.log(`error: ${stderr}`);
          res.send(`${stderr}`)
        }
        else {
          console.log(`error: ${stdout}`);
          res.send(`${stdout}`)
        }
      });
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/add-credits', async (req, res) => {
  if (check(req)) {
    let check = false
    for (let i = 0; i < 10; i++) {
      if (!check) {
        exec(`solana airdrop 10 ${req.headers.account} --output json-compact`, async (error, stdout, stderr) => {
          if (error) {
            console.log("Error")
          }
          if (stderr) {
            console.log("Error")
          }
          else {
            let account = stdout.substr(stdout.indexOf('}') + 2)
            if (!check) {
              res.send({ "balance": account })
            }
            check = true
          }
        });
        await sleep(5000)
      }
    }
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/check-balance', async (req, res) => {
  if (check(req)) {
    exec(`solana balance ${req.headers.account}`, async (error, stdout, stderr) => {
      if (error) {
        res.send(`Error, try again`)
      }
      if (stderr) {
        res.send(`Error, try again`)
      }
      res.send({ "balance": stdout })
    });
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.get('/check-transactions', async (req, res) => {
  if (check(req)) {
    exec(`solana transaction-history ${req.headers.account}`, async (error, stdout, stderr) => {
      if (error) {
        res.send(`Error, try again`)
      }
      else if (stderr) {
        res.send(`Error, try again`)
      }
      else {
        console.log(stdout)
        res.send({ "balance": stdout })
      }
    });
  }
  else {
    res.status(401).send("Unauthorized");
  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})