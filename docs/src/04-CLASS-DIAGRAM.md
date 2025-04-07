# 🗃️ UCollab Class Diagram

##  Overview
This class diagram describes our current database structure.

---

```mermaid
classDiagram
    class Account {
        +String id
        +String userId
        +String type
        +String provider
        +String providerAccountId
        +String? refresh_token
        +String? access_token
        +Int? expires_at
        +String? token_type
        +String? scope
        +String? id_token
        +String? session_state
    }

    class User {
        +String id
        +String username
        +String email
        +DateTime createdDate
        +DateTime lastLogin
        +String fullName
        +String firstName
        +String lastName
        +String avatar
        +AvatarSource avatarSource
        +String azureAdId
        +OnboardingStep onboardingStep
        +String? bio
        +Int? gradYear
        +String? githubProfile
        +MentorshipStatus mentorship
    }

    class Session {
        +String id
        +String sessionToken
        +String userId
        +DateTime expires
    }

    class Post {
        +String id
        +DateTime createdDate
        +DateTime lastModifiedDate
        +String title
        +String description
        +Float rating
        +Boolean allowRatings
        +Boolean allowComments
        +String? githubRepo
        +String? bannerImage
        +String createdById
    }

    class Comment {
        +String id
        +String postId
        +String createdById
        +DateTime createdDate
        +DateTime lastModifiedDate
        +String content
        +String? parentId
    }

    class Notification {
        +String id
        +String userId
        +String message
        +DateTime createdDate
        +Boolean isRead
        +NotificationType type
        +String? postId
        +String? commentId
        +String? triggeredById
    }

    class NotificationPreferences {
        +String id
        +String userId
        +Boolean enabled
        +Boolean allowComments
        +Boolean allowMentions
        +Boolean allowPostUpdates
        +Boolean allowSystem
        +Boolean allowRatings
    }

    class Technology {
        +String id
        +String name
        +Boolean verified
        +DateTime createdDate
    }

    class PostRating {
        +String id
        +String postId
        +String userId
        +Int rating
        +DateTime createdDate
    }

    class PostWatcher {
        +String id
        +String postId
        +String userId
        +DateTime createdDate
    }

    class PostNeed {
        +String id
        +NeedType needType
        +DateTime createdDate
        +Boolean isPrimary
    }

    User --> Post : creates
    User --> Comment : leaves
    User --> Notification : receives
    User --> Account : has many
    User --> Session : has many
    User --> Technology : has many
    User --> PostRating : creates
    User --> PostWatcher : watches
    User --> NotificationPreferences : has one
    User --> Notification : triggers
    Post --> Comment : has many
    Post --> Technology : has many
    Post --> PostRating : has many
    Post --> PostWatcher : has many
    Post --> User : created by
    Post --> Notification : generates
    Post --> PostNeed : has many
    Comment --> Post : belongs to
    Comment --> User : created by
    Comment --> Comment : has replies
    Comment --> Notification : generates
    Notification --> User : notifies
    Notification --> Post : references
    Notification --> Comment : references
    Notification --> User : triggered by
```
