const request = require('supertest');
const app = require('../src/app');

describe('Student API', () => {
    it('should return a list of students', async () => {
        const response = await request(app).get('/students');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('students');
        expect(response.body.students.length).toBeGreaterThanOrEqual(10);
    });

    it('should return students with name and enrolled program', async () => {
        const response = await request(app).get('/students');
        const students = response.body.students;
        students.forEach(student => {
            expect(student).toHaveProperty('name');
            expect(student).toHaveProperty('enrolledProgram');
        });
    });
});


/* 

# Navigate to the directory containing your key file
cd "D:\Program Files\PB Projects\gitlearn\student-subjects-api"

# Set correct permissions (PowerShell)
$acl = Get-Acl ".\student-subjects-key.pem"
$acl.SetAccessRuleProtection($true, $false)
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("$env:USERNAME", "FullControl", "Allow")
$acl.SetAccessRule($rule)
Set-Acl ".\student-subjects-key.pem" $acl

# Connect to your EC2 instance
ssh -i student-subjects-key.pem ubuntu@51.20.193.29

*/