import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import unnamed from 'assets/img/brand/unnamed.png'; 

const PrivacyPolicyModal = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered> {/* Size set to lg to make the modal larger */}
      <ModalHeader toggle={toggle}>Privacy Policy</ModalHeader>
      <ModalBody>
        <img
          src={unnamed}
          alt="Privacy Policy"
          style={{ width: '100%', height: 'auto', marginBottom: '20px' }}
        />
        <p>
          Bienvenue dans notre application dédiée à la collecte, à l'analyse et à la visualisation
          des données sur les différentes sources de biomasse en France. Notre mission est de
          faciliter la valorisation de la biomasse en fournissant des informations détaillées
          sur leurs propriétés, leur localisation et leurs applications potentielles.
        </p>
        <p>
          Nous nous engageons à respecter la confidentialité des données de nos utilisateurs. Toutes
          les informations que vous fournissez seront traitées avec la plus grande confidentialité
          et ne seront jamais partagées avec des tiers sans votre consentement. Nous prenons
          toutes les mesures nécessaires pour protéger vos données contre tout accès non autorisé.
        </p>
        <p>
          En utilisant notre application, vous acceptez les termes de cette politique de confidentialité.
          Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PrivacyPolicyModal;
