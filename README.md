# Zoning API
This project includes an API to interact with data from city planning and OpenAPI documentation for the available endpoints. 

## Local API Setup

### Use the correct version of Node
The `.nvmrc` file tells you which version of node you should be using to run the project. 
If you're using [nvm](https://github.com/nvm-sh/nvm) and already have the correct version installed, 
you can switch by running `nvm use` from the root of this repo.
 
### Install dependencies
Once you have cloned this repo, install the necessary dependencies:
```sh
npm i
```

### Set up your `.env` file
Create a file called `.env` in the root folder of the project and copy the contents of `sample.env` into that new file

### Run local database with docker compose
Next, use [docker compose](https://docs.docker.com/compose/) to stand up a local Postgres database. 
```sh
docker compose up
```

If you need to install docker compose, follow [these instructions](https://docs.docker.com/compose/install/).

### Configure PostGIS
Enable geospatial features by activating the postgis extension

```sh
npm run pg:configure
```

### Drizzle ORM setup
Structure the database tables with drizzle

```sh
npm run drizzle:migrate
```

## Local development
The OpenAPI documentation and the API implementation complement each other. 
The OpenAPI documentation is written first, defining expectations for endpoints.
The API is subsequently implemented based on the OpenAPI documentation.

### OpenAPI development
The OpenAPI documentation is written in the `openapi/openapi.yaml` file.
The [redoc](https://redocly.com/docs/redoc/) cli provides commands to manage the documentation,
with a few key commands integrated into npm scripts.

When writing OpenAPI documentation:
- run `npm run redoc:dev`
- open localhost:8080
- make edits to `openapi/openapi.yaml`
- view the updates in real time through port 8080

To check validity of OpenAPI documentation:
- run `npm run redoc:lint`

### API development
The API integrates with the OpenAPI documentation by implementing its endpoints. 
The OpenAPI documentation defines schemas for the API to interact with. If an endpoint description is preceded by 🚧, it indicates that the endpoint has not yet been implemented and cannot be used on the frontend. 

The API uses [Kubb](https://www.kubb.dev) to automatically generate 
Typescript definitions and zod schemas from the OpenAPI documentation.
The generated code is kept in `/src/gen`. Never make manual changes to files in this folder.

Generate these resources with:
```sh
npm run kubb:generate
```

Finally, to run the api locally:
```sh
npm run dev
```

The application is running on port `3000`
- The root route `/` has the documentation built from the point where the application was run (`localhost:3000/`) 
- The `/api/{endpoint}` routes have the actual API implementation (ex: `localhost:3000/api/boroughs`)

(This command will also create a static site of the OpenAPI documentation at the root of the API.
This site reflects the documentation at the point where the command was written. Viewing changes to
the OpenAPI documentation requires restarting the development server).

### Schema changes
If you make changes to any database schema in `src/schema`, it will be necessary to generate migration files in order for the changes to be reflected in the database. Database schemas are indicated by their use of the drizzle `pgTable` method. (Changes to the Zod "entity" schemas do not require database migrations)
```sh
npm run drizzle:generate
```

### Data loading
This API manages its own database schemas (using the drizzle steps listed above). However, the data itself is loaded into the database through a separate ETL repository. The ETL repository is `NYCPlanning/ae-data-flow`.
For local development, the ETL communicates with the Zoning API through a shared docker network. The Zoning API docker compose creates this network, which the ETL repository then looks for and joins when it starts.

#### Troubleshooting the docker network

The docker network should be created automatically when bringing the Zoning API `up` and the ETL should also join it automatically. However, there are two common scenarios that may cause issues.

The ETL cannot find the network:
- Check the configuration of the `compose.yaml` in this repository (NYCPlanning/ae-zoning-api). It should be configured to have a network called `data`.
- Configure the compose to create a `data` network, if it does not already.
- If it does already configure this network, attempt to rebuild the container with `docker compose up --build -d`

The ETL cannot find the Zoning Database on the network:
- In this scenario, the network exists from a previous build. However, the Zoning API is failing to join it when it starts.
- First confirm the network exists.
  - Run `docker network ls`
  - Confirm there is a network called `ae-zoning-api_data`
  - Connect the Zoning API database container to the data network by running `docker network connect ae-zoning-api_data ae-zoning-api-db-1`

## Production builds
Running a production version of the site is a two step process.
First, generate production versions of the OpenAPI documentation and API.
Both of these steps are combined into the same script:
```sh
npm run build
```

Then, run the production build:
```sh
npm run start:prod
```

