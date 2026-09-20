import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-hero">
            <div className="hero-content">
                <h1 className="hero-title">GiftLink</h1>
                <p className="hero-tagline">
                    Connecting people who have household items to give away
                    with those who prefer to recycle and reuse instead of buying new.
                </p>
                <button className="get-started-btn" onClick={() => navigate('/app/login')}>
                    Get Started
                </button>
            </div>
        </div>
    );
}

export default LandingPage;