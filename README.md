# Patient Tracker and Invoice Generator - TypeScript Backend Project

[Click this link to view the hosted version of this project](https://ts-patient-and-invoices.herokuapp.com/api/patients)

This is a **RESTful API**, mimicking a real world back-end service with real world use for medico-legal experts.The database is **PSQL** interacted with via node-postgres. There are **POST & GET** methods to either access or add to the data on patients, solicitors and invoices.

To run this project in your local environment **fork** and **clone** [this repository](https://github.com/Sam-C-F/Patient-Tracker-and-Invoice-Generator.git).

## Before running this database

### Please ensure the following are installed:

- Node: v14.16.0
- Postgres: v13.0
- node package manager: v7.24.0

This project relies on several dependencies including:

- dotenv
- express
- pg
- pg-format
- cors

And the following developer dependencies used for testing:

- @types/chai
- @types/express
- @types/mocha
- @types/node
- @types/pg-format
- @types/supertest
- chai v.4.3.6
- supertest v.6.1.6
- ts-mocha v.10.0.0
- ts-node v.10.8.1
- typescript

Type `npm install` in the terminal to add all dependencies and devDepencies needed for the project to run.

Create a file in the main **src** folder called:
`.env.development`

and include the following in the file:

`PGDATABASE=patient_tracker`

Then create a file in the main **src** folder called:
`.env.test`

and include the following in the file:

`PGDATABASE=patient_tracker_test`

You will need to manually run _`setup.sql`_ to create the tables needed for the seed to populate. This can be done using the preprepared script: `npm run setup-dbs` and only needs to be run to initialize the database. Following this the script: `npm run seed` can be used to seed the development database.

`npm start` can be used to run the server locally.

## Testing

As **TDD** has been used throughout the development process there is a full testing suite which can be found in the **spec** directory.

Tests can be run using:

`npm run test`

The database will be reset before running every test and will close automatically once the testing is complete.

## .gitignore

Finally, remember to set up a `.gitignore` file with the following to be included:

- node_modules
- .env\.\*
- dist
