import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import '../styles/Login.css'; 

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/users/login', { username, password }, { withCredentials: true });
      if (response.status === 200) {
        setSuccessMessage('Successful login');
        setError(null); 
        setIsLoggedIn(true); 
        
        setTimeout(() => {
          history.push('/');
        }, 2000);
      } else {
        setError('Error logging in. Please try again.');
      }
    } catch (err) {
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
