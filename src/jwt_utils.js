import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = 'mysecretNEW'
export const COOKIE_NAME = 'auth'

export const generateToken = user=>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'})
    return token
}

export const authToken = (req,res,next)=>{
    const token = req.cookies[COOKIE_NAME]
    if(!token) return next()

    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        req.user = credentials.user
        next()
    })

}