// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import 'https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBase.sol';

// VRF Chainlink Generator

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
    
    // Mint NFT with start location
    
    function mintNFT(string memory _tokenURI, string memory _location) public onlyOwner returns (uint256)
    {
        tokenURI = _tokenURI;
        _mint(owner, 1);
        _setTokenURI(1, tokenURI);
        location = _location;
        return 1;
    }
    
    // Set Location waiting for confirmation from the owner
    
    function setLocation(string memory _location) public{
        actualAddress = msg.sender;
        mem_location = _location;
    }
    
    // Set the location if owner sign
    
    function changeLocation(string memory _location) public onlyOwner {
       location = _location;
       mem_location = _location;
       _transfer(owner, actualAddress, 1);
       owner = actualAddress;
    }
    
    // Call getRandomNumber from another contract

    function generateRandomValue() public returns (bytes32 requestId) {
        return Test.getRandomNumber();
    }
    
    // Read variable randomResult from another contract

    function getRandomValue() public view returns (uint256 randomValue) {
        return Test.randomResult();
    }
}
