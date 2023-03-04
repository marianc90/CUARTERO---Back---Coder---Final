import {Router} from 'express'
import passport from 'passport';
import { COOKIE_NAME } from '../jwt_utils.js';

const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect:'/views/failregister'}), async (req, res) =>{
    console.log(req.user);
    res.redirect('/views/login')
})


router.post('/login', passport.authenticate('login', {session:false, failureRedirect:'/views/faillogin'}), async (req, res) =>{

    if (!req.user){
        return res.status(401).render('session-views/login',{error: 'User not found or Incorrect password'})
    }
    return res.cookie(COOKIE_NAME, req.user.token).redirect('/views/products')
})


router.get('/login-github', passport.authenticate('github'), async (req, res) =>{

})


router.get('/githubcallback', passport.authenticate('github', {session:false, failureRedirect:'/views/faillogin'}), async (req, res,)=>{
    return res.cookie(COOKIE_NAME, req.user.token).redirect('/views/products')
})


router.get('/logout', (req, res) => {
    res.clearCookie("auth").redirect('/views/login')
})

router.get('/current',  passport.authenticate('current', {session:false}), (req, res) => {
    console.log(req.user);
    res.send(req.user.user)
})

export default router;