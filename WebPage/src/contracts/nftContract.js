exports.content = () =>{ return `
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import 'https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBase.sol';

contract RandomNumberConsumer is VRFConsumerBase {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    
    constructor() 
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10 ** 18; // 0.0001 LINK (Varies by network)
    }
    
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }
}

contract MyToken is ERC721URIStorage {
    
    address public owner;
    address public actualAddress;
    string public tokenURI;
    string public mem_location = "";
    string public location = "";
    uint256 public price = 0;
    bool public flag = false;
    address generatorAddress = 0x7b6ddb7B1F12C56db11bB36b35AB6cE128B664ba;
    RandomNumberConsumer Test = RandomNumberConsumer(generatorAddress);
    
    modifier onlyOwner{
        require(msg.sender == owner);
        _; // Close Modifier
    }
    
    constructor() ERC721('NFT', 'MyNFT') {
        owner = msg.sender;
    }
    
    function mintNFT(string memory _tokenURI, string memory _location) public onlyOwner returns (uint256)
    {
        tokenURI = _tokenURI;
        _mint(owner, 1);
        _setTokenURI(1, tokenURI);
        location = _location;
        return 1;
    }
    
    function setLocation(string memory _location) public{
        actualAddress = msg.sender;
        mem_location = _location;
    }
    
    function changeLocation(string memory _location) public onlyOwner {
       location = _location;
       mem_location = _location;
       _transfer(owner, actualAddress, 1);
       owner = actualAddress;
    }

    function generateRandomValue() public returns (bytes32 requestId) {
        return Test.getRandomNumber();
    }

    function getRandomValue() public view returns (uint256 randomValue) {
        return Test.randomResult();
    }
}
`}

