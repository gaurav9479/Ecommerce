# Glipkart - Full Stack E-commerce Application

Glipkart is a robust, full-featured e-commerce platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). It offers a seamless shopping experience with features like user authentication, product search & filtering, shopping cart, wishlist, secure payments via Stripe, and a comprehensive admin dashboard.

## Key Features

### User Features
*   **Authentication**: Secure Sign Up and Login using JWT.
*   **Product Browsing**:
    *   Search products by name.
    *   Filter by category, price range, and ratings.
    *   Sort by price and new arrivals.
*   **Shopping Experience**:
    *   **Cart**: Add, remove, and update quantities.
    *   **Wishlist**: Save favorite items for later.
    *   **Product Details**: View detailed info, images, and reviews.
*   **Checkout & Payment**:
    *   Secure checkout process.
    *   Payment integration with **Stripe**.
    *   Order history and tracking.
*   **Theming**: Choose from 5 distinct themes (Classic, Dark, Ocean, Sunset, Forest) to personalize the look and feel.

### Admin Features
*   **Dashboard**: Overview of sales, orders, and user stats.
*   **Product Management**: Create, update, and delete products.
*   **Order Management**: View and update order statuses (Processing, Shipped, Delivered).

## Tech Stack

### Frontend
*   **React** (Vite): Fast and modern UI library.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **React Router**: For client-side routing.
*   **Context API**: State management for Auth, Cart, Wishlist, and Theme.
*   **Axios**: For API requests.
*   **Stripe.js**: For handling payments.

### Backend
*   **Node.js & Express**: Scalable server-side runtime and framework.
*   **MongoDB & Mongoose**: NoSQL database for flexible data storage.
*   **JWT (JSON Web Tokens)**: Secure user authentication.
*   **Cloudinary**: For image storage and management.
*   **Stripe API**: Secure payment processing.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Stripe Account
*   Cloudinary Account

### 1. Clone the Repository
```bash
git clone <repository_url>
cd ecommerce
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=9000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
email_user=your_email_for_nodemalier
email_pass=your_email_password
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:9000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

## Project Structure

```
ecommerce/
├── backend/            # Express/Node.js Server
│   ├── src/
│   │   ├── controllers/# Route Logic
│   │   ├── models/     # Mongoose Models
│   │   ├── routes/     # API Routes
│   │   ├── middlewares/# Auth & Upload Middlewares
│   │   ├── utils/      # Helper functions
│   │   └── server.js   # Entry point
│   └── package.json
│
└── frontend/           # React Application
    ├── src/
    │   ├── component/  # Reusable Components
    │   ├── Context/    # React Context (Auth, Cart, Theme, etc.)
    │   ├── Pages/      # Application Pages (Home, Shop, Cart, etc.)
    │   └── main.jsx    # Entry point
    └── package.json
```

## Themes
Users can switch themes by clicking the theme icon in the navbar. The available themes are:
- **Classic**: Purple/Pink Gradient
- **Dark**: Slate/Midnight
- **Ocean**: Blue/Cyan
- **Sunset**: Orange/Red
- **Forest**: Green/Emerald

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.
