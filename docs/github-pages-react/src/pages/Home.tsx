import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Weekly Report App</h1>
            <p>This application allows you to document your weekly work, challenges, and other relevant information.</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/reports">View Reports</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;