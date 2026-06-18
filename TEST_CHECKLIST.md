# Manual Test Checklist

## Setup verification
- [ ] Backend starts successfully (`node backend/server.js` or `npm start` in `backend/`)
- [ ] MySQL is reachable and schema sync/seeders run on startup (see `backend/server.js`)
- [ ] Frontend starts successfully (Vite)
- [ ] `.env` contains `JWT_SECRET` and MySQL connection variables used by `backend/config/db.js`


## Auth & roles
1. **Signup (Normal User)**
   - [ ] Create user with valid Name (20–60 chars)
   - [ ] Create user with valid Email format
   - [ ] Create user with valid Password (8–16, includes uppercase + special char)
   - [ ] Attempt signup with invalid password -> validation error returned
2. **Login**
   - [ ] Login as USER -> redirected to `/user`
   - [ ] Login as ADMIN -> redirected to `/admin`
   - [ ] Login as OWNER -> redirected to `/owner`
3. **Logout**
   - [ ] Logout button clears token/role and redirects to `/login`

## Store & rating (Normal User)
1. **View stores**
   - [ ] Normal user can load store list
   - [ ] Each store card shows:
     - [ ] Store Name
     - [ ] Address
     - [ ] Overall Rating
     - [ ] Your Submitted Rating (if previously rated)
     - [ ] Submit/Update rating control
2. **Search stores**
   - [ ] Search by Name finds expected stores
   - [ ] Search by Address finds expected stores
3. **Submit rating**
   - [ ] Submit rating=1..5
   - [ ] Repeat submit for same store updates existing rating
   - [ ] Attempt submit without login -> blocked

## Admin module
1. **Dashboard totals**
   - [ ] Admin dashboard shows total users/stores/ratings
2. **Create user**
   - [ ] Admin can create USER/ADMIN/OWNER roles
   - [ ] Invalid fields produce expected validation errors
3. **Create store**
   - [ ] Admin can create a store tied to OWNER (ownerId)
4. **Listings filtering/sorting**
   - [ ] Admin can filter by Name/Email/Address/Role
   - [ ] Admin can sort stores and users ascending/descending

## Store owner module
1. **Owner dashboard**
   - [ ] Owner sees only stores assigned to them
   - [ ] Owner dashboard shows average rating
   - [ ] Owner dashboard lists users who submitted ratings

## Password update
- [ ] User updates password using currentPassword + valid newPassword
- [ ] Invalid newPassword (violates rules) is rejected
- [ ] Wrong currentPassword is rejected

