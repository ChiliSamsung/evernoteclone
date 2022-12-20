**Evernote Clone**

This is a personal project of mine for learning full stack web development.
It uses React, Node, Express, and MongoDB. It seeks to replicate features from
the popular notetaking application Evernote. I will add more features when I have
interest in doing so.

How to run the application locally:

1. Fetch the code locally
2. Run "npm install" to install all the Node dependencies listed in package.json
3. Make sure you have Mongo Daemon process running. You want to execute "mongod.exe"
4. To start the server, start up with "node server/server.js" to run the server file. You
   can also use "nodemon" locally if you want to, I prefer using it locally.
5. Then to start the react app, enter the "client" folder and run "npm start"
6. Now the app should function

How to run the application on Heroku

1. First, need to have Mongo DB Atlas instance which you can connect to in order to host
   your DB on the web. Once the DB is made, make an account for that DB with a password.
2. Then, on the application get the URL you'll need to connect to your DB with native drivers
   for Node. For example, jot down the command here like:
   "mongodb+srv://test-admin:<password>@cluster0.lnz11yi.mongodb.net/?retryWrites=true&w=majority"
3. For running the server, make sure to replace the connection string from localhost to the
   MongoDB Atlas instance above. Test that it works.
4. The primary package.json has a "scripts" section which tells how to start the server. If you have
   a different directory structure then update it in there. Also, some commands in "index.js" make sure
   that Node and React can play well together. For example:

```
//have Node serve the files for our built React app
app.use(express.static(path.resolve(\_\_dirname, "../client/build")));
```

5. Make sure you are on a local git repo. If not, you can run "git init". Make sure to add .gitignore on the
   node_modules directory.
6. Login to Heroku from terminal
7. Run the following commands to make a new remote Heroku repo, add files to it, then push to it.

```
heroku git:remote -a <insert-your-app-name-here>
git add .
git commit -am "Deploy app to Heroku"
git push heroku <current-branch-name>
```

8. Now the application should be able to run on Heroku's end. You can then open it up.
