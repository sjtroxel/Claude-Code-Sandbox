# Exercise 04b: Orchestration Test - Express API

This exercise demonstrates multi-file coordination and orchestration by building a simple Express REST API.

## What Was Built

A RESTful API for managing users with the following endpoints:

### API Endpoints

- **GET /api/users** - Returns list of all users
- **POST /api/users** - Creates a new user (requires `name` and `email` in JSON body)
- **GET /api/users/:id** - Returns a single user by ID

## Project Structure

```
04b-orchestration-express/
├── package.json                    # Dependencies and scripts
├── server.js                       # Main Express server (orchestration point)
├── routes/
│   └── users.js                   # Route definitions
├── controllers/
│   └── usersController.js         # Business logic
├── data/
│   └── users.json                 # Simple JSON "database"
└── README.md                       # This file
```

## How to Run

### 1. Install Dependencies

```bash
cd 04b-orchestration-express
npm install
```

### 2. Start the Server

```bash
npm start
```

The API will be available at `http://localhost:3000`

### 3. Test the Endpoints

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
  -d '{"name":"Eve Wilson","email":"eve@example.com"}'
```

**See available endpoints:**
```bash
curl http://localhost:3000/
```

## Sample Data

The database is pre-populated with 4 users:
- Alice Johnson (alice@example.com)
- Bob Smith (bob@example.com)
- Charlie Davis (charlie@example.com)
- Diana Prince (diana@example.com)

## What to Observe (For Assignment)

### Orchestration Behavior:

1. **Sequential Dependencies:**
   - Had to create folders first
   - Controller depends on data file existing
   - Routes depend on controller existing
   - Server depends on routes existing

2. **Parallel Opportunities:**
   - Could create all 3 folders at once (no dependencies between them)
   - Could create `data/users.json` and `package.json` in parallel
   - README is independent and could be created anytime

3. **File Structure Explanation:**
   - Explained BEFORE creating files
   - Showed the dependency chain: data → controller → routes → server

4. **Real-time Visibility:**
   - You saw each file being created with Write tool
   - Todo list tracked progress
   - Each step explained its purpose

### Express Architecture:

- **Separation of Concerns:** Routes → Controllers → Data (clean architecture)
- **Middleware:** JSON parsing, route mounting
- **RESTful Design:** Standard HTTP verbs (GET, POST)
- **Error Handling:** Try-catch blocks, proper HTTP status codes
- **File-based Storage:** Simple JSON file (no database needed)

## Comparison: Express vs Rails

| Aspect | Express | Rails |
|--------|---------|-------|
| Files Created | 6 files | 85+ files |
| Setup Complexity | Low | High |
| Conventions | Minimal | Strong (MVC) |
| Dependencies | 1 (express) | Many (bundler) |
| Database | Optional | Expected |
| Learning Curve | Gentle | Steep |

## Technical Details

- **Node.js:** Required (v16+)
- **Express:** ^4.18.2
- **No Database:** Uses JSON file for simplicity
- **Port:** 3000 (configurable)

## Next Steps

To extend this API:
- Add UPDATE (PUT/PATCH) and DELETE endpoints
- Add input validation library (like Joi or express-validator)
- Replace JSON file with real database (MongoDB, PostgreSQL)
- Add authentication/authorization
- Add pagination and filtering
- Add unit tests
