# Banking Application - Full Stack Banking Solution

A modern, full-stack banking application built with Spring Boot 4, Java 25, and React 19. This application provides a seamless experience for managing multiple currency accounts, performing fund transfers, and real-time currency conversion.

## 🚀 Features

- **User Authentication**: Secure Login and Registration using JWT (JSON Web Tokens).
- **Multi-Currency Accounts**: Create accounts in various currencies (USD, EUR, GBP, JPY, NGN, INR).
- **Fund Transfers**: Transfer money securely between accounts with instant balance updates.
- **Currency Conversion**: Convert balances between different currencies using real-time exchange rates.
- **Transaction History**: Comprehensive view of all incoming and outgoing transactions.
- **Dynamic Dashboard**: Personalized dashboard showing recent activity and account balances.
- **Modern UI**: Sleek, responsive design built with Tailwind CSS and Lucide icons.

## 🛠 Tech Stack

### Backend
- **Language**: Java 
- **Framework**: Spring Boot 
- **Security**: Spring Security with JWT
- **Persistence**: Spring Data JPA
- **Database**: MySQL
- **Utilities**: Lombok

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router 
- **Icons**: Lucide React
- **API Client**: Axios

## 📂 Project Structure

```text
.
├── backend/                # Spring Boot application
│   └── bankapp/
│       ├── src/main/java/  # Java source code
│       └── src/main/resources/
│           └── application.properties # Database & API configuration
├── frontend/               # React application
│   ├── src/                # React source code
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Application views (Dashboard, Accounts, etc.)
│   │   └── services/       # API integration
│   └── tailwind.config.js  # Styling configuration
└── README.md               # Project documentation
```

## ⚙️ Setup & Installation

### Prerequisites
- JDK 25
- Node.js & npm
- MySQL Server

### Database Setup
1. Create a MySQL database named `bank_db`.
2. Update `backend/bankapp/src/main/resources/application.properties` with your database credentials if they differ from:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/bankapp
   ```
2. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080` with context path `/api/v1`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 🔒 Environment Variables
The application uses the following environment variables (can be set in `application.properties`):
- `CURRENCY_API_KEY`: API key for real-time exchange rates (defaults to a live key provided).
- `jwtSecret`: Secret key for JWT generation.

