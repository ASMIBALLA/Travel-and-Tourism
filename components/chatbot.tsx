import React from "react";
import "../App.css"; // 👈 adjust path if needed

// Card data (easy to extend)
const cards = [
  {
    id: 1,
    title: "Destinations 🌴",
    desc: "For every bucket list",
    img: "https://bb.branding-element.com/prod/108310/108310-Destination.jpg",
  },
  {
    id: 2,
    title: "Attractions",
    desc: "Worth a thousand stories",
    img: "https://bb.branding-element.com/prod/108310/108310-Attraction.jpg",
  },
  {
    id: 3,
    title: "Experiences",
    desc: "For Every Passion",
    img: "https://bb.branding-element.com/prod/108310/108310-Experience.jpg",
  },
  {
    id: 4,
    title: "Your AI Tour Guide for Exploring Incredible India",
    desc: "Chat with Bharti (coming soon)",
    img: "https://bb.branding-element.com/prod/108310/108310-106001-Ai%20avatar%20temp.jpeg",
  },
];

const Chatbot: React.FC = () => {
  return (
    <div className="engt-wrapper">
      <div className="engt-popup">
        <div className="engt-pages">
          <div className="engt-common-header">
            <div className="engt-header">Incredible India 🌏</div>
          </div>

          <div className="engt-page">
            <div className="engt-cards">
              {cards.map((card) => (
                <div className="engt-card" key={card.id}>
                  <img src={card.img} alt={card.title} />
                  <h2>{card.title}</h2>
                  <p>{card.desc}</p>
                  <button>Click Here</button>
                </div>
              ))}
            </div>
          </div>

          <footer className="engt-footer">Powered by AuroraWave ✨</footer>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
