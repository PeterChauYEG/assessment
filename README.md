# Speer

## getting started
1. `yarn`
2. `docker-compose up`
3. `yarn start:dev`

## Testing
1. `yarn test`

## Info

Docs: http://localhost:3001/api/docs

### Tech Stack

#### TypeScript
I chose TypeScript because it's a superset of JavaScript that adds static type definitions. This allows for better code quality and easier refactoring. It also allows for better tooling and IDE support.
Data transfer objects are important in APIs because they allow for a clear definition of the data that is being transferred between the client and the server. This allows for better error handling and validation. 
Typescript allows for the creation of these interfaces. It's static analysis helps to catch errors before they happen.

#### NestJS
I chose NestJS because it's a framework that allows for the creation of scalable and maintainable server-side applications. It's built on top of Express and Node, and uses TypeScript. It also has a lot of built-in features that make it easy to create APIs.
It uses paradigms from Java's Spring framework, which provide stability, readability, and maintainability. It's decorators allow for the creation of controllers, services, and modules, which are the building blocks of the application.
It also has a built-in dependency injection system, which allows for the creation of loosely coupled modules. This makes it easy to swap out modules and services without having to change the code in other modules.
It pushes the developer to be mindful of the architecture of the application, modularizing the code and separating concerns. Express plugins and middlewares are accessible, which makes it easy to integrate with other libraries.

Additionally, it supports:
- GraphQL
- Websockets
- Microservices
- OpenAPI
- REST
- gRPC
- automatic rate limiting/throttling
- automatic validation
- automatic serialization
- automatic documentation

And provides really thorough documentation to cover how to implement all the above. It's got just enough magic for a great developer experience.

#### Prisma
Prisma is a SQL ORM that allows for the creation of database models and migrations. It allows for the creation of queries and mutations. It also has a built-in query builder that allows for the creation of complex queries. Schema can be defined in a declarative way, which makes it easy to read and understand. It also has a lot of built-in features that make it easy to create APIs, such as search, and pagination. Migrations are also easy to create and run. Additionally, roll-backs are supported. It fully supports typescript and automatically generated the required types to interact with it and your schema. Seeding is also supported, which makes it easy to create test data.

#### Postgres
Postgres is a relational database that is open source and has a lot of community support. It's also very stable and has a lot of features that make it easy to use. It's also very scalable and can handle large amounts of data. It does not support full text search, it supports which makes it easy to search for data. However it does support full text indexing. In a production enviroment, I would choose to use a managed elesticsearch service, such as Algolia.

#### Stych
Authentication is complex, difficult, and critical. I typically do not recommend rolling our own. 

Stych provides a managed authentication service that is secure and easy to use. It also provides a lot of features that make it easy to implement authentication in an application. It also provides a lot of security features that make it easy to secure an application. It supports password, OTP, OAuth and many other authentication methods. It also supports multi-factor authentication, which is important for securing an application. It also supports social login, which makes it easy to implement authentication in an application.

It also supports JWTs and Sessions so there is alot of flexbility.

#### Jest
Jest is a standard for testing in JavaScript. It is modern and provides all the tooling your might want for unit and integration testing. It also has a lot of community support and is easy to use. It allows developers to write tests in a human readable way. 
