# UCollab

<p>UCollab is a web platform created for University of Cincinnati students pursuing degrees in Information Technology (IT), Computer Science (CS), Information Systems (IS), and related fields. 
This platform facilitates project discovery, contributions, and peer feedback, enabling students to collaborate and share knowledge with others across various majors.</p>

## Build Instructions

1. Clone the repository and change into the directory
   ```
   git clone https://github.com/steelesh/UCollab.git && cd UCollab
   ```
3. Create your .env file
   ```
   Modify .env.example and rename to .env
   ```
4. Create the database
   ```
   sh start-database.sh
   ```
5. Update to the current database
   ```
   npm run db:push
   ```
6. Run the development build
   ```
   npm run dev
   ```


### Created by

_Luke Halverson, Nawrs Alfardous, Paige Weitz, Steele Shreve & Zachary Thomas_
