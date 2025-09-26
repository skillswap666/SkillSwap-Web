
  # Skill Swap Club Web App

  This is a code bundle for Skill Swap Club Web App. The original project is available at https://www.figma.com/design/b2aJ3vFhswCh9v8bZvw67t/Skill-Swap-Club-Web-App.

  ## Running the frontend

  Open terminal in skill-swap-frontend file

  ```
  cd skill-swap-frontend
  ```

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Running the backend

  Make sure you have installed Java 17
  
  Add .env file in the skill-swap-backend file

  Open terminal in skill-swap-backend file

  ```
  cd skill-swap-backend
  ```

  Run below for installing dependencies

  ```bash
  ./gradlew build          # macOS/Linux
  gradlew.bat build        # Windows
  ```
  
  Run below to start the backend

   ```bash
  .\gradlew.bat bootRun --args="--spring.profiles.active=dev"         # macOS/Linux
  .\gradlew.bat bootRun        # Windows
  ```

  ```bash
  ./gradlew bootRun          # macOS/Linux
  .\gradlew.bat bootRun        # Windows
  ```
  
  ## Add new functions

  - If you want to write some new functions, please first check the newest master branch by:

  ```
  git pull origin main
  ```

  - If you want to push your new codes, please create a new branch by:

  ```
  git checkout -b [new branch name]
  ```
  
  Then commit & push.

  - If you want to merge your function to master branch, please make a pull request, past all the checks, then merge.

## Connection to Database Fail (Max client connections reached)

  Try to run below to kill all the java progress, then restart

  ```
  taskkill /IM java.exe /F
  taskkill /IM gradle* /F
  ```
