import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement"
import { CreateStatementError } from "./CreateStatementError";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statements", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  })

  it("should be able to make a statement of deposit.", async () => {
    const user = await usersRepository.create({
      email: "jacson@teste.com",
      name: "Jacson",
      password: "12345",
    });

    const result = await createStatementUseCase.execute({
      amount: 180,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(result).toHaveProperty("id");
  });

  it("should be able to make a statement of withdrawal.", async () => {
    const user = await usersRepository.create({
      email: "jacson@teste.com",
      name: "Jacson",
      password: "12345",
    });

    await createStatementUseCase.execute({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const result = await createStatementUseCase.execute({
      amount: 300,
      description: "deposit test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(result).toHaveProperty("id");

  });

  it("should not be able to create a withdraw statement with insufficient funds.", async () => {
    const user = await usersRepository.create({
      email: "jacson@teste.com",
      name: "Jacson",
      password: "12345",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        amount: 300,
        description: "deposit test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

  });

  it("should not be able to create any statement with a not existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "deposit test",
        type: OperationType.WITHDRAW,
        user_id: "123456",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
