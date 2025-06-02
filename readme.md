# Codepy 

### TechStack
- ### Backend
    - Node-js
    - Express-js
    - Postgres
    - Prisma
    - Judge0 - for code execution

- ### Frontend
    - Javascript
    - React-js
    - Tailwind-CSS
    - Daisy-ui/Magic-ui/Shadcn
    - Zustand
    - Zod and react-hook-forms

---

### Architecture - Backend
- Authentication
- Problems section
- Code-Execution
- Code-Submission
- Dsa sheet
- Contest feature (probably in v3)

### User
- Admin
    - Create the problem
        - testcases
        - problem description
    - Delete a problem
    - Schedule a contest (probably in v3)

- User
    - Solve a problem and submit solution
    - Track solved problems and submissions
    - View individual testcase result

---

### Commands used
- ### Backend
    - npm init
    - npm i -g nodemon
    - npm i express
    - npm i dotenv
    - npm i prisma
    - npm i @prisma/client
    - npx prisma init
    - install docker desktop on your system
    - docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
        - name of container = my-postgres
        - username = myuser
        - password = mypassword
        - -p = port number
        - -d = detach mode, that is dont interfere in b/w, spin up the container etc in background
    - then make sure to change the DATABASE_URL in your .env to this "postgres://myuser:mypassword@localhost:5432/postgres"
    - npx prisma format - to format a prisma schema
    - npx prisma generate - whenever you change prisma schema run this command
    - npx prisma migrate dev - whenever you change prisma schema run this command
    - npx prisma db push - whenever you change prisma schema run this command

    - npm i bcryptjs
    - npm i jsonwebtoken
    - npm i cookie-parser

    - in git bash : openssl rand -hex 32 (for jwt secret)

- ### Frontend
    - npx react-ignite@latest
        - select react-tailwind-shadcn template
    - npm i react-router-dom
