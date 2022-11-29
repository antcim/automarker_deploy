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
#### It may take anywhere from 5 to 10 minutes to build the images with their dependencies.