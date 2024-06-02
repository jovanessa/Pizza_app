import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import '../styles/Register.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/users/register', { username, password }, { withCredentials: true });
      if (response.status === 201) {
        setSuccessMessage('User registered successfully');
        setError(null); 
        
        setTimeout(() => {
          setSuccessMessage('');
          history.push('/login');
        }, 5000);
      } else {
        setError('Error registering user. Please try again.');
      }
    } catch (err) {
      setError('Error registering user. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
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
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
