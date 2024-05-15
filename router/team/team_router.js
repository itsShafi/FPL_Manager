// libraries
const express = require('express');
const moment = require('moment');
const DB_player = require("../../DB-codes/db_player_api");
const {getAllTeam, getTeamById, getPlayerByTeamId} = require("../../DB-codes/db_team_api");
const {getTeamByPlayerId, getPlayerById} = require("../../DB-codes/db_player_api");

const router = express.Router({mergeParams: true});

router.get('/', async (req, res)=>{

    const team = await getAllTeam()
    // console.log(team)
    res.render('layout.ejs',{
        title:'Teams',
        body:'team/all_teams',
        player: team
    })
})


router.get('/:id', async (req, res) => {
    const teamResult = await getTeamById(req.params.id);
    const player= await getPlayerByTeamId(req.params.id)
    console.log(teamResult[0].NAME);

    const teams = await getAllTeam()

    let team = []
    team.push(await getTeamById(req.params.id));


    // console.log(playertotalpointsResult)
    res.render('team/team_profile.ejs', {
        title: teamResult[0].NAME ,
        //body: 'team/team_profile',
        team: team,
        player: player,
        teams : teams,

        //mod
        teamStats : teamResult[0]
    });
});


module.exports = router;