# Project Report — Store Rating Platform

## 1) What the app does
Store Rating Platform is a full-stack role-based app where users can:
- sign up / log in with one auth system
- browse stores
- submit or update a rating from **1 to 5**

The system supports **three roles**:
- **ADMIN**: manage users + stores and view platform totals
- **USER**: browse/search stores and rate them
- **OWNER**: view ratings received for stores owned by them

## 2) Tech stack
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MySQL via Sequelize
- **Auth**: JWT tokens + bcrypt password hashing

## 3) Backend entry point
Backend routes are registered in `backend/server.js`:
- `/api/auth/*`
- `/api/admin/*` (ADMIN only)
- `/api/stores/*` (authenticated users)
- `/api/ratings/*` (authenticated users)
- `/api/owner/*` (OWNER only)

A development note from `server.js`: on startup it calls:
- `sequelize.ensureDatabase()`
- `sequelize.sync({ alter: true })`
- seeders: `seedAdmin()` and `seedStores()`

## 4) Data model
### User (`backend/models/user.js`)
Key fields:
- `name`, `email`, `password`, `address`
- `role` enum: `ADMIN`, `USER`, `OWNER`

### Store (`backend/models/store.js`)
Key fields:
- `name`, `email`, `address`
- `ownerId` connects a store to a `User` with role `OWNER`

### Rating (`backend/models/rating.js`)
Key field:
- `rating` integer **1–5**

Behavioral rule:
- one rating per `(userId, storeId)`
  - implemented via a unique composite index in the Sequelize model
  - server updates instead of creating duplicates

### Relationships (`backend/models/index.js`)
- `User.hasMany(Store, { foreignKey: 'ownerId' })`
- `Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' })`
- `User.hasMany(Rating, { foreignKey: 'userId' })`
- `Store.hasMany(Rating, { foreignKey: 'storeId' })`

## 5) Role-based access (where it’s enforced)
- **Middleware auth**: `backend/middleware/authMiddleware.js`
  - extracts JWT from `Authorization: Bearer <token>`
  - attaches `req.user = { id, role }`

- **Middleware role guard**: `backend/middleware/roleMiddleware.js`
  - rejects requests with 403 if role is not allowed

Routes:
- Admin routes: `backend/routes/adminRoutes.js` uses `authorize('ADMIN')`
- Owner dashboard: `backend/routes/ownerRoutes.js` uses `authorize('OWNER')`
- Rating submission: `backend/routes/ratingRoutes.js` requires `auth`

## 6) Ratings workflow (submit + update)
Rating endpoints are in `backend/routes/ratingRoutes.js`:
- `POST /api/ratings`

Server logic in `backend/controllers/ratingController.js`:
- validates `storeId` and that `rating` is between 1 and 5
- checks if a rating already exists for the same `(userId, storeId)`
  - if exists: updates `existing.rating`
  - if not: creates `Rating.create({ userId, storeId, rating })`

Frontend wiring:
- `frontend/src/components/StoreCard.jsx` shows “Your rating” and renders `RatingForm` when role is USER
- `frontend/src/components/RatingForm.jsx` posts to `/api/ratings`

## 7) Form validations
Backend validation rules are centralized in `backend/utils/validators.js`.
Enforced during signup (`authController.signup`) and password update (`authController.updatePassword`).

Rules:
- **Name**: length **20–60**
- **Address**: max **400** characters
- **Email**: regex validation
- **Password**:
  - length **8–16**
  - contains at least **one uppercase letter**
  - contains at least **one special character**

## 8) Store browsing and “user’s submitted rating”
Store listing is implemented in `backend/controllers/storeController.js` (`getStores`).
The response includes:
- `averageRating`
- `ratingCount`
- `userRating` for the current logged-in user (computed from included rating records)

User UI:
- `frontend/src/pages/UserDashboard.jsx`
  - loads stores using `GET /api/stores`
  - provides search filtering on store `name`, `address`, and `email`

## 9) Dashboards
### Admin dashboard (`frontend/src/pages/AdminDashboard.jsx` + backend `adminController`)
- totals: `GET /api/admin/dashboard`
- listings:
  - `GET /api/admin/users`
  - `GET /api/admin/stores`
  - `GET /api/admin/ratings`
- UI supports filtering and sorting controls for users/stores/ratings

### Owner dashboard (`frontend/src/pages/StoreOwnerDashboard.jsx` + backend `ownerController`)
- `GET /api/owner/dashboard` returns stores filtered by `ownerId = req.user.id`
- each store includes:
  - average rating
  - list of rating entries including user info

## 10) Logout behavior
Frontend logout is handled in `frontend/src/components/Navbar.jsx`:
- clears `localStorage.token` and `localStorage.role`
- navigates back to `/login`


