# College Management System (React + Java)

Starter full-stack project:
- Frontend: React + Vite
- Backend: Java 17+ + Spring Boot 3
- Database: MySQL
- Initial working module: Student CRUD (create, list, update, delete)

## Requirements
- Node.js (current LTS)
- Java 17+
- Maven
- MySQL 8+

## 1. Database
Create the database:
```sql
CREATE DATABASE college_db;
```
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password.

## 2. Start backend
```bash
cd backend
mvn spring-boot:run
```
API runs at http://localhost:8080/api/students

## 3. Start frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually http://localhost:5173).

## API
- GET `/api/students`
- GET `/api/students/{id}`
- POST `/api/students`
- PUT `/api/students/{id}`
- DELETE `/api/students/{id}`

This is a learning starter, not a production-ready deployment. Add authentication/authorization,
server-side validation, database migrations, tests, and secure secrets before real use.
