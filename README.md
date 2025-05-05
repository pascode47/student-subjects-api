by paschal bizulu T21-03-08803

# Student Subjects API

This project is a simple API that provides information about students and subjects associated with a Software Engineering program. It is built using Node.js and Express, with a relational database for data storage.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Backup Schemes Explained

Here's an explanation of three common backup schemes:

### 1. Full Backup

*   **Execution:** Copies all selected data every time the backup runs. To restore, you only need the latest full backup set.
*   **Advantages:**
    *   Simple to understand and manage.
    *   Fastest restore time as all data is in one backup set.
*   **Disadvantages:**
    *   Requires the most storage space.
    *   Takes the longest time to complete the backup process.
    *   Can be resource-intensive on the server during backup.

### 2. Incremental Backup

*   **Execution:** Backs up only the data that has changed *since the last backup* (which could be a full or another incremental backup). A full restore requires the last full backup and *all* subsequent incremental backups in the correct order.
*   **Advantages:**
    *   Fastest backup time (after the initial full backup).
    *   Uses the least amount of storage space compared to full and differential backups.
*   **Disadvantages:**
    *   Slowest and most complex restore process, as multiple backup sets must be applied sequentially.
    *   If any incremental backup in the chain is corrupted or missing, data backed up after that point cannot be restored.

### 3. Differential Backup

*   **Execution:** Backs up only the data that has changed *since the last full backup*. A full restore requires the last full backup and only the *latest* differential backup.
*   **Advantages:**
    *   Faster backup time than full backups.
    *   Faster restore time than incremental backups (only needs two backup sets: the last full and the latest differential).
    *   Uses less storage space than full backups.
*   **Disadvantages:**
    *   Slower backup time than incremental backups.
    *   Uses more storage space than incremental backups over time, as each differential backup includes all changes since the last full backup. The size grows until the next full backup is performed.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/student-subjects-api.git
   ```
2. Navigate to the project directory:
   ```
   cd student-subjects-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on the `.env.example` file and configure your database connection.

## Usage

To start the server, run:
```
npm start
```
The API will be available at `http://localhost:3000`.

## Docker Setup

This project includes a `Dockerfile` and `docker-compose.yml` for containerization.

### Prerequisites

