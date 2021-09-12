import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get statement operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
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

    const userStatements = await getBalanceUseCase.execute({
      user_id: userCreated.id || '',
    })

    const operationTypeDeposit = await getStatementOperationUseCase.execute({
      user_id: userCreated.id || '',
      statement_id: userStatements.statement[0].id || ''
    })

    const operationTypeWithdraw = await getStatementOperationUseCase.execute({
      user_id: userCreated.id || '',
      statement_id: userStatements.statement[1].id || ''
    })

    expect(operationTypeDeposit.type).toEqual('deposit')
    expect(operationTypeWithdraw.type).toEqual('withdraw')
  })
})
