## what we need for the site is:
nodejs
postgres
npm

## what we need for the compiler api is:
nodejs
npm
compilers
	gcc
	g++
	python
	rust
	node
	java
	
## How to build an image with custom name without using yml file:
	docker build -t automarker -f 'dockerfile automarker' .
	docker build -t compiler_api -f 'dockerfile api' .
	docker build -t automarker_db -f 'dockerfile db' .
	
## How to run a container with custom name:
	docker run -it --net am-net --name automarker -p 3000:3000 -p 5556:5555 -d automarker
	docker run -it --net am-net --name compiler_api -p 8080:8080 -d compiler_api
	docker run --net am-net --name automarker_db -p 5469:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=automarker -d automarker_db

docker network create am-net

docker inspect automarker | grep IPAddress	
docker inspect automarker_db | grep IPAddress
docker inspect compiler_api | grep IPAddress

docker exec automarker_db env

The address of the db is: automarker_db:5432
The address of the web site is: automarker:3000
The address of the compiler_api is: compiler_api:8080

