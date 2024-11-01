import React, { useState } from 'react';
import { FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'; // Ensure axios is installed
import Header from 'components/Headers/Header';

const CarbonFootprintPredictionForm = () => {
    const [biomassType, setBiomassType] = useState('');
    const [biomassQuantity, setBiomassQuantity] = useState('');
    const [density, setDensity] = useState('');
    const [waterContent, setWaterContent] = useState('');
    const [ashContent, setAshContent] = useState('');
    const [carbonFootprint, setCarbonFootprint] = useState(''); 
    const [predictionResult, setPredictionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [modal, setModal] = useState(false);

    const toggleModal = () => setModal(!modal);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = {
            "Type de Biomasse": biomassType,
            "Quantité de Biomasse (tonnes)": parseFloat(biomassQuantity),
            "Densité (kg/m^3)": parseFloat(density),
            "Teneur en eau (%)": parseFloat(waterContent),
            "Teneur en cendres (%)": parseFloat(ashContent),
            "Empreinte carbone (kg CO2e/kg)": parseFloat(carbonFootprint)
        };

        try {
            const response = await axios.post('http://localhost:5001/predire_empreinte_carbone', data);
            setPredictionResult(response.data.emprunte_carbone_prevue);
            toggleModal(); // Open modal on successful prediction
        } catch (err) {
            setError('Error predicting carbon footprint: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
          <Header />

        <div className="carbon-footprint-prediction-form" style={{ padding: '20px', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Carbon Footprint Prediction</h1>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="biomassType">Type de Biomasse:</Label>
                    <Input 
                        type="text" 
                        id="biomassType" 
                        placeholder="Enter type of biomass"
                        value={biomassType}
                        onChange={(e) => setBiomassType(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="biomassQuantity">Quantité de Biomasse (tonnes):</Label>
                    <Input 
                        type="number" 
                        id="biomassQuantity" 
                        placeholder="Enter quantity in tonnes"
                        value={biomassQuantity}
                        onChange={(e) => setBiomassQuantity(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="density">Densité (kg/m³):</Label>
                    <Input 
                        type="number" 
                        id="density" 
                        placeholder="Enter density"
                        value={density}
                        onChange={(e) => setDensity(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="waterContent">Teneur en eau (%):</Label>
                    <Input 
                        type="number" 
                        id="waterContent" 
                        placeholder="Enter water content"
                        value={waterContent}
                        onChange={(e) => setWaterContent(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="ashContent">Teneur en cendres (%):</Label>
                    <Input 
                        type="number" 
                        id="ashContent" 
                        placeholder="Enter ash content"
                        value={ashContent}
                        onChange={(e) => setAshContent(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="carbonFootprint">Empreinte carbone (kg CO2e/kg):</Label>
                    <Input 
                        type="number" 
                        id="carbonFootprint" 
                        placeholder="Enter carbon footprint"
                        value={carbonFootprint}
                        onChange={(e) => setCarbonFootprint(e.target.value)}
                        required
                    />
                </FormGroup>
                <Button className='custom-btn' type="submit" disabled={loading}>
                    {loading ? 'Predicting...' : 'Predict Carbon Footprint'}
                </Button>
            </form>

            {/* Modal for prediction result */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Prediction Result</ModalHeader>
                <ModalBody>
                    {error ? (
                        <div style={{ color: 'red' }}>{error}</div>
                    ) : (
                        <div style={{ color: 'black' }}>
                           <span style={{color : '#ad1641'}}> Predicted Carbon Footprint : </span> <b>{predictionResult} kg CO2 </b>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button className='custom-btn-2' onClick={toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>
        </>
    );
};

export default CarbonFootprintPredictionForm;
