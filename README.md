# BazarDor — বাজার দর

BazarDor is a responsive web application that helps users explore essential products, compare prices, and view market price changes in one place.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- Sonner Toast Notifications

## Features

1. **Responsive Design:** Browse the application on mobile, tablet, and desktop.
2. **Product Listings:** Explore available products and their prices.
3. **Price Trends:** View products with rising and falling prices.
4. **Category Browsing:** Browse products by category and sort prices.
5. **Product Details:** View product information and market price summaries.
6. **Authentication:** Sign-in and sign-up functionality.
7. **User Profile:** View account information and update your name.
8. **Loading States:** Display loading skeletons while content is loading.
9. **Custom Not Found Page:** Show a friendly page for unavailable routes.
10. **Notifications:** Display success and error messages for supported actions.

## Getting Started

### Prerequisites

- Node.js
- npm
- A configured MongoDB connection for authentication features

### Installation

```bash
npm install
```

### Environment Variables

Configure the environment variables required by the application in `.env.local`. Do not commit secret values.

```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-value
MONGODB_URL=your-mongodb-connection-string
```

Use valid values for your own environment.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

## Project Purpose

BazarDor aims to make essential market-price information easier to explore through product listings, categories, price trends, and individual product details.

## Disclaimer

Displayed prices are indicative and may change depending on market conditions.
