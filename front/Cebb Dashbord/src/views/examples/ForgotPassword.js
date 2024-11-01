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
  Container,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import AdminNavbar from 'components/Navbars/AuthNavbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Something went wrong!');
      }

      toast.success('If the email exists, a reset link has been sent.');

      // Redirect to login page after successful submission
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);  // 3-second delay before redirecting
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
            <div className="header " style={{ background: 'linear-gradient(-45deg, #ad1641, #887993)', opacity: 1 }}>

           <AdminNavbar />
    
      <ToastContainer />

      
      <Container className="" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-center text-center mt-5">
                <Col lg="8" md="6">
                <h1 className="text-white text-center">Mot de passe oublié</h1>
<p className="text-lead text-light">
  Vous avez oublié votre mot de passe ? Ne vous inquiétez pas, cela arrive ! 
  En fournissant votre adresse e-mail, vous recevrez un lien pour réinitialiser votre mot de passe.
</p>
<p className="text-light">
  Assurez-vous de vérifier votre boîte de réception (et votre dossier spam) pour le lien de réinitialisation.
</p>

                </Col>
              </Row>
        <Row className="w-100 mt-5">
          <Col lg="5" md="7" className="mx-auto">
            <Card className="bg-secondary shadow border-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-center mt-2">
                  <h1>Mot de passe oublié</h1>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
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
                        value={email}
                        style={{color: 'black'}}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <div className="text-center">
                    <Button className="my-4 custom-btn"  type="submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </>

  );
};

export default ForgotPassword;
