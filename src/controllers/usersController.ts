import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { BaseController } from './index';
import { User } from '../models/user';
import AuthService from '../services/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try{
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    }catch(error){
      this.sendCreateUpdateErrorResponse(res, error)
    }
  }
  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response>{
    const { email,password } = req.body
    const user = await User.findOne({ email: email });
    if(!user){
      return res.status(401).send({
        code: 401,
        error: 'User not found!'
      })
    }
    if(!(await AuthService.comparePasswords(password, user.password))){
      return res.status(401).send({
        code: 401,
        error: 'Password does not match'
      })
    }
    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token: token })
  }
}