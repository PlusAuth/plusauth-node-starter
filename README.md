<div align="center">
  <a href="https://plusauth.com/">
    <img src="https://docs.plusauth.com/favicon.png" alt="Logo" width="144">
  </a>
</div>

<h1 align="center">PlusAuth NodeJS Starter Project</h1>

 <p align="center">
    Simple Node.js project demonstrates basic authentication flows with PlusAuth
    <br />
    <br />
    <a href="https://docs.plusauth.com/quickStart/web/nodejs/express" target="_blank"><strong>Explore the PlusAuth NodeJS docs »</strong></a>
</p>

<details>
  <summary>Table of Contents</summary>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#what-is-plusauth">What is PlusAuth</a></li>
 </ol>
</details>

---

# About The Project

It is a simple Node.js project demonstrating basic authentication flows such as register, login, and logout. To keep things simple, Express.js is used as the server framework and `Passport.js` with OIDC Strategy for authentication.

## Prerequisites
Before running the project, you must first follow these steps:

1) Create a PlusAuth account and a tenant at [https://dashboard.plusauth.com](https://dashboard.plusauth.com)
2) Navigate to the `Clients` tab and create a client of type `Regular Web Application`
3) Go to the details page of the client that you've just created and set the following fields as:

- **Redirect Uris:** http://localhost:3000/auth/callback
- **Post Logout Redirect Uris:** http://localhost:3000/auth/logout/callback


Please note your `Client Id` and `Client Secret` that will be required in the application's configuration.

## Getting Started

First, install dependencies 

```shell script
$ npm install
# or with yarn
$ yarn install
```

After that, all you need to do is configure the application. Rename `.env.example` file as just`.env`.

Then configure the `.env` file using your Client ID, Client Secret, and PlusAuth tenant id.


Now you can start the server:

```shell script
$ npm run start
// or with yarn
$ yarn start
```

The example will be running at [http://localhost:3000/](http://localhost:3000/)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

## What is PlusAuth

PlusAuth helps individuals, teams, and organizations to implement authorization and authentication systems in a secure, flexible and easy way.

<a href="https://plusauth.com/" target="_blank"><strong>Explore the PlusAuth Website »</strong></a>

<a href="https://docs.plusauth.com/" target="_blank"><strong>Explore the PlusAuth Docs »</strong></a>

<a href="https://forum.plusauth.com/" target="_blank"><strong>Explore the PlusAuth Forum »</strong></a>
