Objective 
This assignment builds on your previous work in containerizing and deploying applications 
(Assignments 1–3). It introduces a front-end interface for your API and high availability (HA) at 
the application level by load balancing the front-end application. You will develop a React/ Angular / Vue 
etc front-end for the /students and /subjects endpoints and implement load balancing with 
NGINX or HAProxy across at least three front-end nodes, displaying the responding node on the 
homepage. 
Prerequisites 

Tasks 
1. Front-End Development 
Develop a front-end application using Angular to interact with the /students and /subjects endpoints 
of your API (from Assignment 1). The front-end will be containerized and deployed in a high
availability setup. 
1.1. Front-End Implementation 
• Homepage: 
o Create a homepage with two buttons: "Students" and "Courses". 
o When the "Students" button is clicked, display a list of at least 10 students (name 
and enrolled program) fetched from the /students endpoint. 
o When the "Courses" button is clicked, display a list of subjects for the Software 
Engineering program (Year 1–4) fetched from the /subjects endpoint. 
• Responding Node Indicator: 
o Display the name of the front-end node (e.g., frontend1, frontend2, or frontend3) 
that serves the page on the homepage. 
o Use a custom response header (e.g., X-Node-ID) from the front-end server to 
identify the responding node. 
• Dockerization: 
o Create a Dockerfile for the front-end. 
o Integrate the front-end into your docker-compose.yml (from Assignment 3) as 
multiple services for load balancing. 
2. Front-End High Availability 
2 
Implement high availability for the front-end application using NGINX or HAProxy as a load 
balancer to distribute traffic across at least three front-end instances, which consume a single 
API instance, using the round-robin algorithm. 
2.1. Load Balancer Setup 
• Choose a Tool: Select either NGINX or HAProxy. 
• Configuration: 
o Create a configuration file (nginx.conf for NGINX or haproxy.cfg for HAProxy). 
o Configure the load balancer to distribute traffic across three front-end instances 
(e.g., running on ports 3000, 3001, 3002). 
o Use the round-robin load balancing algorithm. 
o Implement health checks to ensure only healthy front-end instances receive 
traffic. 
o Add a custom header (e.g., X-Node-ID) to front-end responses to indicate the 
responding node (e.g., frontend1, frontend2, frontend3). 
• Docker Integration: 
o Update your docker-compose.yml to include: 
▪ The load balancer container. 
▪ Three front-end instances. 
▪ A single API instance (from Assignment 3). 
▪ The database container (e.g., MySQL). 
o Ensure proper networking between the load balancer, front-end, API, and 
database containers. 
2.2. Deployment and Testing 
• Deploy: 
o Launch the multi-container environment on your AWS Free Tier EC2 Ubuntu 
instance using Docker Compose. 
o Expose the load balancer’s port (e.g., 80) to the public, making the front-end 
accessible. 
• Test: 
o Verify that all three front-end instances receive traffic by checking container logs 
and the X-Node-ID header displayed on the homepage. 
o Confirm the round-robin algorithm by refreshing the homepage and observing 
different node IDs. 
o Simulate a failure by stopping one front-end container and confirm that the load 
balancer redirects traffic to remaining instances without downtime. 
o Test both API endpoints (/students and /subjects) via the front-end buttons to 
ensure correct data display. 
2.3. Documentation 
• Update your GitHub repository’s README.md (from Assignment 3) to include: 
o Instructions for building and running the front-end containers. 
3 
o Details of the load balancer setup, including the round-robin algorithm and health 
checks. 
o Instructions for deploying the environment on AWS. 
o Troubleshooting tips for common issues (e.g., front-end not loading, load balancer 
errors, header not appearing). 
3. Version Control and Docker Registry 
• Commit and push all changes (Dockerfile, docker-compose.yml, front-end code, load 
balancer configs, updated README.md) to your Assignment 3 GitHub repository. 
• Upload the Docker images (front-end, API, load balancer) to Docker Hub and include the 
repository link in your README.md. 
4. Submission Requirements 
Submit via email to goodiel.moshi@udom.ac.tz by the assignment deadline: 
• URL to your updated GitHub repository containing: 
o Dockerfile (for API and front-end), docker-compose.yml, load balancer 
configuration. 
o Front-end source code. 
o Revised README.md with front-end and load balancer instructions. 
• Publicly accessible URL for the load-balanced front-end: http://<ec2-public-ip>. 
• A screenshot (load_balancer_ps.png) showing the running containers (docker ps output). 
• A sample log file (load_balancer_logs.txt) containing logs from the load balancer, front
end, and API containers. 
• Docker Hub URL for your images (in the README.md). 
Notes 
• Adhere strictly to AWS Free Tier limits (t2.micro/t3.micro EC2 instance, 8–10 GB 
storage). 
• Ensure all containers run error-free and remain stable during testing. 
• Test failover scenarios thoroughly to confirm high availability. 
• Use clear, descriptive commit messages in your repository. 
• The deployed API from Assignment 3 must remain operational throughout this 
assignment.

use angular not react ( i dont know react i only know angular so build the simple application with angular ) 