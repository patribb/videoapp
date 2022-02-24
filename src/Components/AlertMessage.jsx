import { Alert, AlertTitle } from "@chakra-ui/react";
import React from "react";

const AlertMessage = ({ status, icon, msg }) => {
  return (
    <Alert status={`${status ? status : "info"}`}>
      {icon}
      <AlertTitle ml={10}>{msg}</AlertTitle>
    </Alert>
  );
};

export default AlertMessage;
