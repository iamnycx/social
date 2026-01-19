# Social Network

A full-stack social media application built with React and Django, featuring user authentication, post creation, image uploads, and interactive feeds with like/dislike functionality.

## Features

-   **User Authentication**: JWT-based authentication with registration and login
-   **Post Management**: Create posts with captions and images
-   **Interactive Feed**: Browse posts from all users with pagination
-   **User Profiles**: View user details and their posts
-   **Like/Dislike System**: Users can like or dislike posts
-   **Image Uploads**: Support for post images and user avatars
-   **Responsive Design**: Mobile-friendly UI with dark/light theme support
-   **Real-time Updates**: Dynamic post interactions

## Tech Stack

### Frontend

-   **React 19** - Modern React with hooks and concurrent features
-   **TypeScript** - Type-safe JavaScript
-   **Vite** - Fast build tool and development server
-   **Tailwind CSS** - Utility-first CSS framework
-   **Radix UI** - Accessible component primitives
-   **React Router** - Client-side routing
-   **Axios** - HTTP client for API requests
-   **Lucide React** - Beautiful icons
-   **Motion** - Animation library
-   **Next Themes** - Theme management

### Backend

-   **Django 5.0+** - High-level Python web framework
-   **Django REST Framework** - Powerful API toolkit
-   **PostgreSQL** - Robust relational database
-   **JWT Authentication** - Secure token-based auth
-   **Djoser** - REST implementation of Django auth
-   **CORS Headers** - Cross-origin resource sharing
-   **Pillow** - Image processing library

### DevOps & Tools

-   **Docker** - Containerization for database
-   **Docker Compose** - Multi-container orchestration
-   **ESLint** - Code linting
-   **Pytest** - Testing framework
-   **Python-dotenv** - Environment variable management

## Prerequisites

Before running this application, make sure you have the following installed:

-   **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
-   **Python** (v3.8 or higher) - [Download here](https://python.org/)
-   **PostgreSQL** (v13 or higher) - [Download here](https://postgresql.org/)
-   **Docker** (optional, for database container) - [Download here](https://docker.com/)

## 🏃‍♂️ Running Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-network
```

### 2. Backend Setup

#### Option A: Using Docker (Recommended)

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Start PostgreSQL with Docker Compose:

    ```bash
    docker-compose up -d
    ```

3. Create and activate a virtual environment:

    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```

4. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5. Copy environment file:

    ```bash
    cp .env.local .env
    ```

6. Run database migrations:

    ```bash
    python manage.py migrate
    ```

7. Start the Django development server:
    ```bash
    python manage.py runserver
    ```

The backend will be available at `http://localhost:8000`

#### Option B: Using Local PostgreSQL

If you prefer to use a local PostgreSQL installation instead of Docker:

1. Create a PostgreSQL database
2. Update the `.env` file with your database credentials
3. Follow steps 3-7 from Option A above

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:

    ```bash
    cd client
    ```

2. Install Node.js dependencies:

    ```bash
    npm install
    ```

3. Start the Vite development server:
    ```bash
    npm run dev
    ```

The frontend will be available at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to start using the social network application.

## Available Scripts

### Frontend Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

### Backend Scripts

-   `python manage.py runserver` - Start Django development server
-   `python manage.py migrate` - Run database migrations
-   `python manage.py createsuperuser` - Create admin user
-   `python manage.py test` - Run tests

## Project Structure

```
social-network/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── feed/     # Feed components
│   │   │   ├── profile/  # Profile components
│   │   │   ├── ui/       # Reusable UI components
│   │   │   └── common/   # Shared components
│   │   ├── lib/          # Utilities and configurations
│   │   ├── types/        # TypeScript type definitions
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
├── server/                # Django backend
│   ├── apps/
│   │   ├── posts/        # Posts app
│   │   └── users/        # Users app
│   ├── config/           # Django project settings
│   ├── media/            # User uploaded files
│   ├── requirements.txt
│   ├── docker-compose.yaml
│   └── manage.py
└── README.md
```

## API Endpoints

### Authentication

-   `POST /auth/users/` - User registration
-   `POST /auth/jwt/create/` - User login
-   `POST /auth/jwt/refresh/` - Refresh access token
-   `GET /auth/users/me/` - Get current user info

### Posts

-   `GET /api/posts/` - List posts (paginated)
-   `POST /api/posts/` - Create new post
-   `GET /api/posts/{id}/` - Get specific post
-   `PUT /api/posts/{id}/` - Update post
-   `DELETE /api/posts/{id}/` - Delete post

### Post Responses (Likes/Dislikes)

-   `POST /api/posts/{id}/responses/` - Like/dislike a post
-   `DELETE /api/posts/{id}/responses/` - Remove response

## Testing

### Backend Tests

```bash
cd server
python manage.py test
```

### Frontend Tests

```bash
cd client
npm run test  # If configured
```

## Deployment

### Frontend

Build the React app for production:

```bash
cd client
npm run build
```

The built files will be in the `dist/` directory.

### Backend

For production deployment, consider using:

-   **Gunicorn** as WSGI server
-   **Nginx** as reverse proxy
-   **PostgreSQL** in production
-   **AWS S3** or similar for media files
-   **Redis** for caching (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using React and Django
