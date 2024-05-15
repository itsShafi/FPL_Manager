// libraries
const express = require('express');
const moment = require('moment');
const DB_player = require("../../DB-codes/db_player_api");
const {getAllTeam, getTeamById, getPlayerByTeamId} = require("../../DB-codes/db_team_api");



const {getTeamByPlayerId, getPlayerById} = require("../../DB-codes/db_player_api");

const DB_playerStats = require('../../DB-codes/db_player_stat_api');


const router = express.Router({mergeParams: true});

router.get('/', async (req, res)=>{

    const team = await getAllTeam()
    //console.log(team)
    res.render('layout.ejs',{
        title:'Teams',
        body:'team/all_teams',
        player: team
    })
})


router.get('/:id', async (req, res) => {
    
    console.log(req.params.id)
    const player= await DB_player.getPlayerByPos(req.params.id);
    console.log(player);

   
    const teams = await getAllTeam()


    let team = []
    for (let i = 0; i < player.length; i++) {
        team.push(await DB_player.getTeamByPlayerId(player[i].ID));
        console.log(player[i].ID)
    }
    

    console.log(player[0])
    console.log(team)


    for (let i = 0; i < player.length; i++) {
        console.log(player[i].ID + ' ' + player[i].FIRST_NAME +    ' ' + player[i].LAST_NAME +  ' '  )
    }

    let posName = "t";
    if (req.params.id === "GKP"){
        posName = "Goalkeeper"
    }
    if (req.params.id === "DEF"){
        posName = "Defender"
    } 
    if (req.params.id === "MID"){
        posName = "Midfielder"
    } 
    if (req.params.id === "FWD"){
        posName = "Forward"
    } 

    
    res.render('position/position_profile.ejs', {
        title: posName ,
        //body: 'team/team_profile',
        team: team,
        player: player,
        teams : teams,
        position : posName,
        count : player.length,
        
    });
});

module.exports = router;