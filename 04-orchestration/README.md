# Exercise 04: Orchestration Test - Rails API

This exercise demonstrates multi-file coordination and orchestration by building a complete Ruby on Rails API.

## What Was Built

A RESTful API for managing users with the following endpoints:

### API Endpoints

- **GET /api/users** - Returns list of all users
- **POST /api/users** - Creates a new user
- **GET /api/users/:id** - Returns a single user by ID

## Project Structure

```
users-api/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       └── users_controller.rb    # API controller with CRUD actions
│   └── models/
│       └── user.rb                     # User model
├── config/
│   ├── routes.rb                       # API routes configuration
│   └── database.yml                    # Database configuration
├── db/
│   ├── migrate/
│   │   └── 20260209183805_create_users.rb  # User table migration
│   └── seeds.rb                        # Sample data
└── README.md
```

## How to Run

### 1. Start the Rails Server

```bash
cd 04-orchestration/users-api
rails server
```

The API will be available at `http://localhost:3000`

### 2. Test the Endpoints

**Get all users:**
```bash
curl http://localhost:3000/api/users
```

**Get a specific user:**
```bash
curl http://localhost:3000/api/users/1
```

**Create a new user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"name":"Eve Wilson","email":"eve@example.com"}}'
```

## Sample Data

The database is pre-seeded with 4 users:
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Charlie Davis (charlie@example.com)
- Diana Prince (diana@example.com)

## What to Observe (For Assignment)

### Orchestration Behavior:
1. **Multi-file coordination** - Rails generated and I configured multiple files:
   - Model, controller, routes, seeds, migration
2. **Sequential vs Parallel** - Work was done sequentially (can't create controller before model)
3. **File structure explanation** - Rails conventions organize files logically
4. **Real-time visibility** - You saw each file being generated/edited

### Rails Concepts Refresher:
- **MVC Architecture** - Model (User), Controller (UsersController), Routes
- **Migrations** - Database schema changes tracked in version control
- **RESTful Routes** - Standard HTTP verbs (GET, POST) for CRUD operations
- **Namespacing** - API controllers organized under `Api::` namespace
- **Strong Parameters** - `user_params` method secures user input

## Technical Details

- **Rails Version:** 8.0.3
- **Ruby Version:** 3.4.4
- **Database:** SQLite3
- **API Type:** JSON API (no views, API-only mode)

## Next Steps

If you want to extend this:
- Add UPDATE (PUT/PATCH) and DELETE endpoints
- Add validations to the User model
- Add authentication/authorization
- Add pagination for the index endpoint
- Add error handling middleware
