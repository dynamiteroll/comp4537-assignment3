const { mongoose } = require('mongoose')
const request = require('supertest');
const auth = require('./authServer'); 
const app = require('./appServer');
const db = require('./connectDB'); 
const userModel = require('./userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PokemonAuthError  = require('./errors');
const base64 = require('base-64');
const { token } = require('morgan');

let globalRefreshToken, globalAccessToken;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('/register', () => {
  it('creates a new user with the correct hashed password', async () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      email: 'test@test.com'
    };

    const response = await request(auth)
      .post('/register')
      .send(user)
      .expect(200)

      expect(response.body.username).toBe(user.username)
      expect(response.body.email).toBe(user.email)
  
      const savedUser = await userModel.findOne({ username: user.username })
      expect(savedUser.password).not.toBe(user.password)
      expect(await bcrypt.compare(user.password, savedUser.password)).toBe(true)

  });
});

describe('/login', () => {
    it('/login returns a JWT access token and refresh token for valid credentials', async () => {


      const response = await request(auth)
        .post('/login')
        .send({username: 'testuser', password: 'password123'})
        .expect(200)

        expect(response.header).toHaveProperty('auth-token-access');
        expect(response.header).toHaveProperty('auth-token-refresh');

        const decodedAccessToken = jwt.verify(response.header['auth-token-access'], process.env.ACCESS_TOKEN_SECRET);
        const decodedRefreshToken = jwt.verify(response.header['auth-token-refresh'], process.env.REFRESH_TOKEN_SECRET);
  
        globalRefreshToken = decodedRefreshToken;
        globalAccessToken = decodedAccessToken;
  
     
    });

    it('/login endpoint should return an pokemonAuthError for invalid credentials', async () => {
      try {
        const response = await request(auth)
        .post('/login')
        .send({ username: 'testuser', password: 'invalidPassword' })
        expect(response.status).toBe(401)
      } catch (PokemonAuthError) {
        expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: Password is incorrect.')
        expect(PokemonAuthError.pokeErrCode).toBe(401)
      }
       
    });

});

