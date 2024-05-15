// libraries
const express = require('express');

const router = express.Router({mergeParams : true});

const DB_player = require('../../DB-codes/db_player_api');
const DB_team = require('../../DB-codes/db_team_api');
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

    //console.log(managerResult)
})

router.get('/:id', async (req, res) => {

    const fixtures = await getFixtureByGameweek(req.params.id)
    //console.log(fixtures)
    //console.log(fixtures[2].ID)
    //console.log(fixtures[2].SEASON)
    //const x = await DB_team.getTeamById(fixtures[2].TEAM_H_ID)
    //console.log(x[0])
    

    const gameweekNumber = req.params.id

    const homeTeams = [] 
    const awayTeams = [] 
    const fixtureIDs = []
    const kickOff_dates = []
    const kickOff_months = []
    
    for (let i = 0; i < fixtures.length; i++) {
        const x = await DB_team.getTeamById(fixtures[i].TEAM_H_ID)
        const y = await DB_team.getTeamById(fixtures[i].TEAM_A_ID)
       
        
        awayTeams.push(y[0]);
        homeTeams.push(x[0]);
        fixtureIDs.push(fixtures[i].ID);

        //kickOff date & month
        const temp = fixtures[i].KICK_OFF
        const z = "" + temp
        const tempName = z.slice(4,8)

        const date = z.slice(8,11)
        const monthName = tempName.toUpperCase()

        kickOff_dates.push(date)
        kickOff_months.push(monthName)
    }


    
    //console.log(fixtureIDs)
    //console.log("----------------------")
    //console.log(homeTeams)
    //console.log("----------------------")
    //console.log(homeTeams[0])
    //console.log("----------------------")
    //console.log(homeTeams[2][0])
    //console.log("----------------------")
    //console.log(homeTeams[2].NAME) 

    //const y = fixtures[3].KICK_OFF
    //const z = "" + y

    //console.log(y)
    //console.log(z)
    //console.log(typeof y)
    //console.log(typeof z)

    //console.log(z.slice(4,8))
    //console.log(z.slice(8,11))

    //const tempName = z.slice(4,8)
    //const date = z.slice(8,11)
    //const monthName = tempName.toUpperCase()
    //console.log(monthName)
    //console.log(date)
    

    //console.log(kickOff_dates)
    //console.log(kickOff_months)

   

    
    res.render('gameweek/gameweek.ejs', {
        title: 'Gameweek' + gameweekNumber,
        //body: 'gameweek/gameweek',
        gameweekNumber : gameweekNumber,
        GW_FixtureCount : fixtures.length,

        fixtures : fixtures,
        homeTeams : homeTeams,
        awayTeams : awayTeams,
        dates : kickOff_dates,
        months : kickOff_months,
        fixtureIDs : fixtureIDs,
    



    })
    
});


module.exports = router;