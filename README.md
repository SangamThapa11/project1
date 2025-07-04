# project1
# api-43
## Package.json //compulosry file - package management file
- 3 types of packages
    - dependency  
    - global dependency  -g
    - Dev dependency     -D
        - 3 environment
            -development
            -testing
                -staging
                -UAT
            -production
## software design pattern 
    -Singleton
    -Factory
    -Repository
    - Service based
## MVC Pattern
 -MVC
   - Model-View- Controller
   - Layer
   - Data layer
    -model 
   -logical layer
     - Controller
   - Presentation layer
     -view
## Modular Pattern
   - Featured break 
## Service based

```json
node_modules/
src/
  config/                       // express configiration
  modules/
    features/
       features.router.js
       feature.model.js
       feature.controllor.js
       featire.validator.js
  middlewares/
  services/
  utilities/
  pulic/
.gitignore
index.js    //entry point
package-lock.json
package.json
README.md 
````

## REST API
    -MEthods/HTTP verbs
    to register routes
    / get, post, put, patch, delete
    -CRUD
    - Create => post
    - Read => get
    - Update =>  put/patch
    - Delete => delete

-URL and method 10 features - 6

## SOLID principal of software development
- Single Responsibility Principle
- Open close Principle
- Liskov Subsitution Principle
- Interface Segregation Principle   // common codes should break down
- Dependency Inversion Principle

## solid principles of software development
  - Single Responsibility Principle
  - Open-close Principle
  - Liskov Substution Principle
  - Interface Segregation Principle
  - Dependency Inversion Principle

## file upload flow:
- `public/uploads/` ========> controller ===============> upload to cloudinary, delete from public/uploads

## Registration process
-user data ewntry ====> DB store =======> Email with a link to active account with a token ====> FE ======> Token Send BE ========> verify======> Activate

### database
-relational and non-relational
-relational database
  - SQL database
      -mySQL, postgres, ms-sql, oracle
- nom-relational databse
   - NoSQL Database
   - mongodb, cassandra, couchdb 

- ORM / ODM 
  -object relational mapping/ modeling
    - sequelize, typeorm, prisma
  - object document mapping/ modeling
    -mongoese 


### database access
username: project-1
password: rXTgHbjaP4WkfmAQ   

url: mongodb+srv://project-1:rXTgHbjaP4WkfmAQ@api-43.8nuonqd.mongodb.net/


### CRUD
#### Create data insert
  - db.collectionName.InsertOne(jsonObj)   //db.users.insertOne(data)
  -  - db.collectionName.InsertMany(jsonObj)

mongosh directory change
- use mern-43 or dir

connection to database 
- mongosh url


### REad 
-db.collectionName.findOne(filter, project, options)
- db.collectionName.findMany(filter, project, options)

*filter
  - {key: "value", key1: "value"}
  - or operation
    {
      "key": "value"
    }
    { "$op": "expression"}
    {"age": {"$gt": 18}}
    {"$or": [
      { 
        "address": "Pokhara"
      },
      {"role":"admin"}
    ]}
    {"$or":[{"address":"Pokhara"}, {"role": {"$in":["admin", "seller"]}}]}

    //$op => $gt, $lt, $gte, $eq, $ne, $in, $nin, $regex, $or, $and

  *projection
  -db.users.find({}, {name:1, emmail:1, _id: 0})
  reverse oder
  -db.users.find({},{}, {sort: {name: "desc"}})
  
  
### update
- `db.collectionName.updateOne(filter, {$set:updateDtae}, {upsert: true/false})`
- `db.collectionName.updateMany(filter, {$set:updateDtae}, {upsert: true/false})`

  - db.users.updateOne({_id: ObjectId('68334809942edc84a46c4bd3')}, {$set:{name:"Seller User One"}}); 
  // data naveteko time ma new data create garxa
  - db.users.updateOne({_id: ObjectId('68334809942edc84a46c4bd3')}, {$set:{name:"Seller User One"}}, {upsert: true}); 

### Delete
-  `db.collectionName.deleteOne(filter)`
-  `db.collectionName.deleteOne(filter)`

- db.users.deleteOne({_id: ObjectId('68334809942edc84a46c4bd3')});

// to convert data into information in database
- package
  -mongoose ODM provider
    - Class => Model Class -> name=> singular pascal case

- Data identify 
-feature based data

email: oeko zkem pvid jgba


###Features
- _id, status, createdAt, createdBy, updatedBy (on each table maintained)
-Auth
-Banners/Sliders/Hero (least priority)  ------SQL maintain
- Brand
      - name, slug, logo, status(FE Control)
  -Create
  -List
  -Read
  -Update
  -Delete 
- Category
    - Data: name, slug, parentId, brands, icon/image, inMenu, isFeatured, 
- User
- Products  
    -Data
       - ID, status, createdAt, updatedAt, createdBy, updatedBy, name, slug, category, brand, price, discount, seller, images, description, afterdiscount, stock, sku(store keeping unit), isFeatured, attributes
- Order
    - buyer, code, items: [orderDetail], grossTotal, grossDelivaryTotal, discount, subTotal,tax, total, _id, status, cretedAt, createdBy, updatedAt, updatedBy
   -Detail
     - buyer, order, product, quantity, price, total, deliverCharge, seller, _id, status, cretedAt, createdBy, updatedAt, updatedBy
  - Transactions
    -id, order, amount, mode:[cod, esewa, khalti, bank], txnId, response, cretedAt, createdBy, updatedAt, updatedBy, 
- Chat

### Category logic
- categories, parentId
- id: 1, name: "ABC", ..........parentId: null  ===========> top level category
-id: 2, name: "XYZ", ............ pranetId: 1    ============> child/sub category 

### SQL (Structured Query Language)
  -RDBMS (Relational DB Management System)
  - Data are represented in a table form with rows and columns 
  - mysql, mariadb, postgres, mssql, oracle
  -
## Pgsql install 
  - password (db root password)- Mern43#
  - port no (5432)
  -username: default
  -hostname: localhost

## Steps
- Connect the server
- Database create or select
- If table does not exists, first make the table (migration)
- Query the db tables

## Sequelize Installation
  - npm i sequelize pg pg-hstore
For migration (dev dependency)
 -npm i sequelize-cli --save-dev 

### To run sequelize
  - npx sequelize-cli migration:create --name create_banners_table
# Sfter Setup
 - npx sequelize-cli db:migrate
 


E-Commerce API
├── Auth
│   ├── Login (Admin)
│   └── Login (Customer)
├── Coupons
│   ├── Create Coupon (Admin)
│   ├── List Coupons
│   └── Validate Coupon
├── Products
│   ├── Create Product
│   └── List Products
├── Cart
│   ├── Add to Cart
│   └── View Cart
└── Orders
    └── Checkout with Coupon

