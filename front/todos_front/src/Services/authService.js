// src/services/authService.js
import axios from 'axios';

export async function login(credentials) {
  const response = await axios.post('http://localhost:5000/api/login', credentials);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('tokenExpiration', Date.now() + 3600 * 1000); // 1 heure d'expiration
}

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token found');

    const response = await axios.post('http://localhost:5000/api/auth/refresh-token', { refreshToken });
    localStorage.setItem('token', response.data.accessToken); // Remplacez l'ancien accessToken par le nouveau
    return response.data.accessToken;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token', error);
    throw error;
  }
}

export default refreshAccessToken;
