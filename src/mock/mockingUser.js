import { fakerES_MX as fa } from "@faker-js/faker";
import { createHash } from "../utils/index.js";

function createMockUser(count = 1) {
    const users = [];

    for (let i = 0; i < count; i++) {
        const roles = ['user', 'admin'];
        const role = fa.helpers.arrayElement(roles);
        const firstName = fa.person.firstName();
        const lastName = fa.person.lastName().split(" ")[0]; 
        const password = createHash("coder123");

        users.push({
            first_name: firstName,
            last_name: lastName,
            email: fa.internet.email({
                firstName,
                lastName,
                provider: "coderhouse.com"
            }),
            password,
            role,
            pets: [] 
        });
    }

    return users;
}

export default createMockUser;
