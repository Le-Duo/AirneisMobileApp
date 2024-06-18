# Airneis Mobile App

This app is built using React Native and Expo, and it leverages various modern libraries and tools to provide a seamless user experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- User Authentication (Sign In, Sign Up, Password Reset)
- Product Browsing and Search
- Product Filtering by Categories, Materials, and Price Range
- Shopping Cart Management
- Order Placement and Order History
- Profile Management
- Theme Settings (Light/Dark Mode)
- Integration with RESTful APIs using Axios and React Query

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Le-Duo/AirneisMobileApp.git
   cd AirneisMobileApp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://airneisservices.onrender.com/ or EXPO_PUBLIC_API_BASE_URL=<your-api-url>
   ```

4. **Run the application:**
   ```sh
   npm start
   ```

## Usage

- **Start the development server:**
  ```sh
  npm start
  ```

- **Run on Android:**
  ```sh
  npm run android
  ```

- **Run on Web:**
  ```sh
  npm run web
  ```

## Project Structure

```plaintext
AirneisMobileApp/
├── android/                    # Android configuration
├── assets/                     # Static assets (images, icons, etc.)
├── src/                        # Source code
│   ├── components/             # Reusable components
│   ├── context/                # Context providers
│   ├── data/                   # Static data (e.g., countries list)
│   ├── hooks/                  # Custom hooks for API calls
│   ├── pages/                  # Application pages/screens
│   ├── types/                  # TypeScript types and interfaces
│   ├── apiClient.ts            # API client for making requests to the backend
│   ├── utils.ts                # Utility functions
│   ├── Store.tsx               # Zustand store for state management
│   └── styles.ts               # Styling and theming
├── .env                        # Environment variables
├── App.tsx                     # Entry point of the application
├── app.json                    # Expo configuration
├── eas.json                    # Expo Application Services configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project documentation
```