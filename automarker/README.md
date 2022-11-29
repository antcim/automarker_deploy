# AutoMarker v0.1.0

### Next.JS

This web application is developed with the [Next.js](https://nextjs.org/) framework.
Next.js is a [React](https://en.wikipedia.org/wiki/React_(web_framework) "React (web framework)") framework that enables several extra features, including ***server-side*** rendering and generating static websites.

Developing a Next.JS project centers around the two main directories  `pages`  and  `public`  in the root of the application:
-   `pages`  - Associated with a route based on their file name. For example  `pages/about.tsx`  is mapped to  `/about`
-   `public`  - Stores static assets such as images, fonts, etc. Files inside  `public`  directory can then be referenced by code starting from the base URL (`/`).

Next.js is built around the concept of  pages. A page is a  React Component exported from a  `.js`,  `.jsx`,  `.ts`, or  `.tsx`  file in the  `pages`  directory. We can even add  ***dynamic route*** parameters with the filename.


### Layered Architecture Style

Generally, layered architectures consist of four standard layers: 
- ***presentation***,
- ***business***,
- ***persistence***,
- and ***database***

For the project we have chosen the following variant.
This variant physically separates the presentation layer into its own deployment unit, with the business and persistence layers combined into a second deployment unit. With this variant, the database layer is usually physically separated through an external database or filesystem.

![enter image description here](https://i.ibb.co/fpbsKqk/Immagine.png)

Each layer of the layered architecture style has a specific role and responsibility within the architecture. 

The ***presentation layer*** is responsible for handling all user interface and browser communication logic, whereas the ***business layer*** is responsible for executing specific business rules associated with the request.
Each layer in the architecture forms an abstraction around the work that needs to be done to satisfy a particular business request. 

The presentation layer doesn’t need to know or worry about how to get customer data; it only needs to display that information on a screen in a particular format. 
Similarly, the business layer doesn’t need to be concerned about how to format customer data for display on a screen or even where the customer data is coming from; it only needs to get the data from the persistence layer, perform business logic against the data (such as calculating values or aggregating data), and pass that information up to the presentation layer.

![enter image description here](https://i.ibb.co/02VSSzy/Immagine2.png)

In our project we divided the roles as follows:
- In the `model` directory there are the functions that interact directly with the database.
To interact with the database we use ***Prisma***, Prisma is an open source next-generation ORM (Object-Relational Mapping). This directory is identified as the *database layer*.
- The `api` directory contains all the *bussiness logic* and takes care of managing the requests that arrive directly from the *persistent layer*.
As mentioned above, we have unified the business layer and the persistence layer into one layer.
- Finally, the `pages` directory (excluding the `api` directory) contains all the front-end files with which the user interacts. This is identified as the *presentation layer*.

## AutoMarker DB Structure

A  _**professor**_  can:
-   create/delete/modify a task
-   mark a task
-   see all students enrolled in his course

A  _**Student**_  can:
-   see the tasks of the courses he is enrolled in
-   create/modify/submit a solution for a task
-   enroll in a course

An  _**Admin**_  can:
-   create  **courses**
-   assign a  **professor**  to a  **course**
-   create a  **professor**  account

## Entity–relationship model

>ER Crow's Foot [ Notation](https://vertabelo.com/blog/crow-s-foot-notation/)

```mermaid
erDiagram  
	USERS ||--|{ COURSES : prof
	USERS  ||--o{  REGISTRATIONS  : o
	REGISTRATIONS  }|--||  COURSES  : o 
	USERS ||--o{ SUBMISSION : makes
	TASKS ||--|{ SUBMISSION : has
	TASKS }o--|| COURSES : refers_to

USERS  {  
	string id
	string name  
	string lastName
	string username
	string hash
	string salt
	string craetedAt
	string role
}
REGISTRATIONS {
	string id
	string user_id
	string course_id
	string createdAt
}

COURSES {
	string id
	string name
	string user_id
	string academicYear
}

SUBMISSION {
	string id
	string user_id
	string task_id
	double mark
	string workspace
	bool   isSubmitted
	string submittedAt
}

TASKS {
	string id
	string course_id
	string title
	string assignment
	string deadline
	string testCase
	string hint
	string solution
	string createdAt
	string language
	string placeholder
}
```

```js
enum Role {
  USER
  PROF
  ADMIN
}
```

## Instructions for the automarker team

### Installation

The first time you start the project you need to install the dependencies

```bash
npm install
```

once the installation is complete run the application

```bash
npm run dev
```

be sure to create the  `.env`  file, inside which it must be inserted

```js
DATABASE_URL="postgresql://nome_utente:password@127.0.0.1:5432/automarker"
TOKEN_SECRET="32_caratteri_random"
```

### Prisma commands

Synchronize Prisma schema with database schema

```bash
npx prisma db push
```

Open Prisma studio

```bash
npx prisma studio
```

## Postgres

[https://www.postgresql.org/download/](https://www.postgresql.org/download/)
