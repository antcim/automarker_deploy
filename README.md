# Automarker Deployed with Docker Compose
The project is composed of three parts:
1. The site, contained in the automarker folder
2. The complier api, contained in the compiler_api folder
3. The database whose scheme is defined with Prisma in the automarker folder.

Each ot these represents a container in docker.

## Run the following command
```bash
docker-compose up
```
#### It may take anywhere from 5 to 10 minutes to build the images with their dependencies 
(it could be better if there is a good connection).

#### Import data from .sql file
If you want to make some tries with existing users and tasks you can import data
by going to the CLI of the automarker_db container and then typing the following command:
```bash
psql -d automarker -U postgres -f /home/dbData.sql
```

#### Account inside the database:
1. Admin -> Email: admin@admin.it Password: 123
2. Student -> Email: francesco98vinci@gmail.com Password: 123
3. Professor -> Email: pietro.ferrara@gmail.com Password: 123