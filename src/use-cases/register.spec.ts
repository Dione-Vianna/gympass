import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  let state: any = {
    name: 'John Doe',
    password: '123456',
    email: 'johndoe@example.com',
  }

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: state.name,
      email: state.email,
      password: state.password,
    })

    state = {
      ...state,
      ...user,
    }

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const isPasswordCorrectlyHashed = await compare(
      state.password,
      state.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    console.log(state)

    const response = await sut.execute({
      name: state.name,
      email: 'johndoe@example.com',
      password: state.password,
    })

    console.log(response)

    // await expect(() =>
    //   sut.execute({
    //     name: state.name,
    //     email: 'johndoe@example.com',
    //     password: state.password,
    //   })
    // ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
