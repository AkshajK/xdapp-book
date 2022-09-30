import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Stack from 'react-bootstrap/Stack';


const Message = ({me, message: {senderName, senderChain, senderAddress, message}}) => {
  const nameClass = me ? `text-danger fw-bold` : `text-success fw-bold`
  return (
    <Stack direction="horizontal" gap={3}>
       <div><span className={nameClass}>{senderName}</span> <span className={me ? "text-danger" : undefined}>from</span> <span className={nameClass}>{senderChain}</span></div>
       <div className="text-primary">{senderAddress}</div>
       <div>{message}</div>
    </Stack>
  );
};
export default Message;
