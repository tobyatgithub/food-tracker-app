# food-tracker-app

## How to Run

```
// start mysql
mysql.server start
mysql -h localhost -u root -p

// Add a `.env` file and set it to your local database
DATABASE_URL="mysql://root:password@localhost:3306/tododb"

// install, init and migrate prisma
npm install @prisma/client
npx prisma init
npx prisma migrate dev --name init
npx prisma studio
npx prisma db push

// execute backend via
cd food-tracker/api && nodemon index.js

// execute front end via
cd food-tracker && npm start
```
