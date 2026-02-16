# Invoice Pro - Professional Invoicing & Client Management Tool

A modern, full-stack web application for managing invoices and clients. Built with React, Node.js, Express, and PostgreSQL.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Client Management**: Create, read, update, and delete client profiles
- **Invoice Management**: Full CRUD operations for invoices
- **Dashboard**: Real-time overview of invoices, clients, and financial metrics
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Professional Forms**: Intuitive form interfaces for data entry
- **Status Tracking**: Track invoice status (draft, sent, paid)
- **Secure**: Password hashing with bcryptjs, environment variable management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations and gradients

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

### Tools & Services
- **Git & GitHub** - Version control
- **npm** - Package management

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher)
- **Git**

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Zulhafiz0804/invoicing-tool.git
cd invoicing-tool
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=invoicing_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Database Setup

Open PostgreSQL and run:
```sql
CREATE DATABASE invoicing_db;
\c invoicing_db

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  company_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  company_name VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  client_id INTEGER NOT NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend Server
In a new terminal:
```bash
cd frontend
npm start
```
App opens at `http://localhost:3000`

## 📱 Usage

### 1. Create Account
- Click "Sign up" on the login page
- Enter your name, email, company name, and password
- Click "Create Account"

### 2. Login
- Enter your email and password
- Click "Sign In"

### 3. Add Clients
- Click "➕ Add Client" on the dashboard
- Fill in client details
- Click "Create Client"

### 4. Create Invoices
- Click "➕ Create Invoice" on the dashboard
- Select a client
- Enter invoice details (number, dates, amount)
- Set status (draft, sent, paid)
- Click "Create Invoice"

### 5. Manage Data
- **View Details**: Click on any invoice or client to see full details
- **Edit**: Click "Edit" to modify information
- **Delete**: Click "Delete" to remove (with confirmation)

## 🎨 UI/UX Design

The application features:
- **Modern Blue Gradient Design** - Professional color scheme
- **Smooth Animations** - Page transitions and hover effects
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Intuitive Forms** - Clear labels and helpful hints
- **Status Badges** - Visual indicators for invoice status
- **Card-based Interface** - Easy to scan and interact with

## 📁 Project Structure

```
invoicing-tool/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── clients.js
│   │   └── invoices.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateClient.js
│   │   │   ├── EditClient.js
│   │   │   ├── ViewClient.js
│   │   │   ├── CreateInvoice.js
│   │   │   ├── EditInvoice.js
│   │   │   └── ViewInvoice.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Forms.css
│   │   │   └── Details.css
│   │   ├── App.js
│   │   └── index.css
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Frontend routes protected with token verification
- **Environment Variables**: Sensitive data stored in .env files
- **CORS**: Cross-origin requests properly configured

## 🚀 Future Enhancements

- [ ] PDF invoice generation and download
- [ ] Email invoice sending functionality
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Invoice templates and customization
- [ ] Financial reports and analytics
- [ ] Multi-currency support
- [ ] Tax calculations
- [ ] Recurring invoices
- [ ] Mobile app version
- [ ] Dark mode theme

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Muhammad Zulhafiz**
- GitHub: [@Zulhafiz0804](https://github.com/Zulhafiz0804)
- Email: muhammadzulhafiz11@gmail.com

## 📧 Support

For support, email muhammadzulhafiz11@gmail.com or open an issue on GitHub.

## 🙏 Acknowledgments

- React documentation and community
- Express.js framework
- PostgreSQL database
- All contributors and users

---

**Made with ❤️ by Muhammad Zulhafiz**

Last updated: February 2026