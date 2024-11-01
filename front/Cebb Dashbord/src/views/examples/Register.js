import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  CardFooter,
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivacyPolicyModal from './PrivacyPolicyModal'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    organization: '',
    position: '',
    phone: '',
    location: '',
    specialization: '',
  });
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false); // State to track the checkbox
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false); // State for modal visibility

  const navigate = useNavigate();

  const togglePrivacyPolicyModal = () => {
    setIsPrivacyPolicyModalOpen(!isPrivacyPolicyModalOpen);
  };

  const validateEmail = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });

    if (email) {
      const exists = await validateEmail(email);
      if (exists) {
        setEmailExists(true);
        setErrors({ ...errors, email: 'Email is already in use.' });
      } else {
        setEmailExists(false);
        setErrors({ ...errors, email: null });
      }
    } else {
      setEmailExists(false);
      setErrors({ ...errors, email: null });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsPrivacyPolicyChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPrivacyPolicyChecked) {
      toast.error('You must agree with the Privacy Policy to register.');
      return;
    }

    setLoading(true);
    setError(null);

    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z]+$/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (emailExists) {
      newErrors.email = 'This email is already in use. Please use a different email.';
    }

    // Role validation
    if (!formData.role || formData.role === 'user') {
      newErrors.role = 'Please select a role';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Additional fields validation
    if (!formData.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.msg || 'Something went wrong!');
      }

      toast.success('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithSogo = async () => {
    setLoading(true);
    setError(null);

    try {
        const response = await fetch('http://localhost:5000/api/users/register-sogo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
                organization: formData.organization,
                position: formData.position,
                phone: formData.phone,
                location: formData.location,
                specialization: formData.specialization,
            }),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.msg || 'Failed to register with SOGo.');
        }

        // If registration is successful, display success message
        toast.success('Account created successfully with SOGo authentication! Redirecting to login...');

        setTimeout(() => {
            navigate('/auth/login');
        }, 3000);
    } catch (err) {
        setError(err.message);
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
};

  


  return (
    <>
      <PrivacyPolicyModal isOpen={isPrivacyPolicyModalOpen} toggle={togglePrivacyPolicyModal} />
      <ToastContainer />
      <Col lg="8" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <h1>Sign up with</h1>
            </div>
            <div className="text-center">
              <Button
                className="btn-neutral btn-icon mr-4"
                color="default"
                href="#pablo"
                onClick={handleRegisterWithSogo}              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require('../../assets/img/icons/common/sogo (1).svg').default
                    }
                  />
                </span>
                <span className="btn-inner--text">SOGo</span>
              </Button>
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <span className="btn-inner--icon">
                  <img
                    alt="..."
                    src={
                      require('../../assets/img/icons/common/google.svg').default
                    }
                  />
                </span>
                <span className="btn-inner--text">Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <h1>Or sign up with credentials</h1>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
  <Row>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-hat-3" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{color: 'black'}}
            className={errors.name ? 'is-invalid' : ''}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-email-83" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="new-email"
            value={formData.email}
            onChange={handleEmailChange}
            style={{color: 'black'}}

            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          {emailExists && (
            <div className="text-danger mt-2">
              This email is already in use. Please use a different email.
            </div>
          )}
        </InputGroup>
      </FormGroup>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <FormGroup>
        <InputGroup className="role-selection-group mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-badge" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.role ? 'is-invalid' : ''}
          >
            <option value="User">User</option>
            <option value="Chercheur">Chercheur</option>
            <option value="Décideurs politiques">Décideurs politiques</option>
            <option value="Agriculteurs">Agriculteurs</option>
          </Input>
          {errors.role && <div className="invalid-feedback">{errors.role}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-briefcase-24" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Organization"
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.organization ? 'is-invalid' : ''}
          />
          {errors.organization && <div className="invalid-feedback">{errors.organization}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-badge" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.position ? 'is-invalid' : ''}
          />
          {errors.position && <div className="invalid-feedback">{errors.position}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-mobile-button" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.phone ? 'is-invalid' : ''}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-pin-3" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.location ? 'is-invalid' : ''}
          />
          {errors.location && <div className="invalid-feedback">{errors.location}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-single-copy-04" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Specialization"
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            style={{color: 'black'}}

            className={errors.specialization ? 'is-invalid' : ''}
          />
          {errors.specialization && <div className="invalid-feedback">{errors.specialization}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
  </Row>

  <Row>
    <Col md="6">
      <FormGroup>
        <InputGroup className="input-group-alternative">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-lock-circle-open" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            style={{color: 'black'}}

            onChange={handleChange}
            className={errors.password ? 'is-invalid' : ''}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </InputGroup>
      </FormGroup>
    </Col>
    <Col md="6">
     
    </Col>
  </Row>
  <FormGroup>
        <div className="custom-control custom-control-alternative custom-checkbox">
          <input
            className="custom-control-input"
            id="customCheckRegister"
            type="checkbox"
            checked={isPrivacyPolicyChecked}
            onChange={handleCheckboxChange}
          />
          <label className="custom-control-label" htmlFor="customCheckRegister">
            <span className="text-muted">
              I agree with the{' '}
              <a href="#pablo" onClick={togglePrivacyPolicyModal}>
                Privacy Policy
              </a>
            </span>
          </label>
        </div>
      </FormGroup>
  {error && (
    <div className="text-center text-danger mb-4">
      <small>{error}</small>
    </div>
  )}
  <div className="text-center">
    <Button
      className="mt-4 custom-btn "
    
      type="submit"
      disabled={loading || emailExists || !isPrivacyPolicyChecked}
    >
      {loading ? 'Creating account...' : 'Create account'}
    </Button>
  </div>
</Form>

          </CardBody>

          <CardFooter className=" mb-3 text-center">

<Link className="text-light mb-3 mt-5" to="/auth/login">
    <div className='btn custom-btn-outline'>Sign in</div>
  </Link>
</CardFooter>
        </Card>
      </Col>
    </>
  );
};

export default Register;
