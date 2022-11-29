# Automarker Deployed with Docker
The project is composed of three parts:
1. The site, contained in the automarker folder
2. The complier api, contained in the compiler_api folder
3. The database whose scheme is defined with Prisma in the automarker folder.

Each ot these represents a container in docker.

## First step: Build the docker images
```bash
docker build -t automarker -f 'dockerfile automarker' .
docker build -t compiler_api -f 'dockerfile api' .
docker build -t automarker_db -f 'dockerfile db' .
```

## Second step: Run the docker containers
```bash
docker run -it --net am-net --name automarker -p 3000:3000 -p 5556:5555 -d automarker
docker run -it --net am-net --name compiler_api -p 8080:8080 -d compiler_api
docker run --net am-net --name automarker_db -p 5469:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=automarker -d automarker_db
```

## Third step: Push th DB
On the Automarker Container in the CLI, run the following command:
```bash
npx prisma db push
```