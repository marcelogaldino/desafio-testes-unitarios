import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe('show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should list a user profile', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: '123456'
    }

    const createdUser = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const userProfile = await showUserProfileUseCase.execute(createdUser.id || '')

    expect(userProfile).toHaveProperty('id')
  })
})
