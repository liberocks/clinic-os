# Clinic OS

## Table of Contents
- [Clinic OS](#clinic-os)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Tech Stack](#tech-stack)
  - [Data flow](#data-flow)
  - [State Management](#state-management)
  - [Running on your local](#running-on-your-local)
    - [Setting up your environment variables](#setting-up-your-environment-variables)
    - [Building the Medusa project](#building-the-medusa-project)
    - [Database migration](#database-migration)
    - [Starting the frontend](#starting-the-frontend)
  - [Endpoints](#endpoints)
  - [Screens](#screens)
  - [Known issues](#known-issues)
    - [Railway Hibernating Issue](#railway-hibernating-issue)
    - [Routing Issue on Railway](#routing-issue-on-railway)
    - [Medusa Admin Build Issue](#medusa-admin-build-issue)

## Getting Started

The project comprises two parts: the Medusa Platform and a frontend application for patients. The Medusa Platform is a backend application that serves as the API for the Admin Dashboard and Patients application. In the Admin Dashboard, the admin can manage the anamnesis form and send them to the patients' app. As for the frontend application, it is a React application that is used by patients to give responses to the questions asked by the doctors/medical staff.

## Tech Stack
For the backend, I am using the following technologies:
- **Database**: PostgreSQL
- **Server**: Medusa (Awilix, Express, TypeORM)
- **Cache**: Redis
- **Static page**: Webpack
- **Other UI frameworks**: React Table (v7), dnd-kit
- **Icon**: Lucide

For the frontend, I am using the following technologies:
- **Framework**: React with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router
- **Rest API Client**: Medusa
- **Icon**: Lucide
- **State management**: React Context and React Hook

## Data flow
The data flow in the application is as follows:
- The admin creates an anamnesis form in the Admin Dashboard. To do this, go to the anamnesis page and click on "Create New Form". A new page will open where you can add questions (as well as sections) to the form. On this page, you can drag and drop the question items as you see fit. Once you are done, click the "Save" button. This will create the form, sections, and questions data in the database.
- If you want to add more questions to the form, you can do so by clicking the "Edit" button on the form. This will open the form in edit mode, where you can add more questions or sections. All information on this page is editable. The "Save Changes" button will only turn green if valid changes are made.
- The admin then sends the form to the patients. To do this, go to the anamnesis page and click on the "Share" button. A modal will open where you can select the patients by email to whom you want to send the form. Once you click the "Send" button, the form will be sent to the patients.
- In the admin's anamnesis page, you can see the list of forms that have been created, along with their title, description, and other details.
- On the patient's side, they will see the list of forms that have been sent to them. They can then click on a form to start answering the questions. Once they are done, they can click the "Submit" button.
- The admin can then see the responses in the anamnesis page. To view the responses, go to the anamnesis page and click on the "View Responses" button. This will open the anamnesis detail page, where you can switch the tab from "Editor" to "Submission" to see the responses from the patients. On this page, you will find a table that contains the responses of the patients. Because the responses are stored in a JSON format, I made a modal to show the prettified JSON data. This can later be improved in a table view or other visualization.

## State Management

The frontend is almost completely stateless because every time the user requests data, the backend will send them the latest data (cached in Redis if there is no change). Exceptions are made in the following areas:
- When the patient signs in, I store the access token in the cookies and store the patient's name and email in local storage. The data in the local storage will be rehydrated when the patient open the app and put in the user context. This way all pages that need the user data can access it by using simple hooks.
- When the patient submits the form, the form data will be stored in the form ref and sent to the backend when the patient clicks the submit button.
- Managing the drag-and-drop experience is a bit tricky because there is a lot of state that needs to be maintained and the structure of the components is nested. To avoid complexity by using props drilling, I use React Context to manage the state of the drag-and-drop experience. This way, child components can access the state without having to pass props from the parent component.
- The state management for non-complex components is managed using simple React Hooks.


## Running on your local

### Setting up your environment variables
Create a `.env` file in the `server` directory and add the following environment variables:

```
ADMIN_CORS=
COOKIE_SECRET=
DATABASE_URL=
JWT_SECRET=
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
REDIS_URL=
```

Create a `.env` file in the `frontend` directory and add the following environment variables:
```
VITE_APP_BASE_URL=http://localhost:8000
VITE_APP_MEDUSA_BACKEND_URL=http://localhost:9000
```

Adjust the value above to match your local setup.

### Building the Medusa project
To build the project, run the following commands:

```
cd server
yarn
yarn dev
```

This will build and run the Medusa Platform. Once it runs, stop the server to proceed with next setup

### Database migration
If you are starting the project for the first time, you will need to run the database migration. To do this, run the following command:

```
cd server
yarn seed
yarn migrate
```

Once the command is done, you can start the server again by running `yarn dev`. The server will be running on `http://localhost:7001`.

### Starting the frontend
To start the frontend, run the following commands:

```
cd frontend
yarn
yarn dev
```

The frontend will be running on `http://localhost:8000`.

## Endpoints

The endpoints are divided into two parts: the API for admin and the API for patients. The API for admin is as follows:
- GET `/anamnesis`: For the admin to get all anamnesis forms. This endpoint supports pagination and search queries.
- POST `/anamnesis`: For the admin to create a new anamnesis form.
- GET `/anamnesis/:id`: For the admin to get a specific anamnesis form.
- POST `/anamnesis/:id`: For the admin to update an anamnesis form. It is supposed to be a PUT/PATCH endpoint, but MedusaJs doesn't support it. So, I use POST instead.
- DELETE `/anamnesis/:id`: For the admin to delete an anamnesis form.
- POST `/assignment`: For the admin to send an anamnesis form to the patients.
- GET `/submission`: For the admin to get all submissions of an anamnesis form. This endpoint supports pagination and search queries.

As for the patients, the endpoints are as follows:
- GET `/assignment`: For the patients to get all anamnesis forms that have been sent to them. This endpoint supports pagination and search queries.
- POST `/submission`: For the patients to submit their responses to the anamnesis form.
- GET `/submission/:id`: For the patients to get the form detail.


## Screens

The application has the following screens:

- Admin's Anamnesis List page: This page shows the list of anamnesis forms that have been created by the admin. On this page, the admin can filter the list using a search query, sort based on category, and navigate using pagination. The admin can click on the "Create New Form" button to create a new form.

- Admin's Anamnesis Detail Page: This page shows the details of an anamnesis form. The admin can view the sections and questions that have been added to the form. The admin can also edit the form by directly modifying the fields. Additionally, the admin can send the form to the patients by clicking the "Share" button. The admin can also view the responses from the patients by clicking the "Submissions" tab.

- Patient's Sign In Page: This page displays the sign-in form for the patients. Patients can sign in using their email and password.

- Patient's Assignment List Page: This page shows the list of anamnesis forms that have been sent to the patients. Patients can click on a form to start answering the questions.

- Patient's Form Page: This page displays the questions that patients need to answer. Patients can click on the "Submit" button to submit their responses.


## Known issues

### Railway Hibernating Issue
The plan I am using on Railway is the free plan, which means the application will hibernate after 30 minutes of inactivity. If you encounter a 502 error when accessing the application, it is likely that the application has hibernated. To fix this, you can wake up the application by accessing the URL again.

### Routing Issue on Railway
If you try the Patient's live application in the Railway app, you won't be able to navigate around by editing the URL directly from the browser or do a hard refresh unless you do it from the root route. The issue is caused by the way the Railway app handles routing. The issue doesn't occur when you run the application locally.

### Medusa Admin Build Issue
If you have built the Medusa app and then add a new library, you need to rebuild the Medusa app again. Otherwise, the new library won't be recognized by the Medusa app. To fix this, you can run `rm -rf node_modules && rm yarn.lock && yarn` in the `server` directory.

