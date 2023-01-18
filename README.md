# AutoMarker v0.1.0

### Next.JS

This web application is developed with the [Next.js](https://nextjs.org/) framework.

Next.js is a [React](https://en.wikipedia.org/wiki/React_(web_framework) "React (web framework)") framework that enables several extra features, including ***server-side*** rendering and generating static websites.

Developing a Next.JS project centers around the two main directories  `pages`  and  `public`  in the root of the application:
-   `pages`  - Each file name in this folder represents an associated route. For example  `pages/prof/profile.tsx`  is mapped to  `/prof/profile`
-   `public`  - Stores static assets such as images, fonts, etc. Files inside this directory can then be referenced by code starting from the base URL (`/`).

Next.js is built around the concept of  pages. 

A page is a  React Component exported from a  `.js`,  `.jsx`,  `.ts`, or  `.tsx`  file in the  `pages`  directory. 

We can even add  ***dynamic route*** parameters within the filename.

### Distributed Architecture Style
We have a main site developed following the layered architecture style as per 3rd task requirements.

The distributed architecture style has been used with management of the compilation service.

There is an `orchestrator microservice` that dispatches compilation requests to available `compilator microservices`.

For simplicity the orchestrator microservice *randomly chooses* the service to dispatch compilation requests to.

#### The Layered Site

Generally, layered architectures consist of four standard layers: 
- ***presentation***
- ***business***
- ***persistence***
- ***database***

For the project we have chosen the following variant.
This variant physically separates the presentation layer into its own deployment unit, with the business and persistence layers combined into a second deployment unit. With this variant, the database layer is usually physically separated through an external database or filesystem.

![enter image description here](https://i.ibb.co/fpbsKqk/Immagine.png)

Each layer of the layered architecture style has a specific role and responsibility within the architecture. 

The ***presentation layer*** is responsible for handling all user interface and browser communication logic, whereas the ***business layer*** is responsible for executing specific business rules associated with the request.

Each layer in the architecture forms an abstraction around the work that needs to be done to satisfy a particular business request. 

The presentation layer doesn’t need to know or worry about how to get customer data; it only needs to display that information on a screen in a particular format. 

Similarly, the business layer doesn’t need to be concerned about how to format customer data for display on a screen or even where the customer data is coming from; it only needs to get the data from the persistence layer, perform business logic against the data (such as calculating values or aggregating data), and pass that information up to the presentation layer.

![image](https://user-images.githubusercontent.com/98947590/212870821-01e0d23e-a9ea-41bc-9825-9b2b3130c3b6.png)

In our project we divided the roles as follows:
- In the `model` directory there are the functions that interact directly with the database.
To interact with the database we use ***Prisma***, Prisma is an open source next-generation ORM (Object-Relational Mapping). This directory is identified as the *database layer*.
- The `api` directory contains all the *bussiness logic* and takes care of managing the requests that arrive directly from the *persistence layer*. We also made another api since the NextJS runtime does not allow the use of the shell execution module available in the nodejs runtime. This api is run in parallel with the site and is found in the `compiler_api` folder. As mentioned above, we have unified the business layer and the persistence layer into one layer.
- Finally, the `pages` directory (excluding the `api` directory) contains all the front-end files with which the user interacts. This is identified as the *presentation layer*.

## Automarker Deployed with Docker Compose

The project has a total of 4 components:

1. The site, contained in the `automarker` folder
2. The complier api, contained in the `compiler_api` folder
3. The database whose scheme is defined with Prisma in the `automarker` folder and uses postgres as the chosen db.
4. The orchestrator, contained in the `orchestrator` folder.

Each ot these represents a container in docker.

There are however `2 compilers available`, therefore the total number of containers amounts to 5.

### Ports in use
There are a total of 5 ports used, each for a specific container:
- `port 3000`: the main site container
- `port 5469`: the postgres db container
- `port 8079`: the orchestrator container
- `port 8080`: the 1st compiler container
- `port 8081`: the 2nd compiler container

### Starting up the project
Simply run the following command.
```docker
docker-compose up
```

> It may take anywhere from under a minute to a whole 10 minutes to build the images with their dependencies. This is very much affected by internet connection speed.

#### Import data from `.sql` file

A dump of an already populated database for the trial of the site is available in the `dbData.sql` file.

To import this data, run the following command in the `CLI` of the `automarker_db` container.

```
psql -d automarker -U postgres -f /home/dbData.sql
```

## Inside the Web App

The following accounts are present in the *database dump* that can be imported (see the docker section):

-  _**Admin**_:
    -   Email:  `admin@admin.it`
    -   Password:  `123`
-  _**Student**_:
	- Student 1:
		-   Email:  `francesco98vinci@gmail.com`
	    -   Password:  `123`
	- Student 2:
		-   Email:  `antonio.cimino@gmail.com`
	    -   Password:  `123`
	- Student 3:
		-   Email:  `filippo.bedon@gmail.com`
	    -   Password:  `123`
	- Student 4:
		-   Email:  `marco.tubia@gmail.com`
	    -   Password:  `123`
	- Student 3:
		-   Email:  `davide.bresaola@gmail.com`
	    -   Password:  `123`
-  _**Professor**_:
	- Prof 1:
	    -   Email:  `pietro.ferrara@gmail.com`
	   	-   Password:  `123`
	 - Prof 2:
		-   Email:  `michele.bugliesi@gmail.com`
		-   Password:  `123`

### Prof Side
Log in as a professor in the login section.
On the *profile page*, a summary will be displayed for everything concerning the professor's sphere.

The number of students enrolled in each course, the number of prof's courses and the number of ongoing tasks will be displayed.

A  _**professor**_  can:
-   *create*/*delete*/*modify* a task
-   *mark* a submission (*only if it expired*)
-   see all students enrolled in his course (*on development*).

A ***task*** can be:
- *created*
- *deleted*
- *modified* (*only if not expired*)

The `task page` displays the *ongoing tasks* and those *expired* divided by course.

On this page you can see how many students have *submitted* a task by clicking on the row of the table that corresponds to the task.

To evaluate (*mark*) a submission, just click on the 💯 button so the code written by the student will be displayed.

### Student Side

A  _**Student**_  can:
-   see the tasks of the courses he is enrolled in
-   *create*/*modify*/*submit* a solution for a task
-   *enroll* in a course

On the `main page` a summary will be displayed for all that concerns the student, ongoing or expired assignments and those submitted.

On the `course` page it is possible to search for and enroll in a course.

In order to carry out a task, just click on it from the `profile page` or from the `course page`.

A task can be:
- *saved*
- *run*
- *submitted* (*until it expires*)

### Admin Side

An  _**Admin**_  can:
-  *create*/*delete*/*modify*  **courses**
-  *assign* a  **professor**  to a  **course**
-  *create*/*delete*/*modify* a  **professor**  account
- *create*/*delete*/*modify* an **admin**

On the main page it will be possible to see a summary of the system with the profs, courses and admins.

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

# (Developement) Instructions for the Automarker team

## Automarker Web App 

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

### Postgres

[https://www.postgresql.org/download/](https://www.postgresql.org/download/)

## Automarker Compiler API

### First Step

```bash
npm install
```

### How the api works
The api expects a request body as follows

```js
{
    "language" : "",
    "code" : ""
}
```

The language field can be either one of these, case does not matter.

```
c
c++
rust
java
javascript
python
```

The code field can be directly taken from a text input
but it **must be processed by `JSON.stringify()` before sending it in the request**.

Requests must be done in POST to the `/api` route.

The api responds with a body as follows

```js
{
  "request_body": {
    "language": "",
    "code": ""
  },
  "compiler_output": "",
  "compiler_error": ""
}
```
