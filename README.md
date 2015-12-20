##Tradeshow Task Tracker
This is an app I created as part of General Assembly's Web Development Immersive program.  It was my 4th and final project in the course. As a former event manager, I wanted to create an app that would help manage the multiple due dates related to event planning. Additionally, I wanted to create a calendar that would show all dates and send reminders of upcoming due dates. As a stretch goal, I wanted to create a file and image storing tool to keep scanned order forms and images for each event. Due to time constraints, I wasn't able to incorporate the file storage or all calendar features, but I plan to continue working on this project as I have time.

I worked on completing the back end first.  After moving to the front end development, I created all templates for all forms and buttons I would need.  I then added log-in, registration, and log-out before moving on to incorporate CRUD for events.  After CRUD was working for events, I did the same for tasks. I added the calendar last.

#### Unsolved Problems
* Adding images and styling elements
* In line editing for event and task detail rather than modal form
* Nesting tasks to expand under their associated event in the event list
* Expand the calendar view to include all event dates and task due dates in one view
* debug the calendar view and event list so they empty upon sign out

#### Major Hurdles
Time was the biggest hurdle in this project.  I ran out of time to incorporate full calendar functionality, file storage capability or any styling elements.  My next steps will be to debug the duplicated lists and calendar dates after sign out and signing back in.  I will also add in-line editing to replace modals for edit and add nesting to the event list to show tasks for each event.

#### Link to back end repo
https://github.com/christinemoses/project4-back-end

#### Link to deployed back end
https://warm-reef-5709.herokuapp.com/

#### Link to front end repo
https://github.com/christinemoses/project4-front-end

#### Link to deployed app
http://christinemoses.github.io/project4-front-end/

#### Technologies Used
* Ruby on Rails
* Javascript
* jQuery
* HTML
* CSS
* Bootstrap
* Git
* wireframe.cc

#### ERD
<img width="1088" alt="project4-erd" src="https://cloud.githubusercontent.com/assets/14372323/11906137/7bfe23ba-a598-11e5-8f11-c2061d1a924c.png">

#### Task tracker app screenshot
<img width="1280" alt="task-tracker-screenshot-1" src="https://cloud.githubusercontent.com/assets/14372323/11906205/da30dd06-a598-11e5-862a-e9eb925df65d.png">

#### Wireframe
![wireframe-list-view](https://cloud.githubusercontent.com/assets/14372323/11919841/139e952c-a72b-11e5-9ad0-284dc781485f.png)

#### User Stories

#####Roles:

* event managers who want to manage event planning tasks more efficiently

#####Personas:

* A person who wants to organize event planning tasks and due dates

#####Epics:

######minimum goals:
* create a user account
* returning user log into account
* create an event list
* add task lists and due dates associated to each event
* view full saved lists of events and tasks
* edit an event or task
* delete an event or task
* log off account

######stretch goals:
* integrate a calendar feature to view all event and task due dates
* integrate file saving feature to store scanned order forms and photos
* add more detail to activities
* auto log-in after successful registration
* in-line editing in task or event table
* nested tasks under event list
* add event budget features

#####Stories:

######As a visitor to the app:
* I can create an account

######As a registered app user:
* I can log in
* I can create/edit/delete events and tasks
* I can create/edit/delete event and task details and dates
* I can see saved event and task lists
* I can log out

