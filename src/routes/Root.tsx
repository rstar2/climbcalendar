import { Outlet } from "@tanstack/react-router";
import { Container } from "@chakra-ui/react";

import "./Root.css";
import Header from "../components/Header";

export default function Root() {
  return (
    <Container maxW="90%">
      <Header/>
      <Outlet />
    </Container>
  );
}
