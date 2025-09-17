// API Configuration for CryptoBotX
export const API_CONFIG = {
  // Development (your computer)
  DEV_API_URL: 'http://localhost:3001/api',
  
  // Production (when live)
  PROD_API_URL: import.meta.env.VITE_API_URL || 'https://cryptobotx-backend.onrender.com/api',
  
  // Check if we're in production or development
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Get the right URL to use
  get API_BASE_URL() {
    return this.IS_PRODUCTION ? this.PROD_API_URL : this.DEV_API_URL;
  }
};