# PlusAuth NodeJS Starter Project


This is a very simple Node.js project demonstrating basic authentication flows such as register, login and logout. To keep things simple we used Express.js as the server framework and Passport.js with OIDC Strategy for authentication.


## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [License](#license)

## Prerequisites
Before running the project, you must first follow these steps:

1) Create a PlusAuth account and a tenant at [https://dashboard.plusauth.com](https://dashboard.plusauth.com)
2) Navigate to `Clients` tab and create a client of type `Regular Web Application`.
3) Go to details page of the client that you've just created and set the following fields as:
- **Redirect Uris:** http://localhost:3000/auth/callback
- **Post Logout Redirect Uris:** http://localhost:3000/auth/logout/callback


Finally, write down your Client Id and Client Secret for server configuration.
 
## Getting Started

First we need to configure the server. Rename `.env.example` file as just`.env`.

Then configure the `.env` file using your Client ID, Client Secret and your PlusAuth tenant id.


Now you can start the server:

        npm start
    

The example will be running at [http://localhost:3000/](http://localhost:3000/)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
