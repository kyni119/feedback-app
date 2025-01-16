import React, { useState, useEffect } from "react"; 
import "./App.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import Cookies from "js-cookie"; 


const FeedbackPage = ({ companyName }) => {
  const [rating, setRating] = useState(null);
  const [firstName, setClientName] = useState("");
  const [lastName, setClientLastName] = useState("");
  const [matricule, setMatricule] = useState("");
  const [numeroTicket, setNumeroTicket] = useState("");
  const [showMessage, setShowMessage] = useState(false); 
  const navigate = useNavigate(); 
  const location = useLocation(); 


  useEffect(() => {
   
    const queryParams = new URLSearchParams(location.search);
    setNumeroTicket(queryParams.get('ticket'));
    setClientName(queryParams.get('firstname'));
    setClientLastName(queryParams.get('lastname'));
    setMatricule(queryParams.get('matricule'));

   const submittedTicket = Cookies.get('feedbackSubmittedTicket');
   if (submittedTicket && submittedTicket === numeroTicket) {
     toast.info("Vous avez déjà soumis un avis pour ce ticket.");
     navigate("/confirmation", { replace: true });
   }
  }, [location,navigate,numeroTicket]); 

  
 
  const handleRatingClick = (value) => {
    setRating(value);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star" onClick={() => handleRatingClick(i)} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} className="star" onClick={() => handleRatingClick(i)} />);
      } else {
        stars.push(<FaRegStar key={i} className="star" onClick={() => handleRatingClick(i)} />);
      }
    }
    return stars;
  };

  const getMessageAndImage = (rating) => {
    switch (rating) {
      case 1:
        return { message: "Très Mécontent", image: "/Images/insatisfait.png" };
      case 2:
        return { message: "Insatisfait", image: "/Images/triste.png" };
      case 3:
        return { message: "Neutre", image: "/Images/neutre.png" };
      case 4:
        return { message: "Satisfait", image: "/Images/content.png" };
      case 5:
        return { message: "Très satisfait", image: "/Images/tresbien.png" };
      default:
        return { message: "", image: null };
    }
  };

  const handleSubmit = async () => {
    if (rating === null) {
      toast.error("Veuillez sélectionner une note.");
      return;
    }
  
    const payload = {
      firstname: firstName,
      lastname: lastName,
      numeroticket: numeroTicket,
      avis: rating
    };
  
    try {
      const response = await fetch("http://5.9.195.245:9050/appsapis/AddAvis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      console.log("Payload:", payload);
      if (response.ok) {
        const responseData = await response.json(); 
        console.log("Réponse de l'API:", responseData);
  
        if (responseData.errorCode === 0) {
           Cookies.set('feedbackSubmittedTicket', numeroTicket, { expires: 365 }); 
          setShowMessage(true);
          toast.success("Merci pour votre aide !");
          navigate("/confirmation", { replace: true });
        } else {
          toast.error("Erreur lors de l'enregistrement de la note. Veuillez réessayer.");
        }
      } else {
        toast.error("Erreur lors de la communication avec le serveur. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur API:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="feedback-page">
      <header className="header">
        <img src="https://ma.mugef-ci.org/public/logo-mugefci.png" alt="Logo" className="logo" />
        <hr className="divider" />
      </header>
      <main className="content">
        <h2>Bonjour Cher Mutualiste {firstName} {lastName}, Matricule: {matricule}</h2>
        <p className="message-text">
        Nous aimerions recueillir votre avis à la suite du traitement de votre réclamation pour améliorer nos services.
        </p>

        <div className="rating-options">
          {renderStars()}
        </div>

        {rating && (
          <div className="thank-you-message">
            <div className="message-icon-container">
              <img src={getMessageAndImage(rating).image} alt="satisfaction" className="rating-image" />
              <p><strong>{getMessageAndImage(rating).message}</strong></p>
            </div>
          </div>
        )}

        <div className="submit-button">
          <button className="react-button" onClick={handleSubmit}>Envoyer</button>
        </div>
      </main>
      <footer>
        <p>L'équipe réclamation {companyName}</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

function App() {
  return <FeedbackPage companyName="Mugef-ci" />;
}

export default App;
