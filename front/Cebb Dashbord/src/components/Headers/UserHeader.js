
// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

const UserHeader = () => {
  const userName = localStorage.getItem('userName') || 'User'; // Default to 'User' if no name is found

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
       
      >
        {/* Mask */}
        <span className="mask" style={{ background: 'linear-gradient(-45deg, #ad1641, #887993)', opacity: 1 }} />
{/* Header container */}
<Container className="d-flex align-items-center" fluid>
  <Row>
    <Col  md="10">
      <h1 className="display-2 text-white"><b style={{fontWeight:'normal'}}>Hello</b> <strong>{userName}</strong></h1> {/* Insert the user name here */}
      <p className="text-white mt-0 mb-3">
        This is your profile page : You can see the progress you've made
        with your work and manage your projects or assigned tasks.
      </p>
      <p className="text-white">
        You can update your personal information on this page.
      </p>
      <p className="text-white">
        Ensure all your contact details are accurate to stay informed.
      </p>
      <p className="text-white">
        Customize your profile settings for a personalized experience.
      </p>
    </Col>
  </Row>
</Container>

      </div>
    </>
  );
};

export default UserHeader;
