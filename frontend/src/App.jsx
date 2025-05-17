import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginComp from './components/Login';
import SignUpComp from './components/SignUp';
import Container from 'react-bootstrap/Container';
import Start from './components/Start';
import AboutComp from './components/About';
import ContactComp from './components/Contact';
import Tickets from "./components/Tickets";
import Welcome from './components/Welcome';
import TicketForm from "./components/TicketForm";
import ProjectSelector from "./components/ProjectSelector";
import Dashboard from './components/Dashboard';

function App() {
  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:8080/api');
    console.log(response.data.testing);
  };

  const [projectId, setProjectId] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshTickets = () => setRefreshFlag(prev => !prev);

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <MainContent 
        projectId={projectId} 
        setProjectId={setProjectId}
        refreshTickets={refreshTickets} 
        refreshFlag={refreshFlag} 
      />
    </Router>
  );
}

// Separated the component to handle Navbar conditionally
function MainContent({ projectId, setProjectId, refreshTickets, refreshFlag }) {
  const [projectType, setProjectType] = useState(''); //joined or created
  const location = useLocation(); // Get current route

  //adding props to Start and Dashboard.jsx
  const DashboardComponent = () => (<Dashboard projectType={projectType} />)
  const StartComponent = () => (<Start projectType={projectType} setProjectType={setProjectType}/>)

  return (
    <>
      {/* Hide Navbar only on the /start route */}
      {location.pathname !== "/start" ? <NavbarComp /> : <CustomHeader />}

      <Container className="mt-4">
        <Routes>
          <Route path="/home" element={
            <div>
              <h1>Ticketing System</h1>
              <ProjectSelector setProjectId={setProjectId} />
              {projectId && (
                <>
                  <TicketForm projectId={projectId} refreshTickets={() => {}} />
                  <Tickets projectId={projectId} />
                </>
              )}
            </div>
          } />
          <Route path="/about" element={<AboutComp />} />
          <Route path="/contact" element={<ContactComp />} />
          <Route path="/signup" element={<SignUpComp />} />
          <Route path="/login" element={<LoginComp />} />
          <Route path="/start" element={<StartComponent />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/" element={<Welcome />} />
        </Routes>
      </Container>
    </>
  );
}

// Custom Header for "/start" route
function CustomHeader() {
  return (
    <header className="custom-header">
      <div className="logo">Risk Management</div>
    </header>
  );
}

export default App;
