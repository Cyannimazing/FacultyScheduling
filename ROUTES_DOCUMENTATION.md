# Faculty Scheduling System - API Routes Documentation

This document outlines all the available API routes for the Faculty Scheduling System controllers.

## Authentication
All API routes require authentication and email verification middleware (`auth`, `verified`).

## Route Structure
All routes follow RESTful conventions:
- `GET /resource` - List all resources (index)
- `POST /resource` - Create a new resource (store)
- `GET /resource/{id}` - Show a specific resource (show)
- `PUT /resource/{id}` - Update a specific resource (update)
- `DELETE /resource/{id}` - Delete a specific resource (destroy)

## Available Routes

### Academic Calendar Routes
**Prefix:** `/academic-calendar`  
**Route Name Prefix:** `academic-calendar.`

- `GET /academic-calendar` - List all academic calendars
- `POST /academic-calendar` - Create a new academic calendar
- `GET /academic-calendar/{academicCalendar}` - Show specific academic calendar
- `PUT /academic-calendar/{academicCalendar}` - Update specific academic calendar
- `DELETE /academic-calendar/{academicCalendar}` - Delete specific academic calendar

### Groups Routes
**Prefix:** `/groups`  
**Route Name Prefix:** `groups.`

- `GET /groups` - List all groups
- `POST /groups` - Create a new group
- `GET /groups/{group}` - Show specific group
- `PUT /groups/{group}` - Update specific group
- `DELETE /groups/{group}` - Delete specific group

### Lecturers Routes
**Prefix:** `/lecturers`  
**Route Name Prefix:** `lecturers.`

- `GET /lecturers` - List all lecturers
- `POST /lecturers` - Create a new lecturer
- `GET /lecturers/{lecturer}` - Show specific lecturer
- `PUT /lecturers/{lecturer}` - Update specific lecturer
- `DELETE /lecturers/{lecturer}` - Delete specific lecturer

### Lecturer Schedules Routes
**Prefix:** `/lecturer-schedules`  
**Route Name Prefix:** `lecturer-schedules.`

- `GET /lecturer-schedules` - List all lecturer schedules
- `POST /lecturer-schedules` - Create a new lecturer schedule
- `GET /lecturer-schedules/{lecturerSchedule}` - Show specific lecturer schedule
- `PUT /lecturer-schedules/{lecturerSchedule}` - Update specific lecturer schedule
- `DELETE /lecturer-schedules/{lecturerSchedule}` - Delete specific lecturer schedule

### Lecturer Subjects Routes
**Prefix:** `/lecturer-subjects`  
**Route Name Prefix:** `lecturer-subjects.`

- `GET /lecturer-subjects` - List all lecturer subject assignments
- `POST /lecturer-subjects` - Create a new lecturer subject assignment
- `GET /lecturer-subjects/{lecturerSubject}` - Show specific lecturer subject assignment
- `PUT /lecturer-subjects/{lecturerSubject}` - Update specific lecturer subject assignment
- `DELETE /lecturer-subjects/{lecturerSubject}` - Delete specific lecturer subject assignment

### Programs Routes
**Prefix:** `/programs`  
**Route Name Prefix:** `programs.`

- `GET /programs` - List all programs
- `POST /programs` - Create a new program
- `GET /programs/{program}` - Show specific program
- `PUT /programs/{program}` - Update specific program
- `DELETE /programs/{program}` - Delete specific program

### Program Subjects Routes
**Prefix:** `/program-subjects`  
**Route Name Prefix:** `program-subjects.`

- `GET /program-subjects` - List all program subject assignments
- `POST /program-subjects` - Create a new program subject assignment
- `GET /program-subjects/{programSubject}` - Show specific program subject assignment
- `PUT /program-subjects/{programSubject}` - Update specific program subject assignment
- `DELETE /program-subjects/{programSubject}` - Delete specific program subject assignment

### Rooms Routes
**Prefix:** `/rooms`  
**Route Name Prefix:** `rooms.`

- `GET /rooms` - List all rooms
- `POST /rooms` - Create a new room
- `GET /rooms/{room}` - Show specific room
- `PUT /rooms/{room}` - Update specific room
- `DELETE /rooms/{room}` - Delete specific room

### Subjects Routes
**Prefix:** `/subjects`  
**Route Name Prefix:** `subjects.`

- `GET /subjects` - List all subjects
- `POST /subjects` - Create a new subject
- `GET /subjects/{subject}` - Show specific subject
- `PUT /subjects/{subject}` - Update specific subject
- `DELETE /subjects/{subject}` - Delete specific subject

### Terms Routes
**Prefix:** `/terms`  
**Route Name Prefix:** `terms.`

- `GET /terms` - List all terms
- `POST /terms` - Create a new term
- `GET /terms/{term}` - Show specific term
- `PUT /terms/{term}` - Update specific term
- `DELETE /terms/{term}` - Delete specific term

### Time Slots Routes
**Prefix:** `/time-slots`  
**Route Name Prefix:** `time-slots.`

- `GET /time-slots` - List all time slots
- `POST /time-slots` - Create a new time slot
- `GET /time-slots/{timeSlot}` - Show specific time slot
- `PUT /time-slots/{timeSlot}` - Update specific time slot
- `DELETE /time-slots/{timeSlot}` - Delete specific time slot

## Route Organization

Each controller has its own dedicated route file in the `/routes` directory:

- `academic-calendar.php` - Academic Calendar routes
- `groups.php` - Groups routes
- `lecturers.php` - Lecturers routes
- `lecturer-schedules.php` - Lecturer Schedules routes
- `lecturer-subjects.php` - Lecturer Subjects routes
- `programs.php` - Programs routes
- `program-subjects.php` - Program Subjects routes
- `rooms.php` - Rooms routes
- `subjects.php` - Subjects routes
- `terms.php` - Terms routes
- `time-slots.php` - Time Slots routes

All these route files are included in the main `web.php` file.

## Usage Examples

### JavaScript/Axios Examples:

```javascript
// Get all programs
axios.get('/programs')

// Create a new lecturer
axios.post('/lecturers', {
    name: 'John Doe',
    email: 'john@example.com'
})

// Update a specific subject
axios.put('/subjects/1', {
    name: 'Updated Subject Name'
})

// Delete a room
axios.delete('/rooms/5')
```

### Using Named Routes in Laravel:

```php
// Generate URL for programs index
route('programs.index')

// Generate URL for specific lecturer
route('lecturers.show', ['lecturer' => 1])

// Redirect to programs create
redirect()->route('programs.create')
```

## Response Format

All controllers return JSON responses:
- `GET` requests return the resource(s) as JSON
- `POST` requests return the created resource with 201 status
- `PUT` requests return the updated resource
- `DELETE` requests return null with 204 status

