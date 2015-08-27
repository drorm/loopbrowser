# Model browser for loopback.js apps
Let's you browse over your models and perform CRUD operations.

#Installation

* Install npm
* Install bower
* clone this repo
* npm install
* cd client/app
* bower install

### Database set up
* Add your database connector -- https://docs.strongloop.com/display/public/LB/Database+connectors
configure your credentials in server/datasources.local.js.  The following is an example config for postgres:
```
module.exports = {
  'db': {
    'connector': 'postgresql',
    'host': 'localhost',
    'port': 5432,
    'database': 'loopbrowser',
    'username': 'loopbrowser',
    'password': '**************'
  }
};
```
Adjust for your db as described in the loopback docs

### Create the db tables
*You can lose all your data*
If the database tables do not exist, running node server/automigrate.js will create them. Only do that when you initially create your database schema. If it already exists, you'll loose any data that is in your tables.

### Use existing models
If you already have an application with models copy the model files, or on \*nix OS, symbolically link them to the appropriate locations:
* server/model-config.json
* common/models/modelname.json (modelname is the name of your model)



#Run
in the root of the app run
* node .
* Your app is running at http://localhost:3000 
* Edit server/config.json if you'd like to use a different port or server

#Known issues
This is very early code:
* No paging -- all results from a table show up on one page
* No security -- anyone with the URL can perform CRUD operations
* While there's validation on fields, the validation is quite preliminary
