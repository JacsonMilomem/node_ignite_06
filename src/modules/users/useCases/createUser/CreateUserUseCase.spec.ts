import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let userRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Creating Users", () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("Show be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "Jacson",
      email: "jacson@teste.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");

  });

  it("should not be able to create a existing user", async () => {

    await createUserUseCase.execute({
      name: "Jacson",
      email: "jacson@teste.com",
      password: "123456",
    });

    await expect(
      createUserUseCase.execute({
        name: "Jacson",
        email: "jacson@teste.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(CreateUserError)

  })
})
