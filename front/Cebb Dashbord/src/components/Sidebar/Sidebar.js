import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'; 
import { PropTypes } from "prop-types";
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav, Container } from "reactstrap";
import { FaWind } from 'react-icons/fa'; // Importing the energy icon

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.user?.role); 
        setIsAuthenticated(true); 
      } catch (error) {
        console.error('Token decoding failed:', error);
        setIsAuthenticated(false); 
      }
    } else {
      setIsAuthenticated(false); 
    }
  }, []);

  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      // Show/hide links based on user roles
      if ((prop.name === "Users Management" || prop.name === "AdminImportPage" || prop.name === "Audit Logs") && userRole !== "admin") {
        return null; 
      }

      if ((prop.name === "Login" || prop.name === "Register") && isAuthenticated) {
        return null; 
      }

      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            activeClassName="active"
          >
            {/* If the icon is a React component, render it directly */}
            {typeof prop.icon === 'string' ? (
              <i className={prop.icon} />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {prop.icon}
              </span>
            )}
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar className="navbar-vertical fixed-left navbar-light bg-white" expand="md" id="sidenav-main">
      <Container fluid>
        <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
          <span className="navbar-toggler-icon" />
        </button>
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
          </NavbarBrand>
        ) : null}
        <Collapse navbar isOpen={collapseOpen}>
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string.isRequired,
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
