import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap'



export default function AppDrawerDropdown(props) {
    return (
        <NavDropdown title="Menu" id="basic-nav-dropdown">
            {props.botDataManager.pages.map(page => {
                return (
                    <LinkContainer key={page.path} to={page.path}>
                        <NavDropdown.Item>{page.title}</NavDropdown.Item>
                    </LinkContainer>
                    )
            })}
            {/* <NavDropdown.Divider /> */}
        </NavDropdown> 
    )
}