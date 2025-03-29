# Student Subjects API

This project is a simple API that provides information about students and subjects associated with a Software Engineering program. It is built using Node.js and Express, with a relational database for data storage.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

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

## API Endpoints

- **GET /students**: Returns a JSON response containing a list of students with their names and enrolled programs.
- **GET /subjects**: Returns a JSON response listing all subjects associated with the Software Engineering program, organized by academic year.

## Dependencies

- express
- body-parser
- cors
- dotenv
- [other dependencies as needed]

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.