# UCollab Build Guide

##  Overview
These instructions outline how to build the UCollab site from source for development purposes.

---

## Build Instructions

> [!Important]  
> Building this project from source requires installing [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/en), and [Docker](https://www.docker.com/products/docker-desktop/).

1. Clone the repository and change into the directory
   ```
   git clone https://github.com/steelesh/UCollab.git && cd UCollab
   ```
2. Create your .env file
   ```
   Copy .env.example and rename it to .env
   ```
3. Install the dependencies
   ```
    npm install
    ```
4. Start Docker Desktop
   ```
   docker desktop start
   ```
5. Run the development build
   ```
   npm run dev
   ```# Project
