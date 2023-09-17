# **Blog API Application Project**

## Tech Stack

Node, Express, MongoDB, Mongoose, JWT
Modules - express,mongoose,dotenv,bcryptjs@2.4.3,jsonwebtoken,multer
Photo Storage - Cloudinary

# API FEATURES

- Authentication & Authorization
- Post CRUD operations
- A user can block different users
- A user who block another user cannot see posts
- Last date a post was created
- Check if a user is active or not
- Check last date a user was active
- A user can follow and unfollow another user
- Get following and followers count
- Get total profile viewers count
- Get posts created count
- Get blocked counts
- Update password
- Profile photo uploaded
- A user can close his/her account

# ENDPOINTS

- [API Authentication](#API-Authentication)

  - [ Register a new API client](#Register-a-new-API-client)
  - [ login](#User-Login)

- [Users](#api)

  - [Get my profile](#get-my-profile)
  - [Get all users](#Get-all-users)
  - [View a user profile Count](#view-a-user-profile)
  - [Following a user](#Following-a-user)
  - [#UnFollowing-a-user](#UnFollowing-a-user)
  - [Update user password](#Update-user-password)
  - [Update your profile](#Update-your-profile)
  - [Block another user](#Block-user)
  - [Unblock another user](#Unblock-user)
  - [Delete your account](#Delete-your-account)
  - [Upload Profile Photo](#Upload-Profile-Photo)

- [Posts](#Posts-API-Refeference)

  - [Create Post](#Create-Post)
  - [Get All Posts](#Get-All-Posts)
  - [Get Single Post](#Get-Single-Post)
  - [Toggle Post like](#Toggle-Post-like)
  - [Toggle Post dislike](#Toggle-Post-dislike)
  - [Update Post](#Update-Post)
  - [Delete Post](#Delete-Post)

- [Comments](#Comment-API-Reference)
  - [Create comment](#Create-Comment)
  - [Update post](#Update-Comment)
  - [Delete post](#Delete-Comment)

## Run the project

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
   node server.js
```

## Environment Variables

The mandatory enviroment variable require to run the project is MONGODB_URL, and the additional variables are 
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRECT_KEY, this additional variables are used for file uploading feature


# API Authentication

Some endpoints may require authentication for example. To create a create/delete/update post, you need to register your API client and obtain an access token.

The endpoints that require authentication expect a bearer token sent in the Authorization header.

**Example**:

`Authorization: Bearer YOUR TOKEN`

## **Register a new API client**

```http
POST /api/v1/users/register
```
| Parameter        | Type     | Description   | 
| :--------------- | :------- | :------------ |
|  firstname | string | Your first name    |
| lastname   | string | Your lastname   | 
| email      | string | Your email | 
|Password    |string  |Your password|

The request body needs to be in JSON format.

# **API Reference**

## **User Login**

```http
POST /api/v1/users/login
```

| Parameter        | Type     | Description   | 
| :--------------- | :------- | :------------ |
| authentication | string | Your token    |
| email          | string | Your email    | 
| password       | string | Your password | 

Example request body:

```javascript
{
  "email":"your email"
  "password":"your password"
}
```

## **get my profile**

```http
GET /api/v1/users/profile
```

| Parameter        | Type     | Description |
| :--------------- | :------- | :---------- | 
| `authentication` | `string` | Your token  |

## **Get all users**

```http
GET /api/v1/users/users
```

| Parameter        | Type     | Description | 
| :--------------- | :------- | :---------- | 
| authentication | string | Your token  |

## **view a user profile**

```http
GET /api/v1/users/profile-viewers/:id
```

| Parameter        | Type     | Description                                 | 
| :--------------- | :------- | :------------------------------------------ | 
| authentication | string | Your token                                  | 
| id             | string | ID of the user you want to view his profile | 

#### Following a user

```http
GET /api/v1/users/following/:id
```

| Parameter        | Type     | Description                       |
| :--------------- | :------- | :-------------------------------- |
| authentication | string | Your token                        | 
| id             | string | ID of the user you want to follow | 

## **UnFollowing a user**

```http
GET /api/v1/users/unfollowing/:id
```

| Parameter        | Type     | Description                       | 
| :--------------- | :------- | :-------------------------------- | 
| authentication | string | Your token                        | 
| id             | string | ID of the user you want to follow |

## **Update user password**

```http
PUT /api/v1/users/update-password
```

| Parameter        | Type     | Description         | 
| :--------------- | :------- | :------------------ | 
| authentication | string | Your token          | 
| password       | string | Enter your password | 

Example request body:

```javascript
{
  "password":"value"
}
```

## **Update your profile**

```http
PUT /api/v1/users
```

| Parameter        | Type     | Description          | 
| :--------------- | :------- | :------------------- | 
| authentication | string | Your token           | 
| email          | string | Enter your email     | 
| firstname      | string | Enter your firstname | 
| lastname       | string | Enter your lastname  |

Example request body:

```javascript
{
  "email":"value",
  "firstname":"value",
  "lastname":"value",
}
```

## **Block another user**

```http
PUT /api/v1/users/block/:id
```

| Parameter        | Type     | Description                      | 
| :--------------- | :------- | :------------------------------- | 
| authentication | string | Your token                       | 
| id             | string | Id of the user you want to block |

## **Unblock user**

```http
PUT /api/v1/users/unblock/:id
```

| Parameter        | Type     | Description                        | 
| :--------------- | :------- | :--------------------------------- | 
| authentication | `string | Your token                         | 
| id             | `string | Id of the user you want to unblock | 


## **Delete your account**

```http
  DELETE /api/v1/users/delete-account
```

| Parameter        | Type     | Description | 
| :--------------- | :------- | :---------- | 
| authentication | string | Your token  | 

## **Upload Profile Photo**

```http
  DELETE /api/v1/users/profile-photo-upload
```

| Parameter        | Type     | Description     |
| :--------------- | :------- | :-------------- |
| authentication | string | Your token      | 
| profilePhoto   | string | Image to upload |

# **Posts API Refeference**

## **Create Post**

```http
  POST /api/v1/posts
```

| Parameter        | Type     | Description        |
| :--------------- | :------- | :----------------- | 
| authentication | string | Your token         | 
| title          | string | Post title         | 
| description`    | string | Post description   | 
| category`       | string | ID of the category |
| photo          | string | Image of the post  | 

Example request body:

```javascript
{
  "title":"value",
  "description":"value",
  "category":"value",
  "photo":"photo",
}
```

## **Get All Posts**

```http
  GET /api/v1/posts
```

| Parameter        | Type     | Description | 
| :--------------- | :------- | :---------- | 
| authentication | string | Your token  |

## **Get Single Post**

```http
  GET /api/v1/posts/:id
```

| Parameter        | Type     | Description    | 
| :--------------- | :------- | :------------- |
| authentication | string | Your token     |
| id             | string | ID of the post | 

## **Toggle Post like**

```http
  GET /api/v1/postslikes/:id
```

| Parameter        | Type     | Description    |
| :--------------- | :------- | :------------- |
| authentication | string | Your token     | 
| id             | string | ID of the post | 

## **Toggle Post dislike**

```http
  GET /api/v1/posts/dislikes/:id
```

| Parameter        | Type     | Description    |
| :--------------- | :------- | :------------- | 
| authentication | string | Your token     | 
| id             | string | ID of the post |

## **Update Post**

```http
  PUT /api/v1/posts/:id
```

| Parameter        | Type     | Description             | 
| :--------------- | :------- | :---------------------- | 
| authentication | string | Your token              | 
| id             | string | ID of the post          | 
| title          | string | title of the post       | 
| description    | string | description of the post | 
| category       | string | category of the post    |
| photo          | string | photo of the post       | 

Example request body:

```javascript
{
  "title":"value",
  "description":"value",
  "category":"value",
  "photo":"photo",
}
```

## **Delete Post**

```http
  GET /api/v1/posts/dislikes/:id
```

| Parameter        | Type     | Description    | 
| :--------------- | :------- | :------------- | 
| authentication | string | Your token     | 
| id             | string | ID of the post | 

# **Comment API Reference**

## **Create Comment**

```http
  POST /api/v1/comments/:id
```

| Parameter        | Type     | Description    |
| :--------------- | :------- | :------------- | 
| authentication | string | Your token     | 
| id             | string | ID of the post | 

## **Delete Comment**

```http
  DELETE /api/v1/comments/:id
```

| Parameter        | Type     | Description       | 
| :--------------- | :------- | :---------------- | 
| authentication | string | Your token        |
| id             | string | ID of the comment |

## **Update Comment**

```http
  PUT /api/v1/comments/:id
```

| Parameter        | Type     | Description    | 
| :--------------- | :------- | :------------- |
| authentication | string | Your token     | 
| id            | string | ID of the post | 

## Feedback

If you have any feedback, please reach out to us at tilkireddy@gmail.com



