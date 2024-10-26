# ClientRegister

## Project Overview
ClientRegister is an application for managing client data, scheduling meetings, and creating notes associated with clients. The application includes basic user registration and login functionality, allowing users to manage account settings and change passwords. Key technologies include Angular, json-server for backend simulation, Angular Material, ngx-mat-timepicker, and PrimeNG.

The project was designed as a modular application to explore modular architecture in Angular.

## Technologies
- **Framework**: Angular CLI version 18.0.4
- **Backend**: json-server
- **UI Libraries**: Angular Material, PrimeNG, Bootstrap
- **Timepicker**: ngx-mat-timepicker

## Setup Instructions

### Development Server
1. **Start Backend**: Run `npm run start:backend` to start json-server with a dummy backend. The database is stored in a JSON file (`db.json`).
2. **Start Frontend**: Run `ng serve` to launch the frontend server. Navigate to `http://localhost:4200/` in your browser. Angular’s live-reload feature will refresh the app upon changes.

### Build the Project
Run `ng build` to compile the project. The compiled files will be saved in the `dist/` directory.

### Code Generation
Run `ng generate component <component-name>` to generate a new component. Other options include `directive`, `pipe`, `service`, `class`, `guard`, `interface`, `enum`, and `module`.

### Testing

- **Unit Tests**: Run `ng test` to execute unit tests with [Karma](https://karma-runner.github.io).
- **End-to-End Tests**: Run `ng e2e` to perform end-to-end tests. Ensure an e2e testing package is added.

For further help, use `ng help` or visit the [Angular CLI Documentation](https://angular.dev/tools/cli).

## Key Features

### User Account Management
- **Account Settings**: Update user details and password.

### Client Management
- **Client Table**: View clients in a paginated table with options to add, edit, and delete client records.
  
### Meetings Management
- **Meeting Scheduling**: Create, view, and manage meetings in a paginated table.
- **Today's Meetings Carousel**: On the home page, logged-in users can view a carousel of today’s meetings if scheduled.

### Notes Management
- **Note Creation and Management**: Create, edit, and delete notes for clients (specific purpose pending clarification).

![Static Badge](https://img.shields.io/badge/Angular-%230F0F11?style=flat&logo=angular&logoColor=white&color=%230F0F11)
![Static Badge](https://img.shields.io/badge/Typescript-%233178C6?style=flat&logo=typescript&logoColor=white&color=%233178C6)
![Static Badge](https://img.shields.io/badge/Json%20server-COLOR?style=flat&logo=json&logoColor=white&color=%23000000)
![Static Badge](https://img.shields.io/badge/HTML5-%23E34F26?style=flat&logo=html5&logoColor=white&color=%23E34F26)
![Static Badge](https://img.shields.io/badge/Bootstrap-COLOR?style=flat&logo=Bootstrap&logoColor=white&color=%237952B3)
![Static Badge](https://img.shields.io/badge/SASS-COLOR?style=flat&logo=sass&logoColor=white&color=%23CC6699)