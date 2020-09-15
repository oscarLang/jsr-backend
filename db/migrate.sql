DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reports;
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS reports (
    week INT NOT NULL,
    text_data VARCHAR(255) NOT NULL,
    UNIQUE(week)
);

INSERT INTO reports (week, text_data) VALUES (1, "## Available Scripts
    In the project directory, you can run:

    ### `npm install`
    Install all the dependencies of the project.

    ### `npm start`
    Runs the app in the development mode.Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

    ### `npm build`
    Builds the app for production to the `build` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!");
