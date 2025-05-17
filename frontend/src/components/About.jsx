import React from "react";
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './About.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';


const AboutComp = () => {
  const [confettiActive, setConfettiActive] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setConfettiActive(true);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Confetti Layer */}
      {confettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          onConfettiComplete={() => setConfettiActive(false)}
        />
      )}
  
      {/* Welcome Section */}
      <div className='about-container'> 
        <h1>Welcome to Risk Tracker!</h1>
        <h4>
          We are a team of passionate developers and problem-solvers dedicated to making risk management simple, accessible, and free for everyone.
        </h4>
        <a href="#problem" className="arrow-down-container">
          <div className="arrow-down">↓</div>
        </a>
      </div>
  
      {/* Problem Section */}
      <div className="problem-container" id="problem"> 
        <Container>
          <Row>
            <Col className='left-column'> 
              <h1>Why We Built This Product</h1>
              <h4 className="why-description">
                Existing tools like Jira and Asana offer risk management features, but they are often limited and primarily designed for IT and software development teams.
                <br /><br />
                We aimed to create a universal and free solution that helps anyone track and manage risks efficiently—whether in IT, finance, healthcare, event planning, or personal projects.
              </h4>
            </Col>

            <Col className='right-column'> 
              <img src="/about-people.jpg" alt="Risk Management Illustration" className="column-image" />
            </Col>
          </Row>
        </Container> 
      </div>
  
      {/* Team Section */}
      <div className="team-container"> 
        <Container>
          <h1>Who We Are – The Creators</h1>
          <Row>
            <Col className='column'> 
              <img src="/yana.jpg" alt="Yana" className="column-image" />
              <h1>Yana</h1>
              <h3>Front-End Developer <br /> <br /> Originated the idea for this application and led the UI/UX design and front-end development, ensuring a seamless and intuitive user experience.</h3>
              <a href="https://www.linkedin.com/in/yana-sivakova/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                Yana's LinkedIn
              </a>
            </Col>
            <Col className='column'> 
              <img src="/siam.jpg" alt="Siam" className="column-image" />
              <h1>Siam</h1>
              <h3>Siam Bio</h3>
              <a href="https://www.linkedin.com/in/siam-hossain-884879216/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                Siam's LinkedIn
              </a>
            </Col>
            <Col className='column'> 
              <img src="/nathanael.jpg" alt="Nathanael" className="column-image" />   
              <h1>Nathanael</h1>
              <h3>Nathanael Bio</h3>
              <a href="https://www.linkedin.com/in/nathanael-james-6b7455277/" target="_blank" rel="noopener noreferrer" className="linkedin-link">
                Nathanael's LinkedIn
              </a>
            </Col>
          </Row>
        </Container> 
      </div>
  
      {/* Vision Section */}
      <div className="vision_container"> 
        <h1>Our Vision and Future Goals</h1>
        <h4>
        We believe that efficient risk management is the key to project success. Our vision is to empower teams and individuals with a tool that allows them to proactively handle risks, minimize delays, and enhance productivity.
        <br /> <br />
            We are committed to continuously improving this platform by:
            <br /><br />
            ✔️ Expanding industry-specific risk templates.
            <br />
            ✔️ Enhancing AI-driven risk prioritization.
            <br />
            ✔️ Introducing advanced analytics and reporting.
            <br />
            ✔️ Keeping the platform completely free for everyone.
            <br /> <br />

          Join us in revolutionizing risk management and making it accessible to everyone, everywhere!
        </h4>
      </div>
    </>
  );
  
}

export default AboutComp;
