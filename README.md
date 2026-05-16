# 🏬 Store Rating Platform

A full-stack role-based Store Rating Platform built using **ReactJS, Node.js, ExpressJS, and MySQL**.  
This system enables users to register, browse stores, submit ratings (1–5), and manage accounts with secure authentication and role-based access control.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based secure login system
- Role-based access control (Admin, User, Store Owner)
- Password encryption using bcrypt

---

### 👨‍💼 Admin Module
- Add, update, and manage users and stores
- View dashboard analytics (users, stores, ratings)
- Filter and sort data efficiently
- Monitor platform activity

---

### 👤 User Module
- User registration and login
- Browse and search available stores
- Submit and update ratings (1–5)
- Update profile and password

---

### 🏪 Store Owner Module
- View users who rated their store
- Check average store rating
- Manage account settings

---

## 🛠️ Tech Stack

### Frontend
- ReactJS
- Axios
- Bootstrap / CSS

### Backend
- Node.js
- ExpressJS
- JWT (JSON Web Token)
- Sequelize ORM

### Database
- MySQL

---

## 📁 Project Architecture
/client → React Frontend
/server → Express Backend
├── controllers
├── models
├── routes
├── middleware
├── config
└── utils


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/store-rating-platform.git
cd store-rating-platform