describe('/requestNewAccessToken', () => {
  it ("returns a new JWT access token for a valid refresh token", async () => {

    const response = await request(auth) 
      .post('/requestNewAccessToken')
      .set ('auth-token-refresh', globalRefreshToken);

      expect(globalRefreshToken).not.toBe(null)

  });

  it ('throws a PokemonAuthError for an invalid refresh token', async () => {

    try {
      const response = await request(auth)
      .post('/requestNewAccessToken')
      .set ('auth-token-refresh', 'invalidRefreshToken');
      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: Invalid Token: Please provide a valid token.')
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });
});


describe('token', () => {
  
    it ('refresh token is added to the refreshTokens array on login and removed on logout', async () => {
      const login = await request(auth)
      .post('/login')
      .send({username: 'testuser', password: 'password123'})
      expect(200)

      const logout = await request(auth)
      .get('/logout')
      .set ('auth-token-access', globalAccessToken)
      expect(200)

        
    });

    it ('JWT access token can be decoded and contains the correct user data', async () => {
      const response = await request(auth)
      .post('/login')
      .send({username: 'testuser', password: 'password123'})
      .expect(200)

      const decodedAccessToken = jwt.verify(response.header['auth-token-access'], process.env.ACCESS_TOKEN_SECRET);
      const decodedRefreshToken = jwt.verify(response.header['auth-token-refresh'], process.env.REFRESH_TOKEN_SECRET);

      globalRefreshToken = decodedRefreshToken;
      globalAccessToken = decodedAccessToken;

      expect(decodedAccessToken.user.username).toBe('testuser');
      expect(decodedAccessToken.user.role).toBe('user');

      expect(decodedRefreshToken.user.username).toBe('testuser');
      expect(decodedRefreshToken.user.role).toBe('user');


    });
});


describe('protected route stuff', () => {

  it ('user cannot access protected endpoints', async () => {
    try {
      const response = await request(app)
      .post('/api/v1/pokemon/')
      .set ('auth-token-access', 'invalidAccessToken');
      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: No Token: Please provide the access token using the headers.')
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });

  it ('expired JWT access token cannot access protected endpoints', async () => {
          
    try {
      const response = await request(app)
      .post('/api/v1/pokemon/')
      .set ('auth-token-access', globalAccessToken);

      sleep(10000);

      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: Invalid Token Verification. Log in again.')
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  }, 12000);

  it ('refreshtoken cannot access protected endpoints', async () => {
    try {
      const response = await request(app)
      .post('/api/v1/pokemon/')
      .set ('auth-token-refresh', globalRefreshToken);

      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: No Token: Please provide the access token using the headers.')
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });

  it ('invalid or missing refreshtoken throws PokemonAuthError', async () => {
    try {
      const response = await request(app)
      .post('/api/v1/pokemon/')

      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.message).toBe('Poke API Error - Authentication Error: No Token: Please provide the access token using the headers.')
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });

  it ('non-admin user cannot access admin endpoints', async () => {
    try {
      const login = await request(auth)
      .post('/login')
      .send({username: 'testuser', password: 'password123'})
      .expect(200)

      const response = await request(app)
      .post('/report?id=1')
      .send('auth-token-access', globalAccessToken);
      

      expect(response.status).toBe(401)
    } catch (PokemonAuthError){
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });

  it ('user cannot access protected endpoints after logout', async () => {
    try {
      const logout = await request(auth)
      .get('/logout')
      .set ('auth-token-refresh', globalRefreshToken)
      expect(200)

      const response = await request(app)
      .post('/api/v1/pokemon/')
      .set ('auth-token-access', globalAccessToken)
      expect(response.status).toBe(401)

    } catch (PokemonAuthError){
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });
});

describe('error handling and edge cases', () => {
  it ('Invalid payloads for register throw PokemonAuthError', async () => {
    try {
      const response = await request(auth)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' })
      expect(response.status).toBe(400)
    } catch (PokemonBadRequest) {
      expect(PokemonBadRequest.pokeErrCode).toBe(400)
    }
  });

  it ('Invalid payloads for login throw PokemonAuthError', async () => {
    try {
      const response = await request(auth)
      .post('/login')
      .send({ username: '', password: '' })
      expect(response.status).toBe(401)
    } catch (PokemonAuthError) {
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }
  });


  it ('Invalid token secrets or expiration times throw PokemonAuthError', async () => {
    const invalidToken = jwt.sign({ username: 'testuser' }, 'nogood', { expiresIn: '1h' });
    try {
      const response = await request(app)
      .post('/api/v1/pokemon/')
      .set ('auth-token-access', invalidToken);
      expect(response.status).toBe(401)
    } catch (PokemonAuthError) {
      expect(PokemonAuthError.pokeErrCode).toBe(401)
    }

  });

  it ('Unhandled database errors', async () => {
    try {
      const response = await request(auth)
      .post('/register')
      .send({ username: 'testuser', password: 'password1', email: 'email@email.com' })
      expect(response.status).toBe(400)
    } catch (PokemonBadRequest) {
      expect(PokemonBadRequest.pokeErrCode).toBe(400)
    }
  });

  it ('Duplicate documents in the database', async () => {
    try {
      const response = await request(auth)
      .post('/register')
      .send({ username: 'testuser', password: 'password123', email: 'test@test.com' })
      expect(response.status).toBe(400)
    } catch (PokemonBadRequest) {
      expect(PokemonBadRequest.pokeErrCode).toBe(400)
    }
  });

  it ('missing documents in the database', async () => {
    try {
      const response = await request(auth)
      .post('/login')
      .send({ username: 'testuser11', password: 'password123'})
      expect(response.status).toBe(401)
    } catch (PokemonBadRequest) {
      expect(PokemonBadRequest.pokeErrCode).toBe(401)
    }
  });

  it ('invalid http requests', async () => {
    try {
      const response = await request(auth)
      .post('/someroute')
      .send({ username: 'testuser', password: 'password123'})
      expect(response.status).toBe(404)
    } catch (PokemonNoSuchRouteError) {
      expect(PokemonNoSuchRouteError.pokeErrCode).toBe(404)
    }
  });

  it ('invalid http responses', async () => {
    try {
      const response = await request(auth)
      .post('/register')
      .send({ username: 'testuser', password: 'password123'})
      expect(response.status).toBe(400)
    } catch (PokemonBadRequest) {
      expect(PokemonBadRequest.pokeErrCode).toBe(400)
    }
  });

});



// afterAll(async () => {
//   await userModel.deleteMany({});
// });