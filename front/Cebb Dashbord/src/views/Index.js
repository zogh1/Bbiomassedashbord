import { useState } from "react";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>

        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className=" shadow" style={{background :'#887993'}}>
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Biomass Availability Report</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Power BI iframe */}
                <div style={{ height: "600px" }}>
                  <iframe
                    title="disponibilité biomasse"
                    width="100%"
                    height="100%"
                    src="https://app.powerbi.com/reportEmbed?reportId=c94be322-c27d-4759-b73b-905568318087&autoAuth=true&ctid=61f3e3b8-9b52-433a-a4eb-c67334ce54d5"
                    frameborder="0"
                    allowFullScreen="true"
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
