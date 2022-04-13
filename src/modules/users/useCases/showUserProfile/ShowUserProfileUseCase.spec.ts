import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show a user", async () => {
    const user = await usersRepository.create({
      name: "Jacson",
      email: "jacson@teste.com",
      password: "1234"
    });

    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toBe(user);
  });

  it("should not be able to show a nont existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1234567890");
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });

})
