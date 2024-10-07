# UCollab

UCollab is a web platform created for University of Cincinnati students pursuing degrees in Information Technology (IT), Computer Science (CS), Information Systems (IS), and related fields. This platform facilitates project discovery, contributions, and peer feedback, enabling students to collaborate and share knowledge with others across various majors.

## Class Diagram

```mermaid
classDiagram
    class Account {
        +UUID id
        +UUID userId
        +String type
        +String provider
        +String providerAccountId
        +String? refreshToken
        +String? accessToken
        +Int? expiresAt
        +String? tokenType
        +String? scope
        +String? idToken
        +String? sessionState
        +Int? refreshTokenExpiresIn
    }

    class Session {
        +UUID id
        +String sessionToken
        +UUID userId
        +Date expires
    }

    class User {
        +UUID id
        +String username
        +String email
        +Date createdDate
        +boolean allowNotifications
        +boolean verifiedEmail
        +String? name
        +String? image
    }

    class VerificationToken {
        +String identifier
        +String token
        +Date expires
    }

    class Profile {
        +UUID id
        +UUID userId
        +Date createdDate
        +Date lastModifiedDate
        +Json? skills
        +Json? interests
        +Int? gradYear
        +String? bio
    }

    class Post {
        +UUID id
        +UUID createdById
        +Date createdDate
        +Date lastModifiedDate
        +String title
        +String description
        +PostType postType
        +Json? technologies
        +String? githubRepo
        +Status status
    }

    class Comment {
        +UUID id
        +UUID postId
        +UUID createdById
        +Date createdDate
        +Date lastModifiedDate
        +String content
    }

    class Notification {
        +UUID id
        +UUID userId
        +String message
        +boolean disableNotifications
    }

    User --> Post : creates
    User --> Comment : leaves
    User --> Profile : has
    User --> Notification : receives
    User --> Account : owns
    User --> Session : has
    User --> VerificationToken : is sent
    Post --> Comment : has many
    Comment --> Post : belongs to
    Notification --> User : notifies
```

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
