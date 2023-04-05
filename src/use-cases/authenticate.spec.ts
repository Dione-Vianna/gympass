import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  let state: any = {
    email: 'johndoe@example.com',
    password: '123456',
  }

  it('should be able to register', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })
    const { user } = await sut.execute({
      email: state.email,
      password: state.password,
    })

    state = {
      ...state,
      ...user,
    }

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', () => {
    expect(() =>
      sut.execute({
        email: 'erro@example.com',
        password: state.password,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: state.email,
        password: '12365',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
