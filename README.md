# E-Shop Angular Frontend

A modern e-commerce frontend built with Angular 19, featuring a responsive design and comprehensive shopping functionality.

## Features

- 🛍️ **Product Catalog**: Browse products by category with filtering
- 🔍 **Product Search**: Search functionality for finding products
- 🛒 **Shopping Cart**: Add, remove, and update cart items
- 👤 **User Authentication**: Login and registration system
- 💳 **Checkout Process**: Complete order placement with shipping details
- 📱 **Responsive Design**: Mobile-friendly interface using Bootstrap
- 🎨 **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **Frontend Framework**: Angular 19
- **UI Framework**: Bootstrap 5.3.3
- **Icons**: Bootstrap Icons
- **HTTP Client**: Angular HttpClient with RxJS
- **Routing**: Angular Router
- **State Management**: RxJS BehaviorSubject

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── cart/           # Shopping cart functionality
│   │   ├── checkout/       # Checkout process
│   │   ├── home/           # Home page
│   │   ├── main/           # Main product display
│   │   ├── navbar/         # Navigation bar
│   │   ├── footer/         # Footer component
│   │   └── productdetails/ # Product detail pages
│   ├── directives/         # Custom directives
│   ├── models/            # TypeScript interfaces
│   └── service/           # API services
├── environments/          # Environment configuration
└── assets/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd EcommerceAngular
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## API Configuration

The application connects to a Node.js backend API. Make sure your backend server is running on `http://localhost:5000` or update the `baseUrl` in the environment files:

- `src/environments/environment.ts` (production)
- `src/environments/environment.development.ts` (development)

## Key Components

### Authentication

- **Login Component**: User login with email/password
- **Register Component**: New user registration
- **Auth Service**: Handles authentication state and API calls

### Shopping Cart

- **Cart Component**: Display and manage cart items
- **Cart Service**: Cart state management and API integration
- **Add to Cart**: Product quantity selection and cart updates

### Product Management

- **Main Component**: Product grid with filtering
- **Product Details**: Individual product information
- **Category Filtering**: Filter products by category

### Checkout

- **Checkout Component**: Order placement with shipping details
- **Order Summary**: Review cart items and total
- **Payment Integration**: Multiple payment method options

## Services

### ApiService

Central service for all HTTP requests to the backend API:

- Authentication (login, register, user info)
- Products (get all, get by ID, search, filter by category)
- Cart operations (add, update, remove, clear)
- Orders (create, get user orders)

### AuthService

Manages user authentication state:

- Current user information
- Login/logout functionality
- Token management
- Role-based access control

### CartService

Handles shopping cart functionality:

- Cart state management
- Add/remove/update items
- Cart total calculations
- Real-time cart updates

## Styling

The application uses Bootstrap 5 for responsive design with custom CSS enhancements:

- Product card hover effects
- Loading spinners
- Form validation styles
- Responsive grid layouts

## Development

### Code Style

- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Add loading states for better UX

### Testing

```bash
npm test
```

### Linting

```bash
ng lint
```

## Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the `dist/day2` folder to your web server

3. Configure your server to handle Angular routing (use HashLocationStrategy or configure server-side routing)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
