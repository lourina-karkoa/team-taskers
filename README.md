# Team-Taskers (Task Management System) :

### Description  
A backend API for a team task management system that allows:  
- Managers to create projects and assign tasks to team members  
- Team members to view assigned tasks, add notes, and update their progress  
- Tracking project progress through activity logs and real-time notifications  
- Role-based access control with secure authentication and authorization  
- Exporting reports as PDF files  

### Environment:  
- **Programming Language:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB  
- **API:** RESTful API  


**Note:** MongoDB Atlas was used as the database service.  

### Technologies Used:  
- Postman for API documentation  
- WebSocket for sending real-time notifications  

### System Security:  
- Input validation  
- Protection against XSS and SQL/NoSQL injection  
- Session authentication using JWT  
- Role-based route authorization  


### System & User Setup:  
- Database design includes entities: users, projects, tasks, and notes.  
- Users include: Manager and Team Member with clearly defined permissions.  

### Authentication & Authorization:  
- Users can sign up by providing name, email, password, and optionally a profile picture (or a default image is used)  
- Login with email and password, secured with Argon2 encryption  
- Logout functionality  

### Project Management:  
- Managers can create, update, delete projects, and delete all projects along with related tasks and notes  
- Managers and team members can view all projects or specific projects by ID  

### Task Management:  
- Managers can create, view (all or by ID), update, delete single or all tasks  
- Team members can view and update their own tasks only  

### Notes:  
- Both managers and team members can add notes to tasks  
- Each note is linked to its task and author, with timestamping  
- Notes are displayed in chronological order to form a conversation log to help manage tasks  


## Advanced Features

### Activity Logs:  
- Managers can view all activities, user-specific activities, entity-specific activities by `entityId`, and specific activity logs by `id`  
- Team members can view their own activity logs and specific logs by `id`  

### Notifications for New or Updated Tasks:  
- Notify manager when a task’s status changes  
- Notify manager when a note is added to a task  
- Notify team members when they are assigned a new task  
- Offline notifications are stored in the database; when users come online, they receive stored notifications which are then marked as read  

### Task Filtering & Advanced Search:  
- Users can filter tasks by status, project, responsible member, or due date  

### PDF Report Export:  
- Managers can export task lists or project reports as PDF files  


## Installation

1. **Clone the repository**
git clone https://github.com/your-username/team-taskers.git
cd project
npm install
PORT=4000
MONGO_URI="mongodb://localhost:27017/team-taskers"
JWT_SECRET_KEY="our_jwt_secret_key"


### Used Libraries & Packages:
| Library                  | Description                                  |
| ------------------------ | -------------------------------------------- |
| `express`                | Web framework for building REST APIs         |
| `mongoose`               | ODM for MongoDB                              |
| `dotenv`                 | Loads environment variables from `.env` file |
| `jsonwebtoken`           | Handles JWT-based authentication             |
| `argon2`                 | Secure password hashing                      |
| `morgan`                 | Logs HTTP requests for development           |
| `helmet`                 | Secures HTTP headers                         |
| `cors`                   | Enables Cross-Origin Resource Sharing        |
| `express-rate-limit`     | Limits repeated requests to APIs             |
| `express-async-handler`  | Simplifies error handling in async routes    |
| `express-mongo-sanitize` | Sanitizes user input to prevent MongoDB operator injection |
| `express-validator`      | Middleware for validating and sanitizing inputs |
| `html-entities`          | Encode and decode HTML entities               |
| `mongo-sanitize`         | Prevents MongoDB Operator Injection attacks   |
| `mongodb`                | Official MongoDB driver for Node.js           |
| `multer`                 | Middleware for handling multipart/form-data (file uploads) |
| `nodemailer`             | Send emails from Node.js                       |
| `nodemon`                | Automatically restarts node application during development |
| `pdfmake`                | Generates PDF reports                          |
| `socket.io`              | Real-time communication for notifications     |
| `xss`                    | Sanitizes input to prevent Cross-site scripting attacks |



### API Endpoints Summary:
| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | /api/auth/signup | Register a new user | no            |
| POST   | /api/auth/login  | Login and get token | no            |
| POST   | /api/auth/logout | Logout user         | yes           |

### User Routes:
| Method | Endpoint                  | Description                       | Auth | Role         |
| ------ | ------------------------- | -------------------------------- | ---- | ------------ |
| GET    | /api/users/               | Get all users                    | ✔    | Manager      |
| POST   | /api/users/send-otp       | Send OTP                        | ✘    | -            |
| POST   | /api/users/check-otp      | Check OTP                       | ✘    | -            |
| PUT    | /api/users/update         | Update profile (with image)     | ✔    | Authenticated|
| PUT    | /api/users/update-password| Update password                 | ✔    | Authenticated|
| DELETE | /api/users/:id            | Delete user by ID (Manager)     | ✔    | Manager      |
| DELETE | /api/users/               | Delete all users (Manager)      | ✔    | Manager      |


