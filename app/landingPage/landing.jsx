/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

// Constellation Background Component
const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = [];
    const numStars = 200; // Number of stars

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1, // Thinner stars
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`, // Clearer stars
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0 || star.x > canvas.width) star.speedX *= -1;
        if (star.y < 0 || star.y > canvas.height) star.speedY *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.width = 0;
      canvas.height = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation-background"></canvas>;
};

// Step Card Component
const StepCard = ({ step, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div className={`step-card card-${index}`} ref={cardRef}>
      <div className="step-icon">{step.icon}</div>
      <div className="step-content">
        <h3 className="step-title">{step.title}</h3>
        <p className="step-description">{step.description}</p>
      </div>
    </div>
  );
};

// Typewriter Effect Component
const Typewriter = ({ text, key }) => {
  const [displayedText, setDisplayedText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    if (index.current < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index.current]);
        index.current += 1;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [displayedText, text]);

  return (
    <div className="typewriter" key={key}>
      {displayedText}
    </div>
  );
};

const texts = [
  "Immutable Records",
  "AI-Powered Verification",
  "Blockchain Security",
];

const steps = [
  {
    icon: "📄",
    title: "Upload Document",
    description: "Securely upload your document to our platform.",
  },
  {
    icon: "🔍",
    title: "AI Analysis",
    description: "Our advanced AI analyzes the document for authenticity.",
  },
  {
    icon: "🔗",
    title: "Blockchain Storage",
    description: "Document hash is stored on the blockchain for immutability.",
  },
  {
    icon: "✅",
    title: "Verification Complete",
    description: "Receive instant verification results and certificate.",
  },
];

export default function App() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <ConstellationBackground />
      <header className="header">
        <h1 className="logo">TrustChain</h1>
        <p className="sub-title">
          Secure, tamper-proof document verification using AI and blockchain
          technology.
        </p>
      </header>

      <main className="main-content">
        <section className="hero">
          <a href="#how-it-works" className="get-started-btn">
            Get Started
          </a>
        </section>
        <div className="divider-line"></div>
        <section id="how-it-works" className="how-it-works">
          <h2 className="section-title">How to Get Started</h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} />
            ))}
          </div>
        </section>
        <div className="section-divider"></div>
        <section className="why-choose-us">
          <h2 className="section-title why-choose-us-title">
            Why TrustChain ?
          </h2>
          <Typewriter text={texts[currentText]} key={currentText} />
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 TrustChain. All rights reserved.</p>
      </footer>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");

        :root {
          --text-primary: #e0e0e0;
          --text-secondary: #c0c0c0;
          --accent-color: #4fc3f7;
          --accent-hover: #29b6f6;
          --card-bg: rgba(255, 255, 255, 0.1);
          --divider-color: rgba(255, 255, 255, 0.2);
          --button-dark: #1a73e8;
          --line-color: #4fc3f7;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: "Poppins", sans-serif;
          background-color: #000;
          color: var(--text-primary);
          line-height: 1.6;
        }

        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          z-index: 1;
        }

        .constellation-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
        }

        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          color: var(--text-primary);
        }

        .logo {
          font-size: 72px;
          font-weight: 700;
          color: var(--accent-color);
          margin: 0;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .sub-title {
          font-size: 20px;
          margin-top: 10px;
        }

        .main-content {
          z-index: 1;
          padding-bottom: 100px;
        }

        .hero {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-primary);
        }

        .get-started-btn {
          display: inline-block;
          padding: 10px 20px;
          background-color: var(--button-dark);
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .get-started-btn:hover {
          background-color: #0f5cbf;
        }

        .divider-line {
          height: 4px;
          background-color: var(--line-color);
          margin: 40px 0;
        }

        .how-it-works {
          text-align: center;
          padding: 60px 20px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 30px;
        }

        .steps-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin: 0 auto;
          max-width: 1000px;
          position: relative;
          z-index: 1;
        }

        .step-card {
          background-color: var(--card-bg);
          border-radius: 10px;
          padding: 20px;
          max-width: 300px;
          flex: 1;
          text-align: center;
          transition: transform 0.3s ease, opacity 0.5s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translateY(20px);
        }

        .step-card.animate {
          transform: translateY(0);
          opacity: 1;
        }

        .step-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .step-title {
          font-size: 22px;
          font-weight: 600;
          margin: 10px 0;
        }

        .step-description {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .section-divider {
          height: 4px;
          background-color: var(--line-color);
          margin: 40px 0;
        }

        .why-choose-us {
          text-align: center;
          padding: 60px 20px;
        }

        .why-choose-us-title {
          color: var(--accent-color);
        }

        .typewriter {
          font-size: 24px;
          font-weight: 600;
        }

        .footer {
          background-color: #222;
          color: var(--text-secondary);
          text-align: center;
          padding: 20px;
          position: absolute;
          bottom: 0;
          width: 100%;
        }

        @media (max-width: 768px) {
          .header,
          .hero,
          .how-it-works,
          .why-choose-us {
            padding: 20px;
          }

          .section-title {
            font-size: 28px;
          }

          .step-card {
            max-width: 90%;
          }

          .typewriter {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
