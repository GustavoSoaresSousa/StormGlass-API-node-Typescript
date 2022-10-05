import { User } from "@src/models/user"

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  })
  describe('When creating a new user', () => {
    it('Should successfully create a new user', async() => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      }

      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201); // sucesso e criado
      expect(response.body).toEqual(expect.objectContaining(newUser));
    })

    it('Should return 422 when there is a validation error', async () => {
      const newUser = {
        email: 'john@mail.com',
        password: '1234',
      };
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(422); // erro de validação
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('Should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      await global.testRequest.post('/users').send(newUser);
      const response = await global.testRequest.post('/users').send(newUser);

      expect(response.status).toBe(409); // codigo de conflito, que campo ja exist
      expect(response.body).toEqual({
        code: 409,
        error: 'User validation failed: email: already exists in the database.',
      });
    });
  })
})