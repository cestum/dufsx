/**
 * Sample JavaScript file for testing syntax highlighting
 * This file demonstrates various JavaScript syntax elements
 */

// Import statements
import { useState, useEffect } from 'react';
import axios from 'axios';

// Constants and variables
const API_BASE_URL = 'https://api.example.com';
let currentUser = null;
var globalConfig = {
  theme: 'dark',
  language: 'en',
  apiTimeout: 5000
};

// Class definition
class UserManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.cache = new Map();
  }

  // Async method with try-catch
  async fetchUser(userId) {
    try {
      const response = await axios.get(`${this.apiUrl}/users/${userId}`);
      this.cache.set(userId, response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error.message);
      throw new Error(`User ${userId} not found`);
    }
  }

  // Method with destructuring
  updateUserProfile({ name, email, age }) {
    const user = this.cache.get(currentUser?.id);
    if (!user) {
      throw new Error('User not found in cache');
    }
    
    return {
      ...user,
      name: name || user.name,
      email: email || user.email,
      age: age !== undefined ? age : user.age,
      updatedAt: new Date().toISOString()
    };
  }
}

// Arrow functions
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  return today.getFullYear() - birth.getFullYear();
};

const processUsers = (users) => users
  .filter(user => user.active)
  .map(user => ({
    ...user,
    age: calculateAge(user.birthDate),
    displayName: `${user.firstName} ${user.lastName}`
  }))
  .sort((a, b) => a.age - b.age);

// Template literals with expressions
const createWelcomeMessage = (user) => {
  const timeOfDay = new Date().getHours() < 12 ? 'morning' : 'evening';
  return `Good ${timeOfDay}, ${user.name}! 
    Welcome back to our platform.
    You have ${user.notifications?.length || 0} new notifications.`;
};

// Regular expressions
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s-()]+$/;

// Control flow statements
function validateUserInput(userData) {
  if (!userData) {
    return { valid: false, errors: ['User data is required'] };
  }

  const errors = [];

  // Switch statement
  switch (userData.type) {
    case 'admin':
      if (!userData.permissions) {
        errors.push('Admin users must have permissions');
      }
      break;
    case 'regular':
      if (userData.permissions?.length > 5) {
        errors.push('Regular users cannot have more than 5 permissions');
      }
      break;
    default:
      errors.push('Invalid user type');
  }

  // For loops and conditionals
  for (const field of ['name', 'email']) {
    if (!userData[field] || userData[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  }

  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push('Invalid email format');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}

// Promises and async/await
const fetchUserData = async (userId) => {
  const userManager = new UserManager(API_BASE_URL);
  
  try {
    const user = await userManager.fetchUser(userId);
    const validationResult = validateUserInput(user);
    
    if (!validationResult.valid) {
      throw new Error(`Invalid user data: ${validationResult.errors.join(', ')}`);
    }

    return {
      ...user,
      welcomeMessage: createWelcomeMessage(user),
      isValid: true
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      error: error.message,
      isValid: false
    };
  }
};

// Event handling and DOM manipulation
document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('user-form');
  const userList = document.getElementById('user-list');

  // Event listener with arrow function
  userForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    
    try {
      const result = await fetchUserData(userData.userId);
      if (result.isValid) {
        displayUser(result, userList);
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError('Failed to process user data');
    }
  });
});

// Higher-order functions
const createLogger = (prefix) => (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${prefix}: ${message}`);
};

const logger = createLogger('UserManager');

// Export statements
export { UserManager, validateUserInput, fetchUserData };
export default calculateAge;

/* 
 * Multi-line comment block
 * This file demonstrates various JavaScript features:
 * - ES6+ syntax (classes, arrow functions, destructuring)
 * - Async/await and Promises
 * - Template literals
 * - Regular expressions
 * - Error handling
 * - DOM manipulation
 * - Higher-order functions
 * - Import/export statements
 */