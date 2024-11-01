

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="http://www.chaire-biotechnologie.centralesupelec.fr/fr/node/242"
              rel="noopener noreferrer"
              target="_blank"
            >
             Chaire de Biotechnologie
             CentraleSupélec - Pomacle
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                href="http://www.chaire-biotechnologie.centralesupelec.fr/fr/node/242"
                rel="noopener noreferrer"
                target="_blank"
              >
Chaire de Biotechnologie
            </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="http://www.chaire-biotechnologie.centralesupelec.fr/fr"
                rel="noopener noreferrer"
                target="_blank"
              >
                About Us
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                href="https://fr.linkedin.com/company/centre-europ%C3%A9en-de-biotechnologie-et-de-bio%C3%A9conomie"
                rel="noopener noreferrer"
                target="_blank"
              >
                Blog
              </NavLink>
            </NavItem>

         
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