exports.abi = () => {
    return [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "actualAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                }
            ],
            "name": "changeLocation",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "flag",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "generateRandomValue",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "requestId",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getRandomValue",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "randomValue",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "location",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "mem_location",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_tokenURI",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                }
            ],
            "name": "mintNFT",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "price",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                }
            ],
            "name": "setLocation",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
  };
  
  exports.bytecode = () => {
    return("608060405260405180602001604052806000815250600a90805190602001906200002b92919062000221565b5060405180602001604052806000815250600b90805190602001906200005392919062000221565b506000600c556000600d60006101000a81548160ff021916908315150217905550737b6ddb7b1f12c56db11bb36b35ab6ce128b664ba600d60016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600d60019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600e60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156200013957600080fd5b506040518060400160405280600381526020017f4e465400000000000000000000000000000000000000000000000000000000008152506040518060400160405280600581526020017f4d794e46540000000000000000000000000000000000000000000000000000008152508160009080519060200190620001be92919062000221565b508060019080519060200190620001d792919062000221565b50505033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555062000336565b8280546200022f90620002d1565b90600052602060002090601f0160209004810192826200025357600085556200029f565b82601f106200026e57805160ff19168380011785556200029f565b828001600101855582156200029f579182015b828111156200029e57825182559160200191906001019062000281565b5b509050620002ae9190620002b2565b5090565b5b80821115620002cd576000816000905550600101620002b3565b5090565b60006002820490506001821680620002ea57607f821691505b6020821081141562000301576200030062000307565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b61349a80620003466000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c806370a08231116100de578063a035b1fe11610097578063c6bab26711610071578063c6bab26714610428578063c87b56dd14610446578063e960554414610476578063e985e9c5146104a657610173565b8063a035b1fe146103d2578063a22cb465146103f0578063b88d4fde1461040c57610173565b806370a0823114610310578063827bfbdf146103405780638747ea6f1461035c578063890eba68146103785780638da5cb5b1461039657806395d89b41146103b457610173565b80633c130d90116101305780633c130d901461024c57806342842e0e1461026a57806343e874fa14610286578063449107b6146102a4578063516f279e146102c25780636352211e146102e057610173565b806301ffc9a71461017857806306fdde03146101a8578063081812fc146101c6578063095ea7b3146101f65780631486a2761461021257806323b872dd14610230575b600080fd5b610192600480360381019061018d91906123bf565b6104d6565b60405161019f91906128ce565b60405180910390f35b6101b06105b8565b6040516101bd9190612904565b60405180910390f35b6101e060048036038101906101db91906124da565b61064a565b6040516101ed9190612867565b60405180910390f35b610210600480360381019061020b9190612352565b6106cf565b005b61021a6107e7565b6040516102279190612b26565b60405180910390f35b61024a6004803603810190610245919061223c565b61088e565b005b6102546108ee565b6040516102619190612904565b60405180910390f35b610284600480360381019061027f919061223c565b61097c565b005b61028e61099c565b60405161029b9190612904565b60405180910390f35b6102ac610a2a565b6040516102b99190612867565b60405180910390f35b6102ca610a50565b6040516102d79190612904565b60405180910390f35b6102fa60048036038101906102f591906124da565b610ade565b6040516103079190612867565b60405180910390f35b61032a600480360381019061032591906121cf565b610b90565b6040516103379190612b26565b60405180910390f35b61035a60048036038101906103559190612419565b610c48565b005b61037660048036038101906103719190612419565b610ca3565b005b610380610de1565b60405161038d91906128ce565b60405180910390f35b61039e610df4565b6040516103ab9190612867565b60405180910390f35b6103bc610e1a565b6040516103c99190612904565b60405180910390f35b6103da610eac565b6040516103e79190612b26565b60405180910390f35b61040a60048036038101906104059190612312565b610eb2565b005b6104266004803603810190610421919061228f565b610ec8565b005b610430610f2a565b60405161043d91906128e9565b60405180910390f35b610460600480360381019061045b91906124da565b610fd3565b60405161046d9190612904565b60405180910390f35b610490600480360381019061048b9190612462565b611125565b60405161049d9190612b26565b60405180910390f35b6104c060048036038101906104bb91906121fc565b61127b565b6040516104cd91906128ce565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806105a157507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806105b157506105b08261130f565b5b9050919050565b6060600080546105c790612d86565b80601f01602080910402602001604051908101604052809291908181526020018280546105f390612d86565b80156106405780601f1061061557610100808354040283529160200191610640565b820191906000526020600020905b81548152906001019060200180831161062357829003601f168201915b5050505050905090565b600061065582611379565b610694576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068b90612a86565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006106da82610ade565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561074b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161074290612ae6565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1661076a6113e5565b73ffffffffffffffffffffffffffffffffffffffff1614806107995750610798816107936113e5565b61127b565b5b6107d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107cf906129c6565b60405180910390fd5b6107e283836113ed565b505050565b6000600e60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166342619f666040518163ffffffff1660e01b815260040160206040518083038186803b15801561085157600080fd5b505afa158015610865573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108899190612507565b905090565b61089f6108996113e5565b826114a6565b6108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d590612b06565b60405180910390fd5b6108e9838383611584565b505050565b600980546108fb90612d86565b80601f016020809104026020016040519081016040528092919081815260200182805461092790612d86565b80156109745780601f1061094957610100808354040283529160200191610974565b820191906000526020600020905b81548152906001019060200180831161095757829003601f168201915b505050505081565b61099783838360405180602001604052806000815250610ec8565b505050565b600a80546109a990612d86565b80601f01602080910402602001604051908101604052809291908181526020018280546109d590612d86565b8015610a225780601f106109f757610100808354040283529160200191610a22565b820191906000526020600020905b815481529060010190602001808311610a0557829003601f168201915b505050505081565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600b8054610a5d90612d86565b80601f0160208091040260200160405190810160405280929190818152602001828054610a8990612d86565b8015610ad65780601f10610aab57610100808354040283529160200191610ad6565b820191906000526020600020905b815481529060010190602001808311610ab957829003601f168201915b505050505081565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610b87576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7e90612a06565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610c01576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bf8906129e6565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b33600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600a9080519060200190610c9f929190611fb9565b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610cfd57600080fd5b80600b9080519060200190610d13929190611fb9565b5080600a9080519060200190610d2a929190611fb9565b50610d7b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001611584565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600d60009054906101000a900460ff1681565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060018054610e2990612d86565b80601f0160208091040260200160405190810160405280929190818152602001828054610e5590612d86565b8015610ea25780601f10610e7757610100808354040283529160200191610ea2565b820191906000526020600020905b815481529060010190602001808311610e8557829003601f168201915b5050505050905090565b600c5481565b610ec4610ebd6113e5565b83836117e0565b5050565b610ed9610ed36113e5565b836114a6565b610f18576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f0f90612b06565b60405180910390fd5b610f248484848461194d565b50505050565b6000600e60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dbdff2c16040518163ffffffff1660e01b8152600401602060405180830381600087803b158015610f9657600080fd5b505af1158015610faa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fce9190612392565b905090565b6060610fde82611379565b61101d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161101490612a66565b60405180910390fd5b600060066000848152602001908152602001600020805461103d90612d86565b80601f016020809104026020016040519081016040528092919081815260200182805461106990612d86565b80156110b65780601f1061108b576101008083540402835291602001916110b6565b820191906000526020600020905b81548152906001019060200180831161109957829003601f168201915b5050505050905060006110c76119a9565b90506000815114156110dd578192505050611120565b6000825111156111125780826040516020016110fa929190612843565b60405160208183030381529060405292505050611120565b61111b846119c0565b925050505b919050565b6000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461118157600080fd5b8260099080519060200190611197929190611fb9565b506111c5600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166001611a67565b61125a6001600980546111d790612d86565b80601f016020809104026020016040519081016040528092919081815260200182805461120390612d86565b80156112505780601f1061122557610100808354040283529160200191611250565b820191906000526020600020905b81548152906001019060200180831161123357829003601f168201915b5050505050611c35565b81600b9080519060200190611270929190611fb9565b506001905092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff1661146083610ade565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b60006114b182611379565b6114f0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114e7906129a6565b60405180910390fd5b60006114fb83610ade565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148061156a57508373ffffffffffffffffffffffffffffffffffffffff166115528461064a565b73ffffffffffffffffffffffffffffffffffffffff16145b8061157b575061157a818561127b565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff166115a482610ade565b73ffffffffffffffffffffffffffffffffffffffff16146115fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115f190612aa6565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561166a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161166190612966565b60405180910390fd5b611675838383611ca9565b6116806000826113ed565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116d09190612c92565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546117279190612c0b565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561184f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161184690612986565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405161194091906128ce565b60405180910390a3505050565b611958848484611584565b61196484848484611cae565b6119a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161199a90612926565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b60606119cb82611379565b611a0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a0190612ac6565b60405180910390fd5b6000611a146119a9565b90506000815111611a345760405180602001604052806000815250611a5f565b80611a3e84611e45565b604051602001611a4f929190612843565b6040516020818303038152906040525b915050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611ad7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ace90612a46565b60405180910390fd5b611ae081611379565b15611b20576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b1790612946565b60405180910390fd5b611b2c60008383611ca9565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b7c9190612c0b565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a45050565b611c3e82611379565b611c7d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611c7490612a26565b60405180910390fd5b80600660008481526020019081526020016000209080519060200190611ca4929190611fb9565b505050565b505050565b6000611ccf8473ffffffffffffffffffffffffffffffffffffffff16611fa6565b15611e38578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611cf86113e5565b8786866040518563ffffffff1660e01b8152600401611d1a9493929190612882565b602060405180830381600087803b158015611d3457600080fd5b505af1925050508015611d6557506040513d601f19601f82011682018060405250810190611d6291906123ec565b60015b611de8573d8060008114611d95576040519150601f19603f3d011682016040523d82523d6000602084013e611d9a565b606091505b50600081511415611de0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611dd790612926565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614915050611e3d565b600190505b949350505050565b60606000821415611e8d576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050611fa1565b600082905060005b60008214611ebf578080611ea890612de9565b915050600a82611eb89190612c61565b9150611e95565b60008167ffffffffffffffff811115611edb57611eda612f1f565b5b6040519080825280601f01601f191660200182016040528015611f0d5781602001600182028036833780820191505090505b5090505b60008514611f9a57600182611f269190612c92565b9150600a85611f359190612e32565b6030611f419190612c0b565b60f81b818381518110611f5757611f56612ef0565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a85611f939190612c61565b9450611f11565b8093505050505b919050565b600080823b905060008111915050919050565b828054611fc590612d86565b90600052602060002090601f016020900481019282611fe7576000855561202e565b82601f1061200057805160ff191683800117855561202e565b8280016001018555821561202e579182015b8281111561202d578251825591602001919060010190612012565b5b50905061203b919061203f565b5090565b5b80821115612058576000816000905550600101612040565b5090565b600061206f61206a84612b66565b612b41565b90508281526020810184848401111561208b5761208a612f53565b5b612096848285612d44565b509392505050565b60006120b16120ac84612b97565b612b41565b9050828152602081018484840111156120cd576120cc612f53565b5b6120d8848285612d44565b509392505050565b6000813590506120ef816133f1565b92915050565b60008135905061210481613408565b92915050565b6000815190506121198161341f565b92915050565b60008135905061212e81613436565b92915050565b60008151905061214381613436565b92915050565b600082601f83011261215e5761215d612f4e565b5b813561216e84826020860161205c565b91505092915050565b600082601f83011261218c5761218b612f4e565b5b813561219c84826020860161209e565b91505092915050565b6000813590506121b48161344d565b92915050565b6000815190506121c98161344d565b92915050565b6000602082840312156121e5576121e4612f5d565b5b60006121f3848285016120e0565b91505092915050565b6000806040838503121561221357612212612f5d565b5b6000612221858286016120e0565b9250506020612232858286016120e0565b9150509250929050565b60008060006060848603121561225557612254612f5d565b5b6000612263868287016120e0565b9350506020612274868287016120e0565b9250506040612285868287016121a5565b9150509250925092565b600080600080608085870312156122a9576122a8612f5d565b5b60006122b7878288016120e0565b94505060206122c8878288016120e0565b93505060406122d9878288016121a5565b925050606085013567ffffffffffffffff8111156122fa576122f9612f58565b5b61230687828801612149565b91505092959194509250565b6000806040838503121561232957612328612f5d565b5b6000612337858286016120e0565b9250506020612348858286016120f5565b9150509250929050565b6000806040838503121561236957612368612f5d565b5b6000612377858286016120e0565b9250506020612388858286016121a5565b9150509250929050565b6000602082840312156123a8576123a7612f5d565b5b60006123b68482850161210a565b91505092915050565b6000602082840312156123d5576123d4612f5d565b5b60006123e38482850161211f565b91505092915050565b60006020828403121561240257612401612f5d565b5b600061241084828501612134565b91505092915050565b60006020828403121561242f5761242e612f5d565b5b600082013567ffffffffffffffff81111561244d5761244c612f58565b5b61245984828501612177565b91505092915050565b6000806040838503121561247957612478612f5d565b5b600083013567ffffffffffffffff81111561249757612496612f58565b5b6124a385828601612177565b925050602083013567ffffffffffffffff8111156124c4576124c3612f58565b5b6124d085828601612177565b9150509250929050565b6000602082840312156124f0576124ef612f5d565b5b60006124fe848285016121a5565b91505092915050565b60006020828403121561251d5761251c612f5d565b5b600061252b848285016121ba565b91505092915050565b61253d81612cc6565b82525050565b61254c81612cd8565b82525050565b61255b81612ce4565b82525050565b600061256c82612bc8565b6125768185612bde565b9350612586818560208601612d53565b61258f81612f62565b840191505092915050565b60006125a582612bd3565b6125af8185612bef565b93506125bf818560208601612d53565b6125c881612f62565b840191505092915050565b60006125de82612bd3565b6125e88185612c00565b93506125f8818560208601612d53565b80840191505092915050565b6000612611603283612bef565b915061261c82612f73565b604082019050919050565b6000612634601c83612bef565b915061263f82612fc2565b602082019050919050565b6000612657602483612bef565b915061266282612feb565b604082019050919050565b600061267a601983612bef565b91506126858261303a565b602082019050919050565b600061269d602c83612bef565b91506126a882613063565b604082019050919050565b60006126c0603883612bef565b91506126cb826130b2565b604082019050919050565b60006126e3602a83612bef565b91506126ee82613101565b604082019050919050565b6000612706602983612bef565b915061271182613150565b604082019050919050565b6000612729602e83612bef565b91506127348261319f565b604082019050919050565b600061274c602083612bef565b9150612757826131ee565b602082019050919050565b600061276f603183612bef565b915061277a82613217565b604082019050919050565b6000612792602c83612bef565b915061279d82613266565b604082019050919050565b60006127b5602983612bef565b91506127c0826132b5565b604082019050919050565b60006127d8602f83612bef565b91506127e382613304565b604082019050919050565b60006127fb602183612bef565b915061280682613353565b604082019050919050565b600061281e603183612bef565b9150612829826133a2565b604082019050919050565b61283d81612d3a565b82525050565b600061284f82856125d3565b915061285b82846125d3565b91508190509392505050565b600060208201905061287c6000830184612534565b92915050565b60006080820190506128976000830187612534565b6128a46020830186612534565b6128b16040830185612834565b81810360608301526128c38184612561565b905095945050505050565b60006020820190506128e36000830184612543565b92915050565b60006020820190506128fe6000830184612552565b92915050565b6000602082019050818103600083015261291e818461259a565b905092915050565b6000602082019050818103600083015261293f81612604565b9050919050565b6000602082019050818103600083015261295f81612627565b9050919050565b6000602082019050818103600083015261297f8161264a565b9050919050565b6000602082019050818103600083015261299f8161266d565b9050919050565b600060208201905081810360008301526129bf81612690565b9050919050565b600060208201905081810360008301526129df816126b3565b9050919050565b600060208201905081810360008301526129ff816126d6565b9050919050565b60006020820190508181036000830152612a1f816126f9565b9050919050565b60006020820190508181036000830152612a3f8161271c565b9050919050565b60006020820190508181036000830152612a5f8161273f565b9050919050565b60006020820190508181036000830152612a7f81612762565b9050919050565b60006020820190508181036000830152612a9f81612785565b9050919050565b60006020820190508181036000830152612abf816127a8565b9050919050565b60006020820190508181036000830152612adf816127cb565b9050919050565b60006020820190508181036000830152612aff816127ee565b9050919050565b60006020820190508181036000830152612b1f81612811565b9050919050565b6000602082019050612b3b6000830184612834565b92915050565b6000612b4b612b5c565b9050612b578282612db8565b919050565b6000604051905090565b600067ffffffffffffffff821115612b8157612b80612f1f565b5b612b8a82612f62565b9050602081019050919050565b600067ffffffffffffffff821115612bb257612bb1612f1f565b5b612bbb82612f62565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b6000612c1682612d3a565b9150612c2183612d3a565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612c5657612c55612e63565b5b828201905092915050565b6000612c6c82612d3a565b9150612c7783612d3a565b925082612c8757612c86612e92565b5b828204905092915050565b6000612c9d82612d3a565b9150612ca883612d3a565b925082821015612cbb57612cba612e63565b5b828203905092915050565b6000612cd182612d1a565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612d71578082015181840152602081019050612d56565b83811115612d80576000848401525b50505050565b60006002820490506001821680612d9e57607f821691505b60208210811415612db257612db1612ec1565b5b50919050565b612dc182612f62565b810181811067ffffffffffffffff82111715612de057612ddf612f1f565b5b80604052505050565b6000612df482612d3a565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612e2757612e26612e63565b5b600182019050919050565b6000612e3d82612d3a565b9150612e4883612d3a565b925082612e5857612e57612e92565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960008201527f73206e6f74206f776e0000000000000000000000000000000000000000000000602082015250565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b6133fa81612cc6565b811461340557600080fd5b50565b61341181612cd8565b811461341c57600080fd5b50565b61342881612ce4565b811461343357600080fd5b50565b61343f81612cee565b811461344a57600080fd5b50565b61345681612d3a565b811461346157600080fd5b5056fea2646970667358221220095c2b625ea1e2dfb986d874c8150a247c06bd8e17f3b0037b0f352109fbe78864736f6c63430008070033")
  }