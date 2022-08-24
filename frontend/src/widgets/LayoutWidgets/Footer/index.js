import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Footer(props) {
  return (
    <Navbar bg="dark" id="footer">
      <Container fluid>      
        <div className="text-center">
          Follow the 
          <a href="https://www.octobot.online" target="_blank" rel="noopener">
            OctoBot project
          </a>
          <span className="d-none d-md-inline">updates </span>on 
          <a
            href="https://github.com/Drakkar-Software"
            target="_blank"
            rel="noopener"
          >
            <i className="fab fa-github" />
            <span className="d-none d-md-inline"> GitHub</span>
          </a>
          <a
            href="https://twitter.com/DrakkarsOctoBot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter" />
            <span className="d-none d-md-inline"> Twitter</span>
          </a>
          <a
            href="https://t.me/OctoBot_Project"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-telegram" />
            <span className="d-none d-md-inline"> Telegram</span>
          </a>
          <a
            href="https://discordapp.com/invite/vHkcb8W"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-discord" />
            <span className="d-none d-md-inline"> Discord</span>
          </a>
          <a
            href="https://www.youtube.com/channel/UC2YAaBeWY8y_Olqs79b_X8A"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-youtube" />
            <span className="d-none d-md-inline"> YouTube</span>
          </a>
          Join the 
          <a
            href="https://t.me/joinchat/F9cyfxV97ZOaXQ47H5dRWw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-telegram" />
            <span className="d-none d-md-inline">OctoBot</span> community{' '}
            <span className="d-none d-md-inline">chat</span>
          </a>{' '}
          <span className="d-none d-md-inline">for the best tips and tricks.</span>
          <a href="/about#donations">
            <span className="d-none d-md-inline">Support the project </span>
            <i className="fab fa-bitcoin" /> <i className="fab fa-ethereum" />
          </a>
          <span update-url="/api/version" id="botVersion">
            OctoBot 0.4.5
          </span>
        </div>
      </Container>      
    </Navbar>
  );
}

export default Footer;
