import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { injected } from "./connectors";
import { useWeb3React } from "@web3-react/core";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Message from "./Message";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { formatEther } from "@ethersproject/units";
import Web3 from "web3";
import contractJson from "./chains/evm/out/xGroupChat.sol/xGroupChat.json";
const chainIdToAddress = {
  "1": "0xeea2Fc1D255Fd28aA15c6c2324Ad40B03267f9c5",
  "1397": "0xeea2Fc1D255Fd28aA15c6c2324Ad40B03267f9c5",
};
const App = () => {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

  const [web3, setWeb3] = useState(undefined);
  const [name, setName] = useState("Akshaj");
  const [newMessage, setNewMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [chainId, setChainId] = useState(0);
  const [contract, setContract] = useState(undefined);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [messages, setMessages] = useState([
    {
      senderName: "Akshaj",
      senderChain: "Ropsten",
      senderAddress: "0xbeef",
      message: "Hey!! Crazy that I can chat like this",
    },
    {
      senderName: "Rithvik",
      senderChain: "Goerli",
      senderAddress: "0xceef",
      message: "Yup! This is super cool",
    },
    {
      senderName: "Jenny",
      senderChain: "Solana",
      senderAddress: "0xdeef",
      message: "I totally agree!!",
    },
  ]);

  const run = useCallback(async () => {
    if (active && account) {
      const bal = await library?.getBalance(account);
      setBalance(bal);
      const _chainId = await connector.getChainId();
      setChainId(parseInt(_chainId));
      console.log(`set chain id and balance to ${parseInt(_chainId)} and ${bal}` )

      const _web3 = new Web3(library?.provider);

      const myContract = new _web3.eth.Contract(
        contractJson.abi,
        chainIdToAddress[`${parseInt(_chainId)}`]
      );
        setContract(myContract);
        setWeb3(_web3);
        console.log('sending getMessages');
        myContract.methods
          .getMessages()
          .call()
          .then((receipt) => {
            console.log('received this receipt');
            console.log(receipt);
            setMessages(receipt)
          });
      
    }
    
  }, [active, account]);
  useEffect(() => {
    
    run();
  }, [active, account]);

  const connect = async () => {
    try {
      await activate(injected);
    } catch (err) {
      console.log(err);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack direction="vertical" className="p-3" gap={3}>
      <Stack direction="horizontal" gap={3}>
        <h1>xGroupChat</h1>
        <div className="ms-auto">
          {active ? (
            <span>
              Connected with <b>{account}</b> (eth: {formatEther(balance)},
              chainId: {chainId})
            </span>
          ) : (
            <span>Not connected</span>
          )}
        </div>
        <div>
          {active ? (
            <Button variant="primary" onClick={disconnect}>
              Disconnect
            </Button>
          ) : (
            <Button variant="primary" onClick={connect}>
              Connect to MetaMask
            </Button>
          )}
        </div>
      </Stack>
      <div className="chatMessages">
        {messages.map((msg) => (
          <Message message={msg} me={msg.senderAddress === account} />
        ))}
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <Form.Control
          className="w-75"
          placeholder="Message"
          value={newMessage}
          onChange={(event) => {
            setNewMessage(event.target.value);
          }}
          disabled={inputDisabled}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              if (account && active) {
                const msg = {
                  senderName: name,
                  senderChain: `Chain ${chainId}`,
                  senderAddress: account,
                  message: newMessage,
                };
                setInputDisabled(true);
                contract.methods
                  .sendMsg(msg.senderChain, msg.senderName, msg.senderAddress, msg.message)
                  .send({from: account})
                  .then((receipt) => {
                    console.log(receipt);
                    setNewMessage("");
                    setInputDisabled(false);
                    setMessages((messages) => messages.concat([msg]));
                  }).catch((e) => {
                    setNewMessage("");
                    setInputDisabled(false);
                  }
                  );
              }
            }
          }}
        />
      </InputGroup>
    </Stack>
  );
};
export default App;
