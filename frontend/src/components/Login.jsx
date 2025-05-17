import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import LoginPic from "./LoginPic";
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton, useSignIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginComp = () => {
  const [email, setEmail] = useState("");
  const { signIn, isLoaded } = useSignIn(); // Clerk's signIn hook
  const navigate = useNavigate(); // For manual redirect
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!isLoaded) return; // Ensure Clerk is ready

    try {
      // Authenticate with Clerk
      const result = await signIn.create({
        identifier: email, // User email
        password, // User password
      });

      if (result.status === "complete") {
        navigate("/dashboard"); // Redirect on success
        window.location.reload();
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError("Incorrect email or password");
    }
  };
  return (
    <Container className="login-container">
      <Row className="align-items-center justify-content-center flex-column flex-md-row">
        <Col xs={12} md={6} className="login-pic-container">
          <LoginPic />
        </Col>
        <Col xs={12} md={5}>
          <div className="form-wrapper">
            <h2 className="login-heading">Good to see you again!</h2>
            <Form className="login-form" onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control className="input" type="email" placeholder="username@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control className="input" type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>

              {error && <div className="error-message mb-3">{error}</div>}

              <button className="login-button w-100" variant="primary" type="submit">
                Log In
              </button>
              <div className="button-divider"></div>
            </Form>
            <div className="google-login-but">
              <SignedOut>
                <SignInButton mode='redirect' forceRedirectUrl={'/start'}>
                  <button className="google-login-custom">
                    <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
                    Log In with Google
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <h4 className="register-text">
              Not registered yet?
              <Link to="/signup" className="sign-up-link"> Sign up</Link>
            </h4>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComp;
