const getDepartments = require('../controllers/department').getDepartments;

describe("getDepartments function", () => {
  test("it should return a response containing all departments", async () => {
    const db = require('../db/connect.js')
    const departments = await db.initDb(async (err) => {
      if (err)
        return null;
      return await getDepartments(null, new dummyRes(), null);
    });

    const fields = ["_id",
                    "departmentId",
                    "name",
                    "location",
                    "head",
                    "employeesCount",
                    "description"];

    departments.forEach((department) => {
        fields.forEach((field) => {
          expect(department).toHaveProperty(field);
        });
    });
  });
});
class dummyRes {status(status) {}}