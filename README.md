# User Authentication System

This project is a full-stack **User Authentication System** built with **React.js**, **Express.js**, and **MongoDB**. It includes the following features:

## Features
### Account Creation
- Users can create an account with email verification via OTP (One-Time Password).
- OTPs are time-limited to enhance security.

### Password Reset
- Users can reset their password securely using an OTP sent to their email.

### Authentication Management
- Cookies are used to securely manage user sessions and tokens.
- Axios is used for seamless communication between the frontend and backend.

### User Interface
- A responsive and intuitive UI created with **React.js** to ensure a smooth user experience.

---

## Tech Stack
- **Frontend:** React.js, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Security:** Cookies for secure session management, OTP time limits

---

## How It Works
### Sign-Up
1. User registers with an email and password.
2. An OTP is sent to the email for verification.
3. Account activation is required for login.

### Forgot Password
1. User requests a password reset by entering their email.
2. An OTP is sent to the email for password reset verification.
3. Users can set a new password upon successful OTP verification.

### Session Management
- Secure cookies are used for managing authentication tokens.
- Axios handles API requests with credentials enabled.

---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
