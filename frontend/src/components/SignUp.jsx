import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SignUpPic from './SignUpPic'; 
import './SignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useSignUp } from "@clerk/clerk-react";
import { useState } from 'react';

function SignUpComp() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setconfirm] = React.useState('');
  const [verified, setVerified] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const nav = useNavigate();

  const { signUp, isLoaded } = useSignUp();

  if (!isLoaded) return null; // Ensure Clerk is ready

  const handleSignUp = async(e) => {
    
    e.preventDefault();
    setVerified(false);
    setError('');

    if (!isLoaded) return;

    alert('A verification link has been sent to your email. Please check your inbox. Press ok before clicking link')

    // Check if passwords match
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setVerifying(true);

    try {
      // Create sign-up session with email & password
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      // Get current site domain for redirect
      const protocol = window.location.protocol;
      const host = window.location.host;

      const { startEmailLinkFlow } = signUp.createEmailLinkFlow();
      // Send email link verification
      const signUpAttempt = await startEmailLinkFlow({
        redirectUrl: `${protocol}//${host}/start`,
        
      });
      
      

      const verification = signUpAttempt.verifications.emailAddress;

      if (verification.verifiedFromTheSameClient()) {
        setVerifying(false);
        setVerified(true);
      } else {
        setMessage('A verification link has been sent to your email. Please check your inbox.');
      }
      console.log('all done');
      nav('/start');
      window.location.reload();
    } catch (err) {
      console.error('Sign-up error:', err.errors);
      setError(err.errors?.[0]?.longMessage || 'Sign-up failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  async function reset(e) {
    e.preventDefault();
    setVerifying(false);
  }

  return (
    <Container className="signup-container">
      <Row className="align-items-center justify-content-center flex-column flex-md-row">
        {/* Left Side - Image */}
        <Col xs={12} md={6} className="signup-pic-container">
          <SignUpPic />
        </Col>
  
        {/* Right Side - Form */}
        <Col xs={12} md={5}>
          <div className="form-wrapper">
            <h2 className="signup-heading">Let's mitigate risks together!</h2>
            <Form className="signup-form" onSubmit={handleSignUp}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  className="input"
                  type="email"
                  placeholder="username@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && <p className="error-text">{error.email}</p>}
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  className="input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error.password && <p className="error-text">{error.password}</p>}
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Repeat Password</Form.Label>
                <Form.Control
                  className="input"
                  type="password"
                  placeholder="Repeat Password"
                  value={confirm}
                  onChange={(e) => setconfirm(e.target.value)}
                />
                {error.confirm && <p className="error-text">{error.confirm}</p>}
              </Form.Group>
  
              {/* Message after sending verification email */}
              {message && <p className="success-text">{message}</p>}
      
              <button className="signup-button w-100" type="submit">
                Sign Up
              </button>
              <div className="button-divider"></div>
            </Form>
  
            <div className="google-signup-but">
              <SignedOut>
                <button className="google-signup-custom" onClick={() => document.querySelector(".clerk-signin").click()}>
                  <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
                  Sign Up with Google
                </button>
                <SignInButton className="clerk-signin" style={{ display: "none" }} />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
  
            <h4 className="register-text">
              Already have an account? 
              <Link to="/login" className="login-link"> Log In</Link>
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  );  
};

export default SignUpComp;