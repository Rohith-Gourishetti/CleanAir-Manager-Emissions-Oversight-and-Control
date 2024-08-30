# CleanAir-Manager-Emissions-Oversight-and-Control


deploy-link: https://airmonitor.onrender.com

Description: 

**Problem Statement:** Develop a solution to monitor and control emissions, aiming to mitigate climate change.

**Proposed Methodology:** Our model focuses on monitoring emissions from two sources: individual locations and registered companies. Location-based monitoring is achieved by collecting data through input addresses or real-time geolocation, while company monitoring is enabled by registering companies with their latitude and longitude coordinates. The model uses the OpenWeather API to fetch hourly data on emissions like CO2, SO2, etc., and calculates the Air Quality Index (AQI) to classify areas into safe, unsafe, or dangerous zones. 

For control, if emissions exceed the threshold, an alert email is sent to the registered company. Companies are registered through a localhost platform where employees must approve their participation. Once accepted, company locations are displayed on Bing Maps, and updates are shared via email. The platform also offers users access to location-based emissions data, news from World News API, and articles related to climate change, all managed through MongoDB for real-time data on users, companies, and emission levels.
