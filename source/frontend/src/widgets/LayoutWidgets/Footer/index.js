import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faTelegram,
  faDiscord,
  faYoutube,
  faBitcoin,
  faEthereum,
} from "@fortawesome/free-brands-svg-icons";
import { useBotColorsContext } from "../../../context/config/BotColorsProvider";
import { useBotInfoContext } from "../../../context/data/BotInfoProvider";

export default function Footer() {
  const botColors = useBotColorsContext();
  const botInfo = useBotInfoContext()
  return (
    <div style={{ borderTop: "solid 2px " + botColors.border }}>
      <Navbar>
        <Container fluid>
          <div className="mx-auto">
            <span className="d-none d-xl-inline">Follow the </span>
            <a href="https://www.octobot.online">OctoBot project</a>
            <span className="d-none d-xl-inline"> updates</span>
            <span> on </span>
            <a className="me-1" href="https://github.com/Drakkar-Software">
              <FontAwesomeIcon icon={faGithub} />
              <i className="fab fa-github" />
              <span className="d-none d-md-inline"> GitHub</span>
            </a>
            <a className="me-1" href="https://twitter.com/DrakkarsOctoBot">
              <FontAwesomeIcon icon={faTwitter} />
              <span className="d-none d-md-inline"> Twitter</span>
            </a>
            <a className="me-1" href="https://t.me/OctoBot_Project">
              <FontAwesomeIcon icon={faTelegram} />
              <span className="d-none d-md-inline"> Telegram</span>
            </a>
            <a className="me-1" href="https://discordapp.com/invite/vHkcb8W">
              <FontAwesomeIcon icon={faDiscord} />
              <span className="d-none d-md-inline"> Discord</span>
            </a>
            <a
              className="me-1"
              href="https://www.youtube.com/channel/UC2YAaBeWY8y_Olqs79b_X8A"
            >
              <FontAwesomeIcon icon={faYoutube} />
              <span className="d-none d-md-inline"> YouTube</span>
            </a>
            <span>Join the </span>
            <a href="https://t.me/joinchat/F9cyfxV97ZOaXQ47H5dRWw">
              <FontAwesomeIcon icon={faTelegram} />
              <span className="d-none d-xl-inline"> OctoBot </span>
              <span>community </span>
              <span className="d-none d-xxl-inline">chat </span>
            </a>
            <span className="d-none d-xxl-inline me-1">
              for the best tips and tricks.
            </span>
            <a href="/about#donations">
              <span className="d-none d-xl-inline">Support the project </span>
              <FontAwesomeIcon className="me-1" icon={faBitcoin} />
              <FontAwesomeIcon className="me-1" icon={faEthereum} />
            </a>
            <span>OctoBot {botInfo && botInfo.octobot_version}</span>
          </div>
        </Container>
      </Navbar>
    </div>
  );
}
