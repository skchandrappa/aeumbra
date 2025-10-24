test
under folder 
I am creating an app that acts as uber for security personal. security guards can freelance for work and get assignments from seekers looking for event coverages. 
I want you to create a data model for this app. 
Database used : postgresql. 

Tables :
user  table :  helps with login and auth. 
profile table : Name address geo location and other demographics and also states user type  Guard/Consumer/Admin. 
setting tables : handles settings for the users including demographic verifications and security and privacy settings . 
post tables : where guards can  post thier work with pictures, videos containing updates. consumers can like and comment.
Bookings table : handles bookings of the guards for evennt types duration
Pricing table : that handles pricing of the guards based on the geo location and other  factors. 
Transactions table : transaction related to bookings and other required details. 
Reviews Table : table that handles reviews well as testimonials along with ratings. 
Compliant table : handles compiants and dispute resolutions. 
Verification tables  : that handles verifications of guards and consumers. 



create parent and child relational tables with primary and foreign keys and add attributes based on best of the knowledge, mainly aligned to uber, instagram or facebook.

draw a .sql file that can be excuted later after review
 

 -- ui prompt :

 Under Folder reactfrontend : 

 create a react application based on APP_FLOW_DIAGRAMS.md. Model the website based on UBER.com but black colour replaced with security blue. Add pictures realting to security. 

 1- Home page / Login Page : to prompt user for user id psswword or register. 
 2- Registration page for both guards and consumers.
 3- Once logged in User/Guard should be show a left side bar with settings and profile.
 	Show Pricing updates page for only ADMIN type Users. 
 	Show all the default settings and Profile completion requests as well as profile details under profile. 
 	 
 4- Bottom tabs should contain the following
    - For Guards. 
      Feed Page - Showing the feeds of others and option to post any new work.  
      Bookings Page : Calendar that shows requested bookings and an option to approve or reject with details of booking request.      
      Activity Page : Previous Bookings , Earnings so far etc. 
      Notifications : Any notifications for the Guards. 

    - for Consumer:
       Feed Page listing all the posts and work updates from the guards that also provides option to select the post owner and book for event. Interact with Posts , Like Comment and provide feedback. 
       Booking Page : Search for specific guard types and rthier reviews, get the listings of the guards with thier details and posts as a next page and Book for the event and confirms. Implement Dispute Resolution Flow option for each bookings.      
       Activity Page listing all the previous bookings and review requests.
       Notifications page : List out all review requests notifications and others.
 5- Create Payment & Transaction Flow with Dummy for now and with no real time integration. Add the fees and consider as booked once confirmed for booking. 

 6- Implement Admin flow for ADMIN users created from Back end and only show this pricing option in settings of ADMIn User. 

 7- On the Top right part provide option of services,about, Contact us that leads to a complete new page for contacts and  . Hardcode on any freelance security details 



  -H "Content-Type: application/json" \
  -d '{
    "email": "guard@example.com",
    "password": "guardpassword123",
    "first_name": "Guard",
    "last_name": "User",
    "user_type": "guard",
    "phone_number": "+1234567891"
  }'

  echo "=== Testing Login Without Response Model ===" && curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'


https://app.netlify.com/projects/sparkling-pika-64b5bf/deploys/68fad34eaa071e000869a56d
