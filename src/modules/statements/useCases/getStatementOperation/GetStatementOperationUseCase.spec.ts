import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to get a statement operation.", async () => {
    const user = await usersRepository.create({
      email: "jacson@teste.com",
      name: "Jacson",
      password: "12345",
    });

    const deposit = await statementsRepository.create({
      amount: 300,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const getStatement = await getStatementOperationUseCase.execute({
      statement_id: deposit.id as string,
      user_id: user.id as string,
    });

    expect(getStatement).toBe(deposit);
  });

  it("should not be able to get the statement operation of a not existent user.", async () => {
    const deposit = await statementsRepository.create({
      amount: 500,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: "12345",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: deposit.id as string,
        user_id: "123",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a not existent statement operation", async () => {
    const user = await usersRepository.create({
      email: "jacson@teste.com",
      name: "Jacson",
      password: "12345",
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "123456",
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});
