"use client";

import { AlertCircleIcon, Info } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

const BlankMessage = ({ message = "No data found", isError = false }) => {
  return !isError ? (
    <Alert>
      <Info />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  ) : (
    <Alert variant="destructive">
      <AlertCircleIcon className="text-red-500" />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
};

export default BlankMessage;