### Project Routes:
| Method | Endpoint          | Description           | Auth Required | Role          |
| ------ | ----------------- | --------------------- | ------------- | ------------- |
| GET    | /api/projects/    | Get all projects      | yes           | TeamMember, Manager |
| GET    | /api/projects/:id | Get project by ID     | yes           | TeamMember, Manager |
| POST   | /api/projects/add | Create a new project  | yes           | Manager       |
| PUT    | /api/projects/update/:id | Update project by ID | yes      | Manager       |
| DELETE | /api/projects/delete/:id | Delete project by ID | yes      | Manager       |
| DELETE | /api/projects/delete | Delete all projects   | yes           | Manager       |


### Task Routes:
| Method | Endpoint      | Description            | Auth Required | Role               |
| ------ | ------------- | ---------------------- | ------------- | ------------------ |
| GET    | /api/tasks/   | Get all tasks          | yes           | Manager            |
| GET    | /api/tasks/:id| Get task by ID         | yes           | Manager, TeamMember|
| POST   | /api/tasks/add| Create a new task      | yes           | Manager            |
| PUT    | /api/tasks/:id| Update task by ID      | yes           | Manager, TeamMember|
| DELETE | /api/tasks/:id| Delete task by ID      | yes           | Manager            |
| DELETE | /api/tasks/   | Delete all tasks       | yes           | Manager            |


### Notes Routes:
| Method | Endpoint               | Description              | Auth Required | Role               |
| ------ | ---------------------- | ------------------------ | ------------- | ------------------ |
| POST   | /api/notes/add/:taskId | Add a note to a task     | yes           | Authenticated user |
| GET    | /api/notes/getNotes/:taskId | Get all notes for a task | yes           | Authenticated user |
| GET    | /api/notes/getNoteByid/:noteId | Get note by ID       | yes           | Authenticated user |
| PUT    | /api/notes/update/:noteId | Update a note           | yes           | Authenticated user |
| DELETE | /api/notes/delete/:noteId | Delete a note           | yes           | Manager, TeamMember|


Activity_Logs Routes:
| Method | Endpoint                       | Description          | Auth | Role          |
| ------ | ------------------------------| -------------------- | ---- | ------------- |
| GET    | /api/activity-logs             | All logs             | Yes  | Manager       |
| GET    | /api/activity-logs/user/:userId      | User logs            | Yes  | Manager       |
| GET    | /api/activity-logs/entityActivity/:entityId | Entity logs          | Yes  | Manager       |
| GET    | /api/activity-logs/My          | My logs              | Yes  | Manager, TeamMember |
| GET    | /api/activity-logs/:id         | Log by ID            | Yes  | Manager, TeamMember |
| DELETE | /api/activity-logs/deleteActivity/:logId | Delete log by ID     | Yes  | Manager       |
| DELETE | /api/activity-logs/deleteAllActivity        | Delete all logs      | Yes  | Manager       |


### Export_PDF Routes:
| Method | Endpoint                 | Description              | Auth | Role    |
| ------ | ------------------------ | ------------------------ | ---- | ------- |
| GET    | /api/export/pdf/project-task/:projectId | Export single project tasks PDF | Yes  | Manager |
| GET    | /api/export/pdf/projects-Report          | Export all projects report PDF  | Yes  | Manager |


### Project Structure:
project/
│
├── src/
│   ├── config/
│   │   ├── email.js
│   │   └── multer.js
│   │
│   ├── controllers/
│   │   ├── activityLogs.controller.js
│   │   ├── auth.controller.js
│   │   ├── exportPdf.controller.js
│   │   ├── notes.controller.js
│   │   ├── project.controller.js
│   │   ├── tasks.controller.js
│   │   └── users.controller.js
│   │
│   ├── helpers/
│   │   ├── argon2.helper.js
│   │   ├── createAdmin.js
│   │   ├── generateOTP.js
│   │   ├── generateSecretKey.helper.js
│   │   ├── logActivity.helper.js
│   │   ├── Notification.js
│   │   ├── pdfGenerator.js
│   │   └── auth.middleware.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── checkImage.js
│   │   ├── errorhandler.middleware.js
│   │   ├── helmet.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── ratelimit.middleware.js
│   │   ├── role.middleware.js
│   │   ├── security.middleware.js
│   │   ├── validate.middleware.js
│   │   └── validateObjectId.middleware.js
│   │
│   ├── models/
│   │   ├── ActivityLogs.js
│   │   ├── Notes.js
│   │   ├── Notification.js
│   │   ├── OTP.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Users.js
│   │
│   ├── plugins/
│   │   └── paginate.js
│   │
│   ├── routes/
│   │   ├── ActivityLogs.routes.js
│   │   ├── auth.routes.js
│   │   ├── exportPDF.routes.js
│   │   ├── notes.routes.js
│   │   ├── projects.routes.js
│   │   ├── tasks.routes.js
│   │   └── users.routes.js
│   │
│   ├── validation/
│   │   ├── auth.validate.js
│   │   ├── notes.validate.js
│   │   ├── projects.validate.js
│   │   ├── tasks.validate.js
│   │   └── users.validate.js
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
README.md
