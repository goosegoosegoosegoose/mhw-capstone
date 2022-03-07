## MHW Capstone for Springboard
---------------------------------

This app is for current Monster Hunter: World players to keep track of their progress. Features include informational pages on various items/monsters,  toggling whether or not you have crafted various equipment or killed various monsters, a profile page, and a mock gearing system in which you choose from what you have marked done to get an aggregate stat and skill sheet.

## Tech:
- The API used is https://docs.mhw-db.com/
- For backend I used Express for the framework and Axios for browser requests
- For frontend I used React for the UI and material-ui for the tables
  - react-router-dom for routing
  - react-bootstrap for most of the styling
- I populated the local database with multiple get calls to the API, then parsing and inserting/updating the data

## Challenges:
- Figuring out how to structure the database/how to populate it accordingly
- Manually inserting images/placeholders when API did not provide
- Providing conditionals to check for which weapon type was being requested, then providing only the necessary information (from certain many-to-many tables) from the backend to the frontend.
- useEffect and useState magic
- Loading toggle button states based on requested currentUser info, then updating state when toggled. 
- The user docoration count + DecoCounter (Plus/Minus) buttons
- The GearingPage as a whole

## How to use (Users):
- Please first sign up byt setting your username, email, and password
- Log in using username and password
- Click any button on the homepage, or navigate using the navbar above
- Edit email if need be with the edit email page
- If a MHW player, simulate/record your progress by toggling monsters you've killed, gear/weapons you've crafted, and the amount of unique decorations you have. 
  - If not at least craft one of each type of armor (head, chest, gloves, waist, legs) and a weapon so you can try the mock gearing page
- On the gearing page, fill out all the dropdown forms, then choose decorations til each says theres 0 slots available or the checkboxes are greyed out (if it says -1 slots available, you are over cap and should unselect another of the decoration type).
- Stats pages changes depending on which gear you select
- Please enjoy

## How to use (Developers):
- NOTE: I use windows so my git bash commands may be wonky
1. Open git bash and cd into backend
2. Run npm install backend package.json
3. Run psql -f mhw.sql to create the database
4. Run nodemon server.js to populate the database and start the backend server
6. Open another git bash window and cd into frontend
6. Npm install frontend package.json
7. Run npm start
8. Webpage should open in browser and app should work

## How to test:
- Run "jest -i" to run backend tests; without -i addon, tests break
- Run "npm test a" to run all frontend jest tests

## Conclusion:
Pretty fun project to try to recreate MHW's gearing system with my current skills and API limitations. Not pretty but funtional. Please enjoy.