import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      <div className="welcome-container text-center">
        <h1 className="mb-3">Welcome to the Risk Tracker!</h1>
        <p className="mb-4">Please log in or sign up to get started</p>
        <div className="d-flex justify-content-center gap-3">
          <Button className="custom-btn" onClick={() => navigate('/login')}>Log In</Button>
          <Button className="custom-btn" variant="outline-primary" onClick={() => navigate('/signup')}>Sign Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
