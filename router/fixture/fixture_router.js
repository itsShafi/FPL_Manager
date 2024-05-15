// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const DB_player = require('../../DB-codes/db_player_api');
const DB_team = require('../../DB-codes/db_team_api');
const DB_fixture = require('../../DB-codes/db_fixture_api');
const {getAllManager, getManagedTeamName, getDrafted} = require("../../DB-codes/db_manager_api");
const moment = require("moment");
const {getPlayerById} = require("../../DB-codes/db_player_api");
const { getFixtureByGameweek } = require('../../DB-codes/db_fixture_api');
const { months } = require('moment');

/*********** */
 

router.get('/', async (req, res)=>{

    //const managerResult = await getAllManager()

    // console.log(playerResult)
    res.render('gameweek/gameweek.ejs',{
        title:'Fixtures',
        //body:'gameweek/gameweek',
    
    
    })

})

router.get('/:id', async (req, res) => {

    let x = await DB_fixture.getFixtureById(req.params.id)
    const fixtureStats = x[0]

    
    
    const homeTeam = fixtureStats.TEAM_H_ID
    const awayTeam = fixtureStats.TEAM_A_ID

    x = await DB_team.getTeamById(homeTeam)
    const homeTeamName = x[0].NAME

    x = await DB_team.getTeamById(awayTeam)
    const awayTeamName = x[0].NAME

    //console.log(homeTeamName)
    //console.log(awayTeamName)

    const homeTeamScore = fixtureStats.TEAM_H_SCORE
    const awayTeamScore = fixtureStats.TEAM_A_SCORE


    // Goal Scored
    let goalScorers
    x = (fixtureStats.GOAL_SCORED)
    if(x == null)
        goalScorers = []
    else
        goalScorers = x.split(',')

    
    let gS_list = []
    for (let i = 0; i < goalScorers.length; i++) {
        x = await DB_player.getPlayerById(goalScorers[i]);
        gS_list.push(x[0]);
    } 

    // Own Goals 
    let og_Scorers
    x = (fixtureStats.OWN_GOAL)
    if(x == null)
        og_Scorers = []
    else
        og_Scorers = x.split(',')

    
    let og_list = []
    for (let i = 0; i < og_Scorers.length; i++) {
        x = await DB_player.getPlayerById(og_Scorers[i]);
        og_list.push(x[0]);
    } 

    
    // Assist
    let assisters
    x = (fixtureStats.ASSISTS)
    if(x == null)
        assisters = []
    else
        assisters = x.split(',')

    let ass_list = []
    for (let i = 0; i < assisters.length; i++) {
         x = await DB_player.getPlayerById(assisters[i]);
        ass_list.push(x[0]);
    } 
    

    // Yellow Card
    let yellowCard_players
    x = (fixtureStats.YELLOW_CARD)
    if(x == null)
        yellowCard_players = []
    else
        yellowCard_players = x.split(',')

    let yellow_list = []
    for (let i = 0; i < yellowCard_players.length; i++) {
        x = await DB_player.getPlayerById(yellowCard_players[i]);
        yellow_list.push(x[0]);
    } 
    

    // Red Card
    let redCard_players
    x = (fixtureStats.RED_CARD)
    if(x == null)
        redCard_players = []
    else
        redCard_players = x.split(',') 
    
    let red_list = []
    for (let i = 0; i < redCard_players.length; i++) {
        x = await DB_player.getPlayerById(redCard_players[i]);
        red_list.push(x[0]);
    } 


    // CLEAN SHEET
    let cleanSheet_players
    x = (fixtureStats.CLEAN_SHEET)
    if(x == null)
        cleanSheet_players = []
    else 
        cleanSheet_players = x.split(',') 
    
    let clean_list = []
    for (let i = 0; i < cleanSheet_players.length; i++) {
        x = await DB_player.getPlayerById(cleanSheet_players[i]);
        clean_list.push(x[0]);
    } 



    // PEN MISSED
    let pen_miss_players
    x = (fixtureStats.PENALTY_MISSED)
    if(x == null)
        pen_miss_players = []
    else 
        pen_miss_players = x.split(',') 

    let pen_miss_list = []
    for (let i = 0; i < pen_miss_players.length; i++) {
        x = await DB_player.getPlayerById(pen_miss_players[i]);
        pen_miss_list.push(x[0]);
    } 


    // PEN SAVED
    let pen_save_players
    x = (fixtureStats.PENALTY_SAVED)
    if(x == null)
        pen_save_players = []
    else 
        pen_save_players = x.split(',') 

    let pen_save_list = []
    for (let i = 0; i < pen_save_players.length; i++) {
         x = await DB_player.getPlayerById(pen_save_players[i]);
         pen_save_list.push(x[0]);
    } 


    //  BONUS PTS : NEED TO CHANGE
    x = (fixtureStats.homeTeamScore)
    const bonus_players = 'TBD'



    // DATE & MONTH

    const temp = fixtureStats.KICK_OFF
    const z = "" + temp
    const tempName = z.slice(4,8)

    const date = z.slice(8,11)
    const monthName = tempName.toUpperCase()

    // console.log(goalScorers)
    // console.log(assisters)
    // console.log(yellowCard_players)
    // console.log(redCard_players)
    // console.log(cleanSheet_players)
    // console.log(bonus_players)
    // console.log(pen_miss_players)
    // console.log(pen_save_players)
    // console.log(homeTeamName)
    // console.log(awayTeamName)
    // console.log(homeTeamScore)
    // console.log(awayTeamScore)
    // console.log(monthName)
    // console.log(date)

    //console.log(gS_list[1].FIRST_NAME)
    //console.log(gS_list[0].LAST_NAME)
    // console.log(ass_list)
    // console.log(yellow_list)
    // console.log(red_list)
    // console.log(clean_list)
    // console.log(bonus_players)
    // console.log(pen_miss_list)
    // console.log(pen_save_list)
    // console.log(homeTeamName)
    // console.log(awayTeamName)
    // console.log(homeTeamScore)
    // console.log(awayTeamScore)
    // console.log(monthName)
    // console.log(date)


    

    res.render('fixture/fixture.ejs', {
        title: 'Fixture',
        //body: 'fixture/fixture',
        
        goalScorers : gS_list,
        ownGoalScorers : og_list,
        assisters : ass_list,
        yellowCard_players : yellow_list,
        redCard_players : red_list,
        cleanSheet_players : clean_list,
        bonus_players : bonus_players,
        pen_miss_players : pen_miss_list ,
        pen_save_players : pen_save_list,
        homeTeamName : homeTeamName,
        awayTeamName : awayTeamName,
        homeTeamScore : homeTeamScore,
        awayTeamScore : awayTeamScore,
        month : monthName,
        date : date,
    
    })
    
})


module.exports = router;