"use client";

import GlobalContext from "@/contexts/context";
import { ShieldAlert } from "lucide-react";
import { useContext } from "react";
import { Alert, AlertTitle } from "../ui/alert";

const Error = () => {
  const { error } = useContext(GlobalContext);

  if (error === null) return null;
  return (
    <Alert variant="destructive">
      <ShieldAlert />
      <AlertTitle>{error}</AlertTitle>
    </Alert>
  );
};
export default Error;
