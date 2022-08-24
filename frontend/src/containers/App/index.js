import React from 'react';
import styled from 'styled-components';

import 'bootstrap/dist/css/bootstrap.min.css';
// import "react-grid-layout/css/styles.css"
// import "react-resizable/css/styles.css"

import Octobot from '../Octobot';

const AppWrapper = styled.div`
 height: 100%;
 width: 100%;
`;

export default function App() {
  return (
    <AppWrapper>
        <Octobot/>
    </AppWrapper>
  );
}
 