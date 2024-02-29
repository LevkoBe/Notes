  ## App Documentation
  
  #### Navigation

  1. [Introduction](#introduction)
  2. [Database schema documentation](#database-schema-documentation)
  3. [Controllers documentation](#controllers-documentation)
  4. [Handlers and static functionality](#handlers-and-static-functionality)
  5. [Sum-up](#sum-up)
  6. [Set-up](#set-up)
  7. [Video-quick-showcase](#video-quick-showcase)


# Introduction
  
  This documentation provides an overview of the components, functionalities, and usage of the application. The application is designed to facilitate user registration, note management, user interactions, group management, and real-time messaging through WebSocket.
  
  ###### Technologies Used
  
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - [Socket.io](http://socket.io/) for WebSocket communication
  - Pug for templating
  - Other Node.js modules: cors, body-parser, cookie-parser, method-override
  
  #### Components
  
  ###### 1. `app.js`
  
  The main entry point of the application where the server is initialized, database connection is established, and middleware are configured.
  
  ###### Dependencies
  
  - cors
  - http
  - express
  - mongoose
  - socketIo
  - body-parser
  - cookie-parser
  - method-override
  - ./handlers/verifyToken
  
  ###### Initialization
  
  - Sets up Express app.
  - Creates HTTP server.
  - Initializes WebSocket with [Socket.io](http://socket.io/).
  - Establishes connection to MongoDB.
  
  ###### Middleware
  
  - Sets view engine as Pug.
  - Defines static file directories.
  - Configures CORS to handle cross-origin requests.
  - Handles cookies.
  - Configures method overriding.
  - Parses incoming request bodies.
  
  ###### WebSocket Handling
  
  - Manages WebSocket connections.
  - Handles events like user connection, disconnection, and message broadcasting within groups.
  
  ###### Route Handling
  
  - Defines routes for user registration, home, notes, users, folders, and groups.
  - Uses middleware for token verification for protected routes.
  
  ###### 2. `registrationRoutes.js`
  
  Defines routes related to user registration and login.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **GET** `/registration/new`: Renders user registration form.
  - **POST** `/registration/new`: Creates a new user.
  - **GET** `/registration/login`: Renders login form.
  - **POST** `/registration/login`: Authenticates user login.
  
  ###### 3. `homeRoutes.js`
  
  Defines routes related to the home page and user dashboard.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **GET** `/`: Renders the home page.
  - **GET** `/logout`: Logs out the user.
  - **GET** `/friends`: Renders the friends page.
  - **GET** `/dashboard`: Renders the user dashboard.
  
  ###### 4. `noteRoutes.js`
  
  Defines routes related to note management.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **GET** `/`: Retrieves all notes for the user.
  - **GET** `/random-note`: Retrieves a random note.
  - **GET** `/:id`: Retrieves a specific note by ID.
  - **PUT** `/:id`: Updates a note by ID.
  - **POST** `/:userId/:folderId`: Creates a new note for the specified user and folder.
  
  ###### 5. `userRoutes.js`
  
  Defines routes related to user management.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **POST** `/add-friend`: Adds a friend for the user.
  - **GET** `/:id`: Retrieves user information by ID.
  - **PUT** `/:id`: Updates user information by ID.
  - **DELETE** `/:id`: Deletes user by ID.
  - **GET** `/:id/edit`: Retrieves user edit form by ID.
  - **GET** `/:id/:folderId`: Retrieves user dashboard by user ID and folder ID.
  
  ###### 6. `folderRoutes.js`
  
  Defines routes related to folder management.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **GET** `/`: Retrieves all folders.
  - **POST** `/:userId/:folderId`: Creates a new folder for the specified user and folder.
  
  ###### 7. `groupRoutes.js`
  
  Defines routes related to group management.
  
  ###### Dependencies
  
  None
  
  ###### Routes
  
  - **GET** `/`: Retrieves all groups.
  - **POST** `/`: Creates a new group.
  - **GET** `/new`: Retrieves form to create a new group.
  - **GET** `/:id/edit`: Retrieves form to edit a group by ID.
  - **GET** `/:id/chat`: Retrieves chat page for a group by ID.
  - **GET** `/:id/:folderId`: Retrieves group dashboard by group ID and folder ID.
  - **GET** `/:id`: Retrieves group information by ID.
  - **PUT** `/:id`: Updates group information by ID.
  - **PATCH** `/:id`: Partially updates group information by ID.
  - **DELETE** `/:id`: Deletes group by ID.
  

# Database Schema Documentation
  
  This section provides detailed documentation for the database schema used in the application, including the models `Folder`, `Group`, `Note`, and `User`.
  
  ###### 1. Folder
  
  ###### Schema Definition
  
  ```jsx
  const FolderSchema = new mongoose.Schema({
      name: { type: String, required: true },
      parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
      notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
      subfolders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
  });
  
  ```
  
  ###### Description
  
  - `name`: The name of the folder. Required field.
  - `parentId`: The ID of the parent folder, if applicable.
  - `notes`: Array of IDs referencing notes associated with this folder.
  - `subfolders`: Array of IDs referencing subfolders of this folder.
  - `owner`: The user who owns this folder, referenced by their ID.
  - `createdAt`: Timestamp indicating when the folder was created.
  
  ###### 2. Group
  
  ###### Schema Definition
  
  ```jsx
  const GroupSchema = new mongoose.Schema({
      name: { type: String, required: true },
      creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
      createdAt: { type: Date, default: Date.now }
  });
  
  ```
  
  ###### Description
  
  - `name`: The name of the group. Required field.
  - `creator`: The user who created the group, referenced by their ID.
  - `members`: Array of user IDs referencing members of the group.
  - `dashboard`: The folder serving as the dashboard for the group, referenced by its ID.
  - `createdAt`: Timestamp indicating when the group was created.
  
  ###### 3. Note
  
  ###### Schema Definition
  
  ```jsx
  const NoteSchema = new mongoose.Schema({
      owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
      title: { type: String, required: true },
      content: { type: String, required: true },
      folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
      createdAt: { type: Date, default: Date.now },
      importance: { type: Number, default: 0 },
      assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      duration: { type: Number }, // Assuming duration in minutes
      startsAt: { type: Date },
      completed: { type: Boolean, default: false },
      nominations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }]
  });
  
  ```
  
  ###### Description
  
  - `owner`: The user who owns this note, referenced by their ID. Required field.
  - `title`: The title of the note. Required field.
  - `content`: The content of the note. Required field.
  - `folderId`: The ID of the folder where the note belongs, if applicable.
  - `createdAt`: Timestamp indicating when the note was created.
  - `importance`: Importance level of the note, default is 0.
  - `assignees`: Array of user IDs referencing users assigned to the note.
  - `duration`: Duration of the note, assuming in minutes.
  - `startsAt`: Timestamp indicating when the note starts.
  - `completed`: Boolean indicating whether the note is completed.
  - `nominations`: Array of IDs referencing rewards nominated for this note.
  
  ###### 4. User
  
  ###### Schema Definition
  
  ```jsx
  const UserSchema = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }],
      dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
      friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  });
  
  ```
  
  ###### Description
  
  - `username`: The username of the user. Required field.
  - `email`: The email address of the user. Required field.
  - `password`: The password of the user. Required field.
  - `createdAt`: Timestamp indicating when the user was created.
  - `achievements`: Array of IDs referencing rewards achieved by the user.
  - `dashboard`: The folder serving as the user's dashboard, referenced by its ID.
  - `friends`: Array of user IDs referencing the user's friends.

# Controllers documentation
  
  ###### 1. `dashboardController`
  
  Handles rendering user and group dashboards.
  
  ###### Functions:
  
  - `getUserDashboard(req, res)`: Renders the user dashboard with folders and notes.
  - `getGroupDashboard(req, res)`: Renders the group dashboard with folders and notes.
  
  ---
  
  ###### 2. `folderController`
  
  Manages operations related to folders.
  
  ###### Functions:
  
  - `getAllFolders(req, res)`: Retrieves and renders all user folders.
  - `createFolderController(req, res)`: Creates a new folder and adds it to the parent folder.
  
  ---
  
  ###### 3. `groupController`
  
  Deals with group-related operations.
  
  ###### Functions:
  
  - `getAllGroups(req, res)`: Retrieves and renders all groups.
  - `createGroup(req, res)`: Creates a new group.
  - `getCreateGroupForm(req, res)`: Renders the form to create a group.
  - `getGroupInfo(req, res)`: Retrieves and renders information about a specific group.
  - `updateGroup(req, res)`: Updates group information.
  - `partialUpdateGroup(req, res)`: Partially updates group information.
  - `deleteGroup(req, res)`: Deletes a group.
  - `getEditGroupForm(req, res)`: Renders the form to edit group details.
  - `getChat(req, res)`: Renders the group chat view.
  
  ---
  
  ###### 4. `homeController`
  
  Handles rendering the home page and user-related views.
  
  ###### Functions:
  
  - `renderHomePage(req, res)`: Renders the home page with groups, notes, and friends.
  - `logoutController(req, res)`: Logs out the user.
  - `friendsPage(req, res)`: Renders the friends page.
  - `renderDashboard(req, res)`: Renders the user dashboard.
  
  ---
  
  ###### 5. `noteController`
  
  Manages operations related to notes.
  
  ###### Functions:
  
  - `allUserNotes(req, res)`: Retrieves and renders all user notes.
  - `oneNoteController(req, res)`: Retrieves and renders information about a specific note.
  - `createNoteController(req, res)`: Creates a new note.
  - `updateNote(req, res)`: Updates note information.
  - `randomNote(req, res)`: Retrieves a random note.
  
  ---
  
  ###### 6. `registrationController`
  
  Handles user registration and login.
  
  ###### Functions:
  
  - `createUser(req, res)`: Creates a new user account.
  - `getCreateUserForm(req, res)`: Renders the user registration form.
  - `loginController(req, res)`: Logs in the user.
  
  ---
  
  ###### 7. `userController`
  
  Manages user-related requests.
  
  ###### Functions:
  
  - `getAllUsers(req, res)`: Retrieves and renders all users.
  - `getUserInfo(req, res)`: Retrieves and renders information about a specific user.
  - `updateUser(req, res)`: Updates user information.
  - `deleteUser(req, res)`: Deletes a user account.
  - `getEditUserForm(req, res)`: Renders the form to edit user details.
  - `addFriend(req, res)`: Adds a friend to the user's friend list.
  

# Handlers and Static functionality
  
  ###### 1. `userCookie`
  
  This handler manages the setting of the token cookie for user authentication.
  
  ###### 2. `userHandler`
  
  This handler module facilitates various user-related database operations such as saving a new user, updating a user's information, and updating specific fields of a user's document in the database.
  
  ###### 3. `verifyToken`
  
  This handler verifies the authenticity of the user's token for authentication purposes. It ensures that the token provided in the request is valid and matches the expected format before allowing access to protected routes.
  
  ###### Static Documentation:
  
  ###### 1. `chat.js`
  
  This JavaScript file governs the WebSocket communication for the chat feature of the application. It establishes a connection to the server via WebSocket, emits and listens for chat messages, and updates the UI accordingly to display the chat messages in real-time.
  

# Pug Templates Documentation
  
  ###### 1. `layout.pug`
  
  This layout template provides the basic structure for all pages in the application, including the header with navigation links, a main content area, and a footer displaying copyright information.
  
  ###### 2. `login.pug`
  
  This template renders the login page, featuring a form for users to input their credentials. It also includes a link to register for a new account if the user does not have one yet.
  
  ###### 3. `home.pug`
  
  This template displays the user's home page, showing their groups, notes, profile information, and friends. It allows users to navigate to specific groups or notes, view their profile, and add friends.
  
  ###### 4. `error.pug`
  
  This template renders an error page when an error occurs, displaying the error status code and message. It provides a simple layout with a message explaining the error and a link to navigate back to the homepage.
  
  ###### 5. `dashboard.pug`
  
  This template presents the user's dashboard, showcasing folders and notes within a specific folder. It allows users to create new folders and notes, navigate to subfolders, and view existing notes.
  
  ###### 6. `chat.pug`
  
  This template enables the live chat feature for a specific group. It displays the chat messages, provides an input field for users to type messages, and includes scripts to handle real-time communication via WebSocket.
  
  ###### 7. `folders-list.pug`
  
  This template displays a list of folders belonging to the current user. It provides links to navigate to each folder's detailed view.
  
  ###### 8. `create-group.pug`
  
  This template renders a form for creating a new group. Users can input the group name and select members from their friends list to add to the group.
  
  ###### 9. `edit-group.pug`
  
  This template allows users to edit an existing group's details, including its name and members. The form is pre-populated with the group's current information.
  
  ###### 10. `group-info.pug`
  
  This template presents detailed information about a specific group, including its name, creator, members, and options to view its dashboard, edit the group, or delete it.
  
  ###### 11. `groups-list.pug`
  
  This template displays a list of groups that the current user is a member of. It provides links to navigate to each group's detailed view.
  
  ###### 12. `note.pug`
  
  This template shows detailed information about a specific note, including its title, content, importance, and completion status. It also provides an option to edit the note.
  
  ###### 13. `notes-list.pug`
  
  This template presents a list of notes belonging to the current user. Each note is displayed with its title and content, allowing users to click and view detailed information.
  
  ###### 14. `create-user.pug`
  
  This template renders a form for creating a new user account. Users need to input their desired username, email, and password to register for an account.
  
  ###### 15. `edit-user.pug`
  
  This template allows users to edit their user profile details, including their username, email, and password. The form is pre-filled with the user's current information.
  
  ###### 16. `friends.pug`
  
  This template displays a list of the current user's friends. It provides options to view each friend's profile and add new friends by entering their user ID.
  
  ###### 17. `user-info.pug`
  
  This template presents detailed information about a specific user, including their username, email, achievements (if any), and notes. It also includes functionality to copy the user's ID to the clipboard.
  
  ###### 18. `users-list.pug`
  
  This template shows a list of users registered in the system. Each user is displayed with their username, and users can click on each username to view detailed user information.
  
  These Pug templates collectively provide various functionalities for users to manage their groups, notes, and user accounts within the application.
  

# Sum-up
  
  #### Leonotes Documentation
  
  ###### Overview
  
  Leonotes is a web application designed to facilitate note-taking, group organization, and social interaction among users. The application allows users to create and manage notes, and folders; to organize their notes, join or create groups, add friends, and interact through live chat within groups.
  
  ###### Features
  
  1. **User Authentication**: Users can register for an account with a unique username, email, and password. They can then log in to access their account and the application's features.
  2. **Notes Management**: Users can create, edit, and delete notes. Each note can have a title, content, importance level, and completion status.
  3. **Folders Organization**: Users can organize their notes by creating folders. They can create, edit, and delete folders to categorize and manage their notes efficiently.
  4. **Group Collaboration**: Users can join existing groups or create new ones. Groups allow users to collaborate on specific topics, share notes, and engage in discussions through live chat.
  5. **Friends Network**: Users can add other users as friends. This feature enables social interaction within the application and facilitates sharing notes and joining groups together.
  
  ###### User Interface
  
  ###### Home Page
  
  The home page serves as the central hub for users to access various features of the application. It displays a dashboard with sections for managing groups, notes, user profiles, and friends. Users can navigate to different sections of the application from here.
  
  ###### Group Pages
  
  Group pages provide detailed information about specific groups. Users can view the group's name, creator, and members, and access its dashboard for group-specific activities. They can also interact with other group members through live chat.
  
  ###### User Profile
  
  The user profile page displays detailed information about a specific user, including their username, email, achievements, and notes. Users can edit their profile details and view their friends list from this page.
  
  ###### Notes Management
  
  The application offers comprehensive features for managing notes. Users can create, edit, and delete notes, organize them into folders, and set their importance level and completion status.
  
  ###### Getting Started
  
  To use Leonotes, users need to register for an account using a unique username, email, and password. Once logged in, they can start creating notes, organizing them into folders, joining groups, and adding friends.
  
  ###### Conclusion
  
  Leonotes offers a user-friendly platform for note-taking, group collaboration, and social interaction. With its intuitive interface and comprehensive features, it aims to streamline the process of organizing information, facilitating collaboration, and fostering a vibrant community of users.
  

# Set-up
  
  ###### Prerequisites
  
  - Node.js installed on your system ([Download Node.js](https://nodejs.org/))
  - MongoDB installed and running ([Download MongoDB](https://www.mongodb.com/try/download/community))
  
  ###### Installation Steps
  
  1. **Clone the Repository**:
      
      ```bash
      git clone https://github.com/LevkoBe/Notes.git
      ```
      
  2. **Install Dependencies**:
      
      ```bash
      cd leonotes
      npm install
      ```
      
  3. **Start the Server**:
      
      ```bash
      npm start-two
      ```
      
  4. **Access the Application**:
      - Open your web browser and navigate to `http://localhost:300` to access Leonotes.
  
  ###### Development Workflow
  
  - **Frontend**: The frontend code is located in the `views/` directory, primarily written in Pug (formerly Jade) templates along with CSS stylesheets.
  - **Backend**: The backend code is located in the `routes/` and `models/` directories, written in Node.js with Express.js for routing and MongoDB for data storage.      
  - **Debugging**: Use `console.log()` statements for debugging backend code. For frontend debugging, use browser developer tools.
  
  ###### Conclusion
  
  You are now ready to develop on Leonotes! Familiarize yourself with the codebase, make changes, and contribute to the project's development. If you encounter any issues, refer to the documentation or seek assistance from the project maintainers. Happy coding!

# Video-quick-showcase

https://github.com/LevkoBe/Notes/assets/118983753/0e7e7b4a-d463-44e1-b893-4f444190046a

