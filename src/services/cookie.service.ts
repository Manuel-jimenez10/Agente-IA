import { Response } from 'express'

const ACCESS_TOKEN_MAX_AGE = 2 * 60 * 60 * 1000;

export async function setAccessTokenCookie(res: Response, token: string): Promise<void> {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: ACCESS_TOKEN_MAX_AGE,
      sameSite: 'strict',
    })
}
  
