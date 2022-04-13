import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get the user balance.", async () =>{
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

    const withdraw = await statementsRepository.create({
      amount: 100,
      description: "deposit test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(balance).toStrictEqual({
     statement: [deposit, withdraw],
      balance: 200,
    });

  });

  it("should not be able to get a balance of a not existent user.", async () => {
    await statementsRepository.create({
      amount: 340,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: "123456",
    });

    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "not_user",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

});
