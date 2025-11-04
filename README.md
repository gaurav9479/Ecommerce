# Ecommerce
# Ecommerce
 
## Project Blueprint

### Overview
Full‑stack ecommerce application with a Node.js/Express/MongoDB backend and a React (Vite) frontend. Includes user auth, admin product management with image upload, and product listing.

### Backend (Node.js + Express + MongoDB)
- **Entry Points**
  - `src/server.js`: Loads env, connects DB, starts server on `process.env.PORT || 9000`.
  - `src/app.js`: Express app setup (CORS, JSON parsers, static, cookies), mounts routes.
- **Config**
  - `src/constants.js`: `DB_NAME` constant.
  - `src/db/index.js`: Mongoose connection using `process.env.MONGODB_URL` and `DB_NAME`.
- **Models**
  - `src/models/user.model.js`: User schema with bcrypt hashing, JWT helpers, admin flag, refreshToken.
  - `src/models/product.model.js`: Product schema (title, price, description, category, image[]).
  - `src/models/{cart,order,review,catergory}.model.js`: Placeholders for future features.
- **Controllers**
  - `src/controllers/user.controller.js`: Register, login, logout, refresh access token, change password.
  - `src/controllers/admin.controller.js`: Admin login; `addProduct` with Cloudinary upload; `getAllProducts`.
- **Routes**
  - `src/routes/user.routes.js`
    - POST `/api/v1/users/register`
    - POST `/api/v1/users/login`
    - POST `/api/v1/users/logout` (protected)
  - `src/routes/admin.routes.js`
    - POST `/api/v1/admin/login`
    - POST `/api/v1/admin/ADD-products`
    - GET `/api/v1/admin/products`
  - Public products: GET `/api/v1/products` (mounted in `app.js`).
- **Middleware**
  - `src/middlewares/auth.middleware.js`: `verifyJWT` from cookies or Authorization header.
  - `src/middlewares/multer.middleware.js`: Handles multipart uploads for product images.
- **Utils**
  - `src/utils/{ApiError,ApiResponse,asyncHandler}.js`: Error/response helpers and async wrapper.
  - `src/utils/cloudinary.js`: Upload to Cloudinary.
  - `src/seedproduct.js`: Seed script (optional).

### Frontend (React + Vite + Tailwind)
- **Entry & Routing**
  - `src/main.jsx`: Mounts app with `AuthProvider`, `UserProvider`, `react-hot-toast`.
  - `src/App.jsx`: Router with public (`/`, `login`, `register`) and admin (`/admin/*`) routes.
- **Context**
  - `src/Context/AuthContext.jsx`: Auth state (`user`, `setUser`).
  - `src/Context/User.Context.jsx`: Additional user-scoped state (extensible).
- **Pages**
  - `src/Pages/Login.jsx`: User login UI.
  - `src/Pages/Register.jsx`: User registration UI.
- **Layout & Components**
  - `src/component/Applayout/Applayout.jsx`: Shell layout for public routes.
  - `src/component/Home.jsx`: Landing page with slider and product grid.
  - `src/component/{Navbar,Footer,Swiper}.jsx`: Site chrome and slider.
  - `src/component/Products/{Productlist,ProductCard}.jsx`: Fetch and display products from API.
- **Admin**
  - `src/Admin/adminlayout.jsx`: Admin layout with nested routes.
  - `src/Admin/adminNav.jsx`: Admin navigation bar.
  - `src/Admin/AdminDashboard.jsx`: Admin dashboard (placeholder).
  - `src/Admin/AdminProductForm.jsx`: Add product form (title, price, description, category, images).
- **Services**
  - `src/axios.service/authService.js`: Axios helpers for auth (extendable).

### Data Flow
- **Auth**
  - User/Admin login → JWT access/refresh tokens generated → set as HTTP‑only cookies.
  - Protected endpoints use `verifyJWT` to validate tokens.
- **Products**
  - Admin uploads product via `AdminProductForm` → POST `/api/v1/admin/ADD-products` with images.
  - Images uploaded to Cloudinary → URLs stored in MongoDB.
  - Public product listing via GET `/api/v1/products` → rendered in `Productlist` and `ProductCard`.

### API Summary
- Public:
  - GET `/api/v1/products` → List all products.
- Users:
  - POST `/api/v1/users/register`
  - POST `/api/v1/users/login`
  - POST `/api/v1/users/logout` (auth)
- Admin:
  - POST `/api/v1/admin/login`
  - POST `/api/v1/admin/ADD-products` (multipart images)
  - GET `/api/v1/admin/products`

### Current Capabilities
- User and admin auth with JWT, secure cookies.
- Add products with multiple images (Cloudinary) and list products publicly.
- React UI with Tailwind and toast notifications.

### Roadmap Ideas
- Cart, orders, payments integration.
- Reviews/ratings, categories, filters, search.
- Admin analytics dashboard, inventory management.

## Key Auth & Platform Strategy

- ✅ **Dual-token auth (access + refresh)**: Short-lived access tokens and longer-lived refresh tokens; refresh flow provided, tokens rotated and stored server-side for revocation.
- ✅ **Role-based structure (user, retailer, admin)**: Controllers and routes structured to support multiple roles; guards can be extended to enforce role checks.
- ✅ **Soft delete & restore system**: Designed to support soft deletions via flags/timestamps to allow safe restore without data loss.
- ✅ **Email + phone login**: User model and controllers support both email and phone credentials for flexible authentication flows.
- ✅ **Cookie-secured JWTs**: Tokens issued in HTTP-only cookies to reduce XSS exposure; headers supported for service-to-service.
- ✅ **Modular async error/response management**: Centralized `ApiError`, `ApiResponse`, and `asyncHandler` utilities for predictable error and response handling.
- ✅ **Ready for future OTP verification & retailer dashboard**: OTP controller/model scaffolding and admin/retailer layout prepared for future feature expansion.
