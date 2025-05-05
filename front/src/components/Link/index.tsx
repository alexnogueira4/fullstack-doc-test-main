import { Link as RawLink } from "react-router-dom";
import styled from "styled-components";

const Link = styled(RawLink)`
  color: blue;
  text-decoration: underline;
  padding: 10px;
  display: block;
`;

export default Link;
