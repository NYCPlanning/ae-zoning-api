# Zoning API
This project is an API for serving data related to zoning, such as zoning districts and tax lots.

## Running the project locally

### Make sure you're using the correct version of Node
The `.nvmrc` file tells you which version of node you should be using to run the project. If you're using [nvm](https://github.com/nvm-sh/nvm) and already have the correct version installed, you can switch by running `nvm use` from the root of this repo.
 
### Install dependencies
Once you have cloned this repo, install the necessary dependencies:
```
npm i
```
### Run local database with docker compose
Next, use [docker compose](https://docs.docker.com/compose/) to stand up a local Postgresql database with PostGIS installed. If you need to install docker compose, follow [these instructions](https://docs.docker.com/compose/install/).

### Set up your `.env` file
Create a file called `.env` in the root folder of the project and copy the contents of `sample.env` into that new file

### Run the project
Finally, to run the project locally:
```
npm run dev
```

