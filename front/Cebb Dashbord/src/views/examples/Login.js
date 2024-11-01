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
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSogoSignIn = async () => {
    if (!validateForm()) return; // Validate form before sending the request

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/signin-sogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Use the email and password input by the user
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Something went wrong!');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.user.name);

      toast.success('SOGo Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log("helllo")
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Something went wrong!');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.user.name);

      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/admin/dashboard');
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
      <ToastContainer />
      <Col lg="6" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-3">
              <h1>Sign in with</h1>
            </div>
            <div className="btn-wrapper text-center mt-2">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                onClick={handleSogoSignIn}
              >
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

          <CardBody className="px-lg-5 py-lg-3">
            <div className="text-center text-muted mb-4">
              <h2>Or sign in with credentials</h2>
            </div>
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'is-invalid' : ''}
                    style={{color:'black'}}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </InputGroup>
              </FormGroup>
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
                    value={formData.password}
                    onChange={handleChange}
                    style={{color:'black'}}

                    className={errors.password ? 'is-invalid' : ''}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </InputGroup>
              </FormGroup>
              {error && (
                <div className="text-center text-danger mb-4">
                  <small>{error}</small>
                </div>
              )}
              <div className="custom-control custom-control-alternative custom-checkbox">
              <input
  className="custom-control-input"
  id="customCheckLogin"
  type="checkbox"
/>
<label
  className="custom-control-label"
  htmlFor="customCheckLogin"
>
  Remember me
</label>
              </div>
              <div className="text-center">
                <Button className="my-4 btn btn-lg custom-btn"  type="submit" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </Form>
            <hr style={{color :'black'}}></hr>

          </CardBody>

          <CardFooter className=" mb-3 text-center">

          <Link className="text-light mb-3 mt-5" to="/auth/register">
              <div className='btn custom-btn-outline'>Create new account</div>
            </Link>
</CardFooter>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
          </Col>
          <Col className="text-right" xs="6">
            <Link className="text-light" to="/auth/forgot-password">
              <p>Forgot password?</p>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
