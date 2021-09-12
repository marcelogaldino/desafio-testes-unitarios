import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it('should create a new Statement', async () => {
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

    const userStatementDeposit = await createStatementUseCase.execute({
      user_id: userCreated.id || '',
      amount: 100,
      description: '100deposit',
      type: 'deposit' as OperationType
    })

    const userStatementWithDraw = await createStatementUseCase.execute({
      user_id: userCreated.id || '',
      amount: 50,
      description: '50withdraw',
      type: 'withdraw' as OperationType
    })

    expect(userStatementDeposit.type).toMatch('deposit')
    expect(userStatementWithDraw.type).toMatch('withdraw')
  })
})
