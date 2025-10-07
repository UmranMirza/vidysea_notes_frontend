# # Next.js Frontend Implementation Guide for Vidysea Notes App

This guide will help you build a mobile-responsive Next.js frontend for the Vidysea Notes backend, including authentication, CRUD operations, and role-based dashboards.

---

## 1. Project Setup

1. **Create Next.js App**
    ```bash
    npx create-next-app@latest notes-frontend
    cd notes-frontend
    ```

2. **Install Dependencies**
    ```bash
    npm install axios react-hook-form @mui/material @emotion/react @emotion/styled
    ```
    *(You may use Tailwind CSS or Chakra UI instead of Material UI if preferred.)*

---

## 2. Folder Structure

```
/components
  /auth
    LoginForm.js
    SignupForm.js
  /notes
    NoteList.js
    NoteForm.js
    NoteItem.js
  /dashboard
    UserDashboard.js
    AdminDashboard.js
/pages
  /auth
    login.js
    signup.js
  /dashboard
    user.js
    admin.js
  index.js
/utils
  api.js
  auth.js
```

---

## 3. API Integration

- **Create `/utils/api.js` for Axios instance:**
    ```javascript
    import axios from 'axios';

    const api = axios.create({
      baseURL: 'https://vidysea-notes-backend.onrender.com/', 
    });

    api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    export default api;
    ```

---

## 4. Authentication (Login & Signup)

- **Signup Page**
  - Form: name, email, password, role (user/admin)
  - On success, redirect to login.

- **Login Page**
  - Form: email, password
  - On success, store JWT in `localStorage` and redirect to dashboard based on role.

- **Route Protection**
  - Use a custom hook (`/utils/auth.js`) to check token and role, redirect if not authenticated.

---

## 5. Dashboard (Role-Based)

- **User Dashboard**
  - Fetch notes: `GET /notes/`
  - Display notes in a responsive table/list.
  - Add Note: `POST /notes/create`
  - Edit Note: `PUT /notes/edit/{note_id}`
  - Delete Note: `DELETE /notes/delete/{note_id}`
  - Pagination, search, and sort by title/newest/oldest.

- **Admin Dashboard**
  - Fetch all notes: `GET /notes/all`
  - Create note for any user: `POST /notes/admin/create`
  - Edit any note: `PUT /notes/admin/edit/{note_id}`
  - Delete any note: `DELETE /notes/admin/delete/{note_id}`
  - Pagination, search, and sort.

---

## 6. CRUD UI Components

- **NoteList**: Displays notes with pagination, search, and sort controls.
- **NoteForm**: For creating/editing notes.
- **NoteItem**: Individual note with edit/delete buttons.

---

## 7. Mobile Responsive UI

- Use Material UI’s Grid, Card, and Table components.
- Add breakpoints for mobile screens.
- Use Drawer or AppBar for navigation.

---

## 8. Routing & Navigation

- Use Next.js `useRouter` for navigation.
- Redirect users after login based on role.
- Protect dashboard routes using a custom hook.

---

## Summary

- Implement authentication and role-based dashboards.
- Integrate all CRUD APIs with pagination, search, and sorting.
- Use Material UI for mobile responsiveness.
- Protect routes and handle errors gracefully.

---

**For code samples or specific UI implementation, ask for the component you need!**