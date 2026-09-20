import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './RegisterPage.css';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showErr, setShowErr] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setShowErr('');

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            const json = await response.json();

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('email', json.email);
                sessionStorage.setItem('name', firstName);
                navigate('/app');
            } else if (json.error) {
                setShowErr(json.error);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setShowErr("Failed to connect to server. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register</h2>
                
                {showErr && <div className="alert alert-danger">{showErr}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            placeholder="Enter first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            placeholder="Enter last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="register-btn">
                        Register
                    </button>
                </form>

                <div className="login-link-container">
                    <span>Already a member? </span>
                    <Link to="/app/login" className="login-link">
                        Login Here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;