import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap'
import { useBotLayoutContext } from '../../../context/BotLayoutProvider';

export default function AppDrawerDropdown() {
    const botLayout = useBotLayoutContext()
    return (
        <NavDropdown title="Menu" id="basic-nav-dropdown">
            {botLayout.map(page => {
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