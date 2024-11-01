import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import UserHeader from 'components/Headers/UserHeader.js';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    organization: '',
    position: '',
    phone: '',
    location: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // State for 2FA QR Code URL
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login page
      navigate('/admin/index');
      return;
    }

    // Fetch user profile when component mounts
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setFormData({ 
            ...formData, 
            name: result.name, 
            email: result.email,
            organization: result.organization || '',
            position: result.position || '',
            phone: result.phone || '',
            location: result.location || '',
            specialization: result.specialization || ''
          });
        } else {
          throw new Error(result.msg || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    console.log("Form Data Submitted:", formData); // Debugging line
  
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Failed to update profile');
      }
  
      toast.success('Profile updated successfully!');
  
      navigate('/admin/index');
  
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/enable-2fa', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setQrCodeUrl(result.qrCodeUrl);
        setIsModalOpen(true); // Show the modal with the QR code
      } else {
        throw new Error(result.msg || 'Failed to enable 2FA');
      }
    } catch (err) {
      toast.error('Error enabling 2FA: ' + err.message);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = '2fa-qr-code.png';
      link.click();
    }
  };

  return (
    <>
      <UserHeader />
      <ToastContainer />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h1 className="mb-0">My account</h1>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-name"
                          >
                            Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-name"
                            name="name"
                            placeholder="Name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            name="email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-organization"
                          >
                            Organization
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-organization"
                            name="organization"
                            placeholder="Organization"
                            type="text"
                            value={formData.organization}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-position"
                          >
                            Position
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-position"
                            name="position"
                            placeholder="Position"
                            type="text"
                            value={formData.position}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-phone"
                          >
                            Phone
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-phone"
                            name="phone"
                            placeholder="Phone"
                            type="text"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-location"
                          >
                            Location
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-location"
                            name="location"
                            placeholder="Location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-specialization"
                          >
                            Specialization
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-specialization"
                            name="specialization"
                            placeholder="Specialization"
                            type="text"
                            value={formData.specialization}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-new-password"
                          >
                            New Password
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-new-password"
                            name="newPassword"
                            placeholder="New Password"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  {error && (
                    <div className="text-danger text-center">
                      {error}
                    </div>
                  )}
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <Button className="btn custom-btn" type="submit" disabled={loading}>
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Col>
                      <Col lg="6" className="text-right">
                        <div className="btn custom-btn-2" onClick={handleEnable2FA}>
                          Enable 2FA
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal to show QR code for 2FA */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalBody className="text-center">
          <h5>Scan this QR code with your authentication app</h5>
          {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code for 2FA" /> : <p>Loading...</p>}
          <div className="mt-3">
            <Button className="btn custom-btn" onClick={handleDownloadQR}>
              Download QR Code
            </Button>
            {' '}
            <Button className="btn custom-btn-2" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Profile;