*   Docker: [Install Docker](https://docs.docker.com/get-docker/)
*   Docker Compose: Usually included with Docker Desktop. If not, [Install Docker Compose](https://docs.docker.com/compose/install/)

### Building the Docker Image

1.  Navigate to the project root directory (where the `Dockerfile` is located).
2.  Build the image using the following command. Replace `pbsuitedocker` with your Docker Hub username if you plan to push it:
    ```bash
    docker build -t pbsuitedocker/student-subjects-api:latest .
    ```
    *   `-t pbsuitedocker/student-subjects-api:latest`: Tags the image with your username, repository name, and the `latest` tag.
    *   `.`: Specifies the current directory as the build context.

### Running with Docker Compose (Recommended)

Docker Compose simplifies running the multi-container setup (API + Database).

1.  **Start Services:** From the project root directory (where `docker-compose.yml` is located), run:
    ```bash
    docker-compose up -d
    ```
    *   This command builds the image if it doesn't exist, creates and starts the `api` and `mongo` containers, and sets up the network.
    *   `-d`: Runs the containers in detached mode (in the background).

2.  **Seed the Database:** The database container starts empty. Run the seed script inside the running API container:
    ```bash
    docker-compose exec api node scripts/seed.js
    ```

3.  **Access the API:** The API should now be running and accessible at `http://localhost:3000`.
    *   Students: `http://localhost:3000/students`
    *   Subjects: `http://localhost:3000/subjects`

4.  **View Logs:**
    *   API logs: `docker-compose logs api`
    *   Database logs: `docker-compose logs mongo`
    *   Follow logs in real-time: `docker-compose logs -f api`

5.  **Stop Services:**
    ```bash
    docker-compose down
    ```
    *   This stops and removes the containers and network defined in the compose file.
    *   The database data persists in the named volume (`mongo-data`). To remove the volume as well (lose all data), use `docker-compose down -v`.

### Troubleshooting Common Issues

*   **Port Conflict:** If you get an error like `Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use`, it means another application (or a previous container) is using port 3000. Stop the other application or use `docker-compose down` to stop existing containers.
*   **Database Connection Error:** Check the API container logs (`docker-compose logs api`). Ensure the `mongo` container is running (`docker ps`). Verify the `MONGODB_URI` in `docker-compose.yml` points to `mongodb://mongo:27017/...`. The service name `mongo` acts as the hostname within the Docker network.
*   **Seed Script Fails:** Ensure the `scripts/seed.js` file exists and was correctly copied into the image (check `Dockerfile`). Make sure the API container (`api`) is running before executing `docker-compose exec api ...`. Check API logs for connection errors during seeding.
*   **Build Fails:** Check the output of the `docker build` command for specific errors (e.g., missing files, incorrect commands in `Dockerfile`, network issues during `npm ci`). Ensure your `.dockerignore` file is correctly excluding unnecessary files like `node_modules`.

## Docker Hub Repository

The pre-built Docker image for this API is available on Docker Hub:

*   **Image:** `pbsuitedocker/student-subjects-api:latest`
*   **Link:** [https://hub.docker.com/r/pbsuitedocker/student-subjects-api](https://hub.docker.com/r/pbsuitedocker/student-subjects-api)

You can pull the image using:
```bash
docker pull pbsuitedocker/student-subjects-api:latest
```

## API Endpoints

- **GET /students**: Returns a JSON response containing a list of students with their names and enrolled programs.
- **GET /subjects**: Returns a JSON response listing all subjects associated with the Software Engineering program, organized by academic year.
## Dependencies

- express
- body-parser
- cors
- dotenv
- [other dependencies as needed]

## Deployment on EC2

The application is deployed on an AWS EC2 instance using Docker Compose.

### SSH Access

Connect to the EC2 instance using your private key:
```bash
ssh -i student-subjects-key.pem ubuntu@51.21.170.68
```
*(Replace `student-subjects-key.pem` with the actual path to your key if different)*

### Accessing the Application

The application is accessible via the Nginx load balancer running on port 80 of the EC2 instance's public IP:

- **Frontend Application:** [http://51.21.170.68/](http://51.21.170.68/)
- **API Endpoints:**
    - Students: [http://51.21.170.68/students](http://51.21.170.68/students)
    - Subjects: [http://51.21.170.68//subjects](http://51.21.170.68/subjects)

*(Note: The public DNS name for the EC2 instance can also be used instead of the IP address)*

## Server Management Scripts (`bash_scripts/`)

This directory contains Bash scripts to automate common server management tasks for the deployed API on the AWS EC2 instance.

### Script Descriptions

1.  **`health_check.sh`**
    *   **Purpose:** Monitors server resource usage (CPU, Memory, Disk) and checks the status of the web server (Nginx) and API endpoints (`/students`, `/subjects`).
    *   **Logging:** Records checks and warnings to `/var/log/server_health.log`.
    *   **Warnings:** Logs warnings if disk space is below 10% free, the web server is down, or API endpoints do not return HTTP 200.

2.  **`backup_api.sh`**
    *   **Purpose:** Creates backups of the API project directory (`/home/ubuntu/apps/student-subjects-api`) and the MongoDB database (`student-subjects-api`).
    *   **Backup Location:** Stores compressed backups in `/home/ubuntu/backups/` with filenames like `api_backup_YYYY-MM-DD.tar.gz` and `db_backup_YYYY-MM-DD.tar.gz`.
    *   **Retention:** Automatically deletes backups older than 7 days.
    *   **Logging:** Records backup success or failure to `/var/log/backup.log`.

3.  **`update_server.sh`**
    *   **Purpose:** Automates server updates, fetches the latest API code from Git, and restarts the web server.
    *   **Actions:** Runs `apt update` & `apt upgrade`, performs `git pull` in the API directory, and restarts Nginx.
    *   **Logging:** Records the update process to `/var/log/update.log`.
    *   **Error Handling:** Exits without restarting the server if `git pull` fails.

### Setup and Usage

1.  **Upload:** Transfer the scripts from the `bash_scripts` directory to your AWS EC2 instance (e.g., into `/home/ubuntu/bash_scripts`).
2.  **Permissions:** Make the scripts executable:
    ```bash
    chmod +x /home/ubuntu/bash_scripts/health_check.sh
    chmod +x /home/ubuntu/bash_scripts/backup_api.sh
    chmod +x /home/ubuntu/bash_scripts/update_server.sh
    ```
3.  **Log Files:** The scripts require write access to `/var/log/`. You might need to run them with `sudo` or adjust log file permissions/ownership if running as a non-root user (though `cron` jobs often run as root by default). Ensure the log files exist or can be created by the script runner:
    ```bash
    sudo touch /var/log/server_health.log /var/log/backup.log /var/log/update.log
    sudo chown ubuntu:ubuntu /var/log/server_health.log /var/log/backup.log /var/log/update.log # Adjust 'ubuntu:ubuntu' if needed
    ```
4.  **Manual Execution:** Test each script manually:
    ```bash
    sudo /home/ubuntu/bash_scripts/health_check.sh
    sudo /home/ubuntu/bash_scripts/backup_api.sh
    sudo /home/ubuntu/bash_scripts/update_server.sh
    ```
5.  **Scheduling (Cron):** Edit the crontab for the appropriate user (e.g., `sudo crontab -e` for root, or `crontab -e` for the `ubuntu` user if permissions allow):
    ```cron
    # Example cron jobs (adjust paths if necessary)
    # Run health check every 6 hours
    0 */6 * * * /home/ubuntu/bash_scripts/health_check.sh
    # Run backup daily at 2 AM
    0 2 * * * /home/ubuntu/bash_scripts/backup_api.sh
    # Run update every 3 days at 3 AM
    0 3 */3 * * /home/ubuntu/bash_scripts/update_server.sh
    ```
    *Note: Ensure the user running the cron jobs has the necessary permissions (e.g., `sudo` rights for package updates, server restarts, writing to `/var/log`). Running root's crontab (`sudo crontab -e`) is often simplest.*

### Dependencies

*   **`curl`:** Used by `health_check.sh` to test API endpoints. (Installed by `deploy.sh`)
*   **`bc`:** Used by `health_check.sh` for basic calculations. Install if needed: `sudo apt-get install bc`
*   **`tar`:** Used by `backup_api.sh` for archiving. (Standard Linux utility)
*   **`mongodump`:** Used by `backup_api.sh`. Part of MongoDB tools. (Installed by `deploy.sh`)
*   **`git`:** Used by `update_server.sh`. Install if needed: `sudo apt-get install git`
*   **`nodejs`, `npm`, `nginx`, `mongodb`:** Core application stack, assumed installed as per `deploy.sh`.

## Contributing

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
