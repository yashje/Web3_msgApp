// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract msgApp {
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    struct memo {
        string name;
        string message;
        uint timestamp;
        address from;
    }

    memo[] memos;

    function buy(string memory _name, string memory _message) public payable{
       require(msg.value > 0);
       owner.transfer(msg.value);
       memos.push(memo(_name,_message,block.timestamp,msg.sender));
    }

    function getAllMsg() public view returns(memo[] memory){
        return memos;
    }
}
