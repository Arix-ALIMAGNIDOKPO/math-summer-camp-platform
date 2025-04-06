
# Admin Interface Documentation - Summer Maths Camp

This document describes how to use the administration interface for the Summer Maths Camp application.

## Accessing the Admin Interface

1. Navigate to `/admin/login` on your server (e.g., `http://localhost:5000/admin/login` in development)
2. Enter the admin credentials:
   - Username: `Admin25` 
   - Password: `SMCII`

For production deployment, modify these credentials by setting environment variables:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Admin Dashboard

The dashboard provides an overview of registration statistics:
- Total registrations
- Pending applications
- Confirmed registrations
- Rejected applications

Quick action buttons allow you to navigate to view all students or just pending applications.

## Student Management

### Viewing Student Registrations

The Students page allows you to:
- View all registrations
- Filter by status (All, Pending, Confirmed, Rejected)
- See basic information about each student

### Student Details

Clicking on "View Details" for a student shows:
- Complete registration information
- Current status
- Option to update the status

### Updating Registration Status

From the student details page, you can update the status to:
- Pending (default status for new registrations)
- Confirmed (student has been accepted)
- Rejected (student application was not accepted)

## Security Considerations

For production deployment:
1. Change the default credentials by setting environment variables
2. Set a strong `SECRET_KEY` environment variable for session security
3. Consider implementing HTTPS for secure access
4. Consider adding IP restrictions or other security measures for admin access

## Database

All student data is stored in a JSON file at:
- `backend/data/students.json`

For production environments, consider implementing a more robust database solution like PostgreSQL or MongoDB.

## Deployment

For deployment options, please refer to the main README file located in the backend directory.
