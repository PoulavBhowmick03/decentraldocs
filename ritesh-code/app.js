import React, { useEffect, useState } from "react";
import "./Npp.css";

const steps = [
  {
    title: "Upload Document",
    description: "Start by securely uploading your document to our platform.",
    icon: "📤",
  },
  {
    title: "AI Verification",
    description:
      "Our AI-powered system verifies your document for authenticity.",
    icon: "🛡️",
  },
  {
    title: "Blockchain Storage",
    description:
      "Verified documents are stored securely using blockchain technology.",
    icon: "🔗",
  },
  {
    title: "Get Certified",
    description: "Receive a tamper-proof certification of your document.",
    icon: "🏅",
  },
];

const TextSwiper = () => {
  const [index, setIndex] = useState(0);
  const texts = [
    "Secure and Tamper-proof",
    "AI-Powered Verification",
    "Globally Accessible",
    "Blockchain-Backed Security",
    "Efficient and Reliable",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return <div className="text-swiper">{texts[index]}</div>;
};

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="app-container">
      <nav className="nav-bar">
        <h1 className="logo">TrustChain</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>

      <main className="main-content">
        <section className="hero">
          <h1 className="hero-title">
            Decentralized Document Verification Platform
          </h1>
          <p className="hero-description">
            AI-powered, tamper-proof document verification using blockchain
            technology.
          </p>
          <a href="#how-it-works" className="get-started-btn">
            Get Started
          </a>
        </section>

        <section id="how-it-works" className="how-it-works">
          <h2 className="section-title">How to Get Started</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="why-choose-us">
          <h2 className="section-title">Why TrustChain?</h2>
          <TextSwiper />
        </section>
      </main>

      <footer className="footer">
        <h3 className="footer-title">TrustChain</h3>
        <p>Securing your documents for a decentralized future.</p>
      </footer>
    </div>
  );
};

export default App;
