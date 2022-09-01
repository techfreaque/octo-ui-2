import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useBotColorsContext } from "../../../context/BotColorsProvider";
import AppWidgets from "../../AppWidgets";

function NavBar(props) {
  const botColors = useBotColorsContext();
  // const exchange_name= props.botDataManager.mainBotData.exchange_name
  // const timeframes = Object.keys(props.botDataManager.mainBotData.time_frames ).map(
  //       (timeframe_key, timeframe) => {
  //         return (
  //           <NavDropdown.Item>{timeframe_key}</NavDropdown.Item>
  //         );
  //       }
  //     );
  // const symbols = props.botDataManager.mainBotData.symbols.map(
  //         (symbol) => {
  //           return (
  //             <NavDropdown.Item>{symbol}</NavDropdown.Item>
  //           );
  //         }
  //       );

  return (
    <div style={{ borderBottom: "solid 2px " + botColors.border }}>
      <Navbar id="header">
        <Container fluid>
          <Nav className="me-auto">
            <AppWidgets {...props} layout={props.leftContent} />
          </Nav>
          <Nav>
            <NavDropdown title={props.exchange_name} id="basic-nav-dropdown">
              <NavDropdown.Item>{props.exchange_name}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item to="/accounts">
                Mange Exchanges
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link to="/notifications">
              {/* <FontAwesomeIcon icon="fa-solid fa-bell" /> */}
              <span id="errors-count-badge" className="badge badge-warning">
                3
              </span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;

// {/* <Dropdown item simple text='Menu'>
//                  {/* <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} /> */}

//                  <Dropdown.Menu>
//                  <Link to="/">
//                      <Dropdown.Item key="/">
//                          Home
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/profile">
//                      <Dropdown.Item key="/profile">
//                         Profile
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/backtesting">
//                      <Dropdown.Item key="/backtesting">
//                          Backtesting
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/trading">
//                      <Dropdown.Item key="/trading">
//                          Trading
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/portfolio">
//                      <Dropdown.Item key="/portfolio">
//                          Portfolio
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/accounts">
//                      <Dropdown.Item key="/accounts">
//                          Accounts
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/community">
//                      <Dropdown.Item key="/community">
//                          Community
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/octobot_help">
//                      <Dropdown.Item key="/octobot_help">
//                          Help
//                      </Dropdown.Item>
//                  </Link>
//                  <Link to="/about">
//                      <Dropdown.Item key="/about">
//                          About
//                      </Dropdown.Item>
//                  </Link>
//              </Dropdown.Menu>
//            {/* </Dropdown>
//            <Menu.Item as='a' header> */}
//              Octobot
//            {/* </Menu.Item> */}
//            {/* {props.symbols &&
//              <Dropdown item simple text='Symbols'>
//                  <Dropdown.Menu>
//                      {symbols}
//                  </Dropdown.Menu>
//              </Dropdown>
//            } */}
//            {/* <Dropdown item simple text='Timeframes'>
//              <Dropdown.Menu>
//                  {timeframes}
//              </Dropdown.Menu>
//            </Dropdown>
//            <Menu.Item as='a' header>
//              <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
//              {props.exchange_name}
//            </Menu.Item> */}
