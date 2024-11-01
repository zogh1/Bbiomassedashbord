import React, { useState, useEffect } from "react";
import {jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import { Card, CardHeader, CardBody, Container, Row, Col, Button, Progress, Alert } from "reactstrap";
import Header from "components/Headers/Header.js";
import { useNavigate } from 'react-router-dom'; 
import '../../assets/css/buttonCss.css';

const AdminImportPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        console.log('Decoded token:', decodedToken); 

        const userRole = decodedToken.user?.role; 
        console.log('User role:', userRole); 

        if (userRole === 'admin') {
          setIsAdmin(true); 
        }
        setIsAuthenticated(true); // Mark user as authenticated
      } catch (error) {
        console.error('Token decoding failed:', error); 
        setUploadStatus('Accès refusé. Token invalide.');
        setAlertVisible(true);
      }
    } else {
      setUploadStatus('Accès refusé. Aucun token disponible.');
      setAlertVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin && isAuthenticated) {
      navigate('/403'); // Redirect to a 403 Forbidden page if user is not an admin
    }
  }, [isAdmin, isAuthenticated, navigate]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadProgress(0);
    setShowProgressBar(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Veuillez sélectionner un fichier.');
      setAlertVisible(true);
      return;
    }

    if (!isAdmin) {
      setUploadStatus('Accès refusé. Seuls les administrateurs peuvent importer des données.');
      setAlertVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setShowProgressBar(true);
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:5000/api/biomass/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      setUploadStatus('Fichier importé avec succès !');
      setAlertVisible(true);
      setUploadProgress(0);
      setShowProgressBar(false);
    } catch (error) {
      setUploadStatus('Erreur lors de l\'importation du fichier : ' + error.response?.data?.msg || error.message);
      setAlertVisible(true);
      setUploadProgress(0);
      setShowProgressBar(false);
    }
  };

  const onDismiss = () => setAlertVisible(false);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h1 className="mb-0 ">Importer les Données</h1>

                <p className="text-muted mt-3">
    Utilisez cette section pour importer de nouvelles données dans la base de données. 
  </p>
  <p className="text-muted">
    Veillez à ce que le fichier soit correctement formaté avant de l'importer pour éviter les erreurs.
  </p>
              </CardHeader>
              <CardBody>
                {isAdmin && isAuthenticated ? (
                  <>
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      style={{ display: 'none' }} 
                      id="fileInput" 
                    />
                    <div className="btn custom-btn-2" onClick={() => document.getElementById('fileInput').click()}>
                      Choisir un fichier
                    </div>

                    <div className="btn custom-btn ml-2" onClick={handleUpload} disabled={!isAdmin}>
                      Importer
                    </div>

                    {showProgressBar && (
                      <Progress animated color="info" value={uploadProgress} className="mt-3">
                        {uploadProgress}%
                      </Progress>
                    )}

                    {alertVisible && (
                      <Alert className="mt-3" color={uploadStatus.includes('succès') ? 'success' : 'danger'} isOpen={alertVisible} toggle={onDismiss}>
                        {uploadStatus}
                      </Alert>
                    )}
                  </>
                ) : (
                  <Alert color="danger">
                    Accès refusé. Vous devez être administrateur pour accéder à cette page.
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminImportPage;
