// app/page.tsx
"use client";
import React, { useState } from "react";
import "@/app/globals.css"; // your .engt-* CSS

/* ============================
   Incredible India Chat Widget
============================ */
const indiaCards = [
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

const IncredibleIndiaWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          background: "#0077ff",
          color: "#fff",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          border: "none",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 900,
        }}
      >
        🌏
      </button>

      {/* Popup */}
      {open && (
        <div
          className="engt-wrapper"
          style={{
            position: "fixed",
            bottom: "170px",
            right: "20px",
            width: "350px",
            maxHeight: "500px",
            overflowY: "auto",
            zIndex: 900,
          }}
        >
          <div className="engt-popup">
            <div className="engt-pages">
              <div className="engt-common-header">
                <div className="engt-header">Incredible India 🌏</div>
              </div>

              <div className="engt-page">
                <div
                  className="engt-cards"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  {indiaCards.map((card) => (
                    <div
                      className="engt-card"
                      key={card.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        padding: "15px",
                        width: "90%",
                        transition: "transform 0.2s",
                      }}
                    >
                      <img
                        src={card.img}
                        alt={card.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <h2 style={{ fontSize: "18px", margin: "12px 0 6px" }}>{card.title}</h2>
                      <p style={{ color: "#555", fontSize: "14px" }}>{card.desc}</p>
                      <button
                        style={{
                          marginTop: "10px",
                          padding: "8px 14px",
                          border: "none",
                          borderRadius: "6px",
                          background: "#0077ff",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Click Here
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="engt-footer" style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#777" }}>
                Powered by AuroraWave ✨
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ============================
   Page Export
============================ */
export default function Page() {
  return <IncredibleIndiaWidget />;
}
