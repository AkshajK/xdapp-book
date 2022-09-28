import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { injected } from "./connectors";
import { useWeb3React } from "@web3-react/core";
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';

const App = () => {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();

    
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
    <Stack direction="vertical" className="p-3">
      <Stack direction="horizontal" gap={3}>
     <h1>xGroupChat</h1>
     <div className="ms-auto">
    {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
    </div>
    <div>
    {active ?   <Button
        variant="primary"
        onClick={disconnect}
      >
        Disconnect 
      </Button>  : <Button
        variant="primary"
        onClick={connect}
      >
        Connect to MetaMask
      </Button>}
    </div>
    
    </Stack>
      
     
    
    
    </Stack>
  );
};
export default App;
