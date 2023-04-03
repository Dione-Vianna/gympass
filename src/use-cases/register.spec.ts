import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', async () => {
  let state: any = {
    name: 'John Doe',
    password: '123456',
    email: 'johndoe3@example.com',
  }

  const usersRepository = new InMemoryUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
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
    await expect(() =>
      registerUseCase.execute({
        name: state.name,
        email: state.email,
        password: state.password,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
