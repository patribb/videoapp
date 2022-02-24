import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react'
import App from './App';
import theme from './theme';
import './index.css';

ReactDOM.render(
  <ChakraProvider>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Router>
      <App />
    </Router>
  </ChakraProvider>,
  document.getElementById('root')
);

