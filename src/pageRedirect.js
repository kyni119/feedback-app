import React from "react"; 
import "./App.css"; 

const ConfirmationPage = () => {
  return (
    <div className="confirmation-page">
      <h2>Votre avis a été pris en compte</h2>
      <p>Merci pour votre retour !</p>
      <img src="/Images/Success.png" alt="successLogo" className="sucessLogo" />

    </div>
  );
};

export default ConfirmationPage;
