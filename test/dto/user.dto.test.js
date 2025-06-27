import UserDTO from "../../src/dto/User.dto.js";
import { expect } from "chai";
import { describe, it, before } from "mocha";

describe("Tests de transformación con UserDTO", () => {
    let mockUser;
    let userDTO;

    before(() => {
        mockUser = {
            first_name: "Lucía",
            last_name: "Ramírez",
            role: "User",
            email: "lucia.ramirez@example.com"
        };
        userDTO = UserDTO.getUserTokenFrom(mockUser);
    });

    it("Debería combinar first_name y last_name en un campo 'name'", () => {
        expect(userDTO).to.have.property("name", "Lucía Ramírez");
    });

    it("No debería contener la propiedad 'first_name'", () => {
        expect(userDTO).to.not.have.property("first_name");
    });

    it("No debería contener la propiedad 'last_name'", () => {
        expect(userDTO).to.not.have.property("last_name");
    });

    it("Debería incluir los campos 'email' y 'role'", () => {
        expect(userDTO).to.have.property("email", mockUser.email);
        expect(userDTO).to.have.property("role", mockUser.role);
    });
});
