# Key app
## Description
KeyApp is a user-friendly application designed to simplify and centralize key management for organizations. It provides a secure and organized platform for managing physical keys, with differentiated functionalities for three user types: Admin, Facility Manager, and Employee.

### Admin:

**Centralized Control:** The admin has ultimate authority within KeyApp. They can add new organizations, manage facility manager accounts, and configure access levels.

**Organization Management:** Admins can create new organizations within KeyApp, allowing for easy scaling and multi-tenant functionality.

### Facility Manager:

**Branch & Key Management:** Facility Managers can add new branches within their organization and manage key inventory for each branch.

**Enhanced Organization:** Facility Managers contribute to a well-organized system by adding keys and associating them with specific branches.

### Employee:

**Simplified Borrowing & Returning:** Employees can easily loan and return keys through a user-friendly interface. This streamlines access control and reduces administrative tasks.

**Improved Accountability:** Employees maintain clear accountability for assigned keys, promoting responsible key usage. For example, Facility Managers can see what keys are late and message employees about that.

### KeyApp Benefits:
Increased Efficiency: Automates key management tasks, saving time and resources.

Enhanced Security: Provides a centralized system for tracking and controlling key access.

Improved Visibility: Offers real-time insights into key usage.

Simplified Communication: Facilitates communication between employees and facility managers regarding key access needs.

Tailored User Experience:  Each user type has a customized view within KeyApp, providing them with the functionalities most relevant to their role. This ensures a user-friendly and efficient experience for everyone involved.

## Link to website

[FrontEnd](https://eeturo-key-app.azurewebsites.net/login)

## Know for testing

**Bugs**

When logging in you get "acceess denied" but you can refresh the page to login.

Can't see who sent you messages.

### One way to test project for classmates and teachers

Logging as admin user you can see it from OMA.

Create an organization and add a facility manager to it remember to copy password.

Login as the facility manager you made.

Add a branch to your organization from the organization tab.

You can add keys and delete keys from the keys page.

Create an employee from the employees page remember to copy password.

You can change passwords of the facility managers you made and users from the settings tab.

Login as user.

Test loaning keys.

You can also message the facility manager you made from the chat window.

You need to have both clients open so facilitymanager and employee to send messages between them.

When registering a new user from register button make sure you set organization as Metropolia or to something you have made.

### Second way

Create a user from the register form to organization "Metropolia".

Follow guide one but ignore the admin stuff.



## Table of contents
1. [Installation on local machine](#Installation)
2. [Usage](#Usage)
3. [Technologies](#Technologies)
4. [Demo](#Demo)

## Installation
### Servers
This project uses three different servers and each server has its installation guide on their GitHub page.
1.[Authorization server](https://github.com/Rouhis/SSSF-project-auth)
2.[Websocket server](https://github.com/Rouhis/SSSF-Project-WS)
3.[FrontEnd server](https://github.com/Rouhis/SSSF-Project-WS)

### Backend installation
For backend installation clone this repo.
Then install packages
```bash
npm install
```
.env file
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mongoDB databaseurl
JWT_SECRET=YOUR SECRET
AUTH_URL=YOUR AUTH URL (if using auth server locally its localhost:3001)
```
For running the backend project
```bash
npm run dev
```
## Usage
The project has a register button just for testing purposes the application admins are made straight to the database for security reasons and the register registers you as a Facility Manager. The idea about creating facility managers and employees is sending their password to the email of the one creating the user but this wasn't implemented in this stage of the project so the backend does send the temporary password that should be changed on the first login for security reasons to the client for the one creating the user to see. After registering an account it is recommended to change the user's role to admin from the database so you can create an organization based on the organization you added to the test account. Then you can create a facility manager for that organization and use that for testing.
### Tests
The application has tests that can be run
```bash
npm run test
```
![image](https://github.com/Rouhis/SSSF-Project/assets/103174848/e638b895-f7ec-448b-a8ff-32294da5d6b6)

## Features

**Admins**

Admins can create and delete organizations. Also, admins can create facility managers.

**Facility managers**

Facility managers can create employees, keys, and branches and also delete them.

Facility managers can send messages to other users in their organization.

Facility managers can change their name and password.

**Employees**

Employees can loan and return keys.

Employees can send messages to other users in their organization.

Employees can change their name and password.


## Technologies
**Typescipt**

**JavaScript**

**GraphQL**

**MongoDB**

**React**

**Vite**

**Websocket**

## Demo
[Link to demo](https://www.youtube.com/watch?v=uJKWJgMxc-c&ab_channel=Rouhis)




