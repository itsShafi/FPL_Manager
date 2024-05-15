// libraries
const express = require('express');
const marked = require('marked');

const router = express.Router({mergeParams : true});
const auth = require('./auth/ensureAuth')

// // sub-routers ( ... require(JS Files) )
const playerRouter = require('./player/player');
const adminRouter= require('./admin/admin_router')
const authRouter= require('./auth/authenticate')
const userRouter= require('./user/user')
const teamRouter= require('./team/team_router')
const leaderboardRouter= require('./leaderboard/leaderboard')

// *********
const positionRouter= require('./position/position_router')
const gameweekRouter= require('./gameweek/gameweek_router')
const fixtureRouter= require('./fixture/fixture_router')


// ROUTE: home page
router.get('/', async (req, res) =>{
    res.render('layout.ejs', {
        title: 'Fantasy Premier League',
        body : 'homepage'
    });
});

// setting up sub-routers (EJS folder name / router)
router.use('/player', playerRouter);
router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/user',auth.authenticated, userRouter);
router.use('/team', teamRouter);
router.use('/leaderboard',leaderboardRouter);

// *********
router.use('/position', positionRouter);
router.use('/gameweek', gameweekRouter);
router.use('/fixture', fixtureRouter);



module.exports = router