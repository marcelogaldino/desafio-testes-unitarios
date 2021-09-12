import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should get the balance', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: '123456'
    }

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    await createStatementUseCase.execute({
      user_id: userCreated.id || '',
      amount: 100,
      description: '100deposit',
      type: 'deposit' as OperationType
    })

    await createStatementUseCase.execute({
      user_id: userCreated.id || '',
      amount: 50,
      description: '50withdraw',
      type: 'withdraw' as OperationType
    })

    const userBalance = await getBalanceUseCase.execute({
      user_id: userCreated.id || '',
    })

    expect(userBalance.balance).toEqual(50)
  })
})
