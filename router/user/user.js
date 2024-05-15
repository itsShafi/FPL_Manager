const express = require('express');
const router = express.Router({mergeParams : true});
const formation=['3-4-3','3-5-2','4-3-3','4-4-2','4-5-1','5-3-2','5-4-1']
const db_team = require('../../DB-codes/db_team_api')
const db_player= require('../../DB-codes/db_player_api')
const db_manager= require('../../DB-codes/db_manager_api')
const {getGameweek} = require("../../DB-codes/db_player_stat_api");
const moment = require("moment");
const {getDrafted, getManagedTeamName} = require("../../DB-codes/db_manager_api");
const {getPlayerById, getTeamByPlayerId} = require("../../DB-codes/db_player_api");



const DB_playerStats= require('../../DB-codes/db_player_stat_api')



router.get('/', async (req, res) => {
    const team_name = await getManagedTeamName(req.user.ID)
    const points_till_now=team_name[0].POINTS;

    const all_Players = await db_player.getAllPlayers()
    const all_Teams = await db_team.getAllTeam()
    const all_Users = await db_manager.getAllManager()


            // SORT : TOPSCORERS

    // program to sort array by property value
    function compareGoals(a, b) {
        return b.TOT_GOALS - a.TOT_GOALS;
    }

    const topScorers = await DB_playerStats.playersOrderByGoals();
    //console.log(topScorers.sort(compareGoals));

    topScorers.sort(compareGoals);

    let x 
    let topScorersList = []
    let topScorersGoals = []


    for (let i = 0; i < topScorers.length; i++) {
        x = await db_player.getPlayerById(topScorers[i].P_ID);
        topScorersList.push(x[0])
        topScorersGoals.push(topScorers[i].TOT_GOALS)
    }
    //console.log(topScorersList)
    //console.log(topScorersGoals)



            // SORT : ASSISTERS

    // program to sort array by property value
    function compareAssists(a, b) {
        return b.TOT_ASSISTS - a.TOT_ASSISTS;
    }

    const topAssisters = await DB_playerStats.playersOrderByAssists();
    //console.log(topScorers.sort(compareGoals));

    topAssisters.sort(compareAssists);

    let topAssistersList = []
    let topAssisters_Assists = []
    //x = db_player.getPlayerById()

    for (let i = 0; i < topScorers.length; i++) {
        x = await db_player.getPlayerById(topAssisters[i].P_ID);
        topAssistersList.push(x[0])
        topAssisters_Assists.push(topAssisters[i].TOT_ASSISTS)

    }
    


                // SORT : TOTAL PTS

    // program to sort array by property value
    function comparePoints(a, b) {
        return b.TOT_PTS - a.TOT_PTS;
    }

    const toppers = await DB_playerStats.playersOrderByPoints();
    console.log(toppers)
    //console.log(topScorers.sort(compareGoals));

    toppers.sort(comparePoints);

    let topperList = []
    let topper_Points = []
    
    for (let i = 0; i < toppers.length; i++) {
        x = await db_player.getPlayerById(toppers[i].P_ID);
        topperList.push(x[0])
        topper_Points.push(toppers[i].TOT_PTS)
    }


    res.render('layout.ejs',{
        title: 'User profile',
        body: 'user/home',
        username: req.user.NAME,
        userid: req.user.ID,
        points_till_now,

        topScorers : topScorersList,
        topScorersGoals : topScorersGoals,

        topAssisters : topAssistersList,
        topAssisters_Assists : topAssisters_Assists,

        toppers : topperList ,
        topper_Points : topper_Points ,

        totalPlayerCount : all_Players.length,
        totalUserCount : all_Users.length,
        totalClubCount : all_Teams.length,


    })
});

router.get('/edit', async (req, res) => {
    // console.log(req.user.NAME)
    // console.log(req.user.ID)
    res.render('layout.ejs',{
        title: 'User team edit',
        body: 'user/edit',
        formation
    })
});

router.post('/edit',async(req, res)=>{
    // console.log(req.body);
    let {param}=req.body;
    const frm=param
    res.redirect('/user/select?frm='+frm)
});

router.get('/select',async(req, res)=>{
    // console.log(req.user0.name)
    // console.log(req.user.name)

    let formation= req.query.frm.split('-')


    const def=parseInt(formation[0],10)
    const mid=parseInt(formation[1],10)
    const fwd=parseInt(formation[2],10)

    const gkplist=await db_player.getPlayerByPosition('GKP')
    // console.log(gkplist)
    const deflist=await db_player.getPlayerByPosition('DEF')
    const midlist=await db_player.getPlayerByPosition('MID')
    const fwdlist=await db_player.getPlayerByPosition('FWD')


    res.render('layout.ejs',{
        title: 'User team select',
        body: 'user/select',
        frm:req.query.frm,
        def, mid, fwd,
        gkplist, deflist, midlist, fwdlist
    })
})

router.post('/select', async (req,res)=>{
     console.log(req.body)

    // console.log(req.user0)
    let error=[]
    let {gkp_pick, def_pick, mid_pick, fwd_pick}= req.body;
    // console.log(gkp_pick)
    // for (let i = 0; i < def_pick.length; i++) {
    //     console.log(def_pick[i])
    // }

    if(!gkp_pick){
        error.push({
            message: 'The team is not picked properly'
        })
    }

    let dl=def_pick.length
    let ml=mid_pick.length
    let fl=fwd_pick.length

    for (let i = 0; i < dl; i++) {
        if(!def_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }

    for (let i = 0; i < ml; i++) {
        if(!mid_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }
    for (let i = 0; i < fl; i++) {
        if(!fwd_pick[i]){
            error.push({
                message: 'The team is not picked properly'
            })
        }
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }

    let teams= []
    let names= []

    let gkp = gkp_pick.split('(')
    let gkp_name= gkp[0]

    let temp= gkp[1].split(')')
    let gkp_team=temp[0]
    names.push(gkp_name)
    teams.push(gkp_team)

    // console.log(gkp_name + gkp_team)

    let def_name=[]
    let mid_name=[]
    let fwd_name=[]
    let def_team=[]
    let mid_team=[]
    let fwd_team=[]

    for (let i = 0; i < dl; i++) {
        let def = def_pick[i].split('(')
        def_name.push(def[0])
        let temp= def[1].split(')')
        def_team.push(temp[0])
        names.push(def_name[i])
        teams.push(def_team[i])
    }
    for (let i = 0; i < ml; i++) {
        let mid = mid_pick[i].split('(')
        mid_name.push(mid[0])
        let temp= mid[1].split(')')
        mid_team.push(temp[0])
        names.push(mid_name[i])
        teams.push(mid_team[i])
    }
    for (let i = 0; i < fl; i++) {
        let fwd = fwd_pick[i].split('(')
        fwd_name.push(fwd[0])
        let temp= fwd[1].split(')')
        fwd_team.push(temp[0])
        names.push(fwd_name[i])
        teams.push(fwd_team[i])
    }


    // console.log(def_name)
    // console.log(def_team)
    // console.log(mid_name)
    // console.log(mid_team)
    // console.log(fwd_name)
    // console.log(fwd_team)

    for (let i = 0; i < 11; i++) {
        for (let j = i+1; j < 11; j++) {
            if(names[i]===names[j])
                error.push({
                    message: 'Please avoid picking duplicate players'
                });

        }
    }
    let count_team= []
    for (let i = 0; i < 11; i++) {
        count_team.push(0)    }
    for (let i = 0; i < 11; i++) {
        for (let j = i+1; j < 11; j++) {
            if(i===j) continue
            else{
                if(teams[i]===teams[j]) count_team[i]++
            }
        }
    }
    for (let i = 0; i < 11; i++) {
        if(count_team[i]>=3)
            error.push({
            message: 'More than 3 players from the same team are not allowed'
        })
    }
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }

    // console.log(count_team)


    let player_data=[]
    for (let i = 0; i < 11; i++) {
        player_data.push(await db_player.getIdFromName(names[i]))
    }

    let total_cost=0
    for (let i = 0; i < 11; i++) {
        total_cost+=player_data[i][0].CURRENT_PRICE
    }

    // console.log(total_cost)

    if(total_cost>75) //T B D *****
        error.push({
            message: 'You have exceeded your gameweek  of 100 points'
        })
    if (error.length > 0) {
        return res.render('layout.ejs', {
            title: 'ERROR',
            body: 'user/edit',
            error: error,
            formation
        })
    }

    const gameweek_data= await getGameweek();

    const gw_id=gameweek_data[0].GW_ID

    // COUTS
    // console.log(req.user.ID)
    // console.log(gw_id)
    // console.log(player_data[1][0].ID)
    // console.log(player_data[5][0].ID)
    

    const team_inserted= await db_manager.insertIntoDrafted(req.user.ID, gw_id , '2021-2022', player_data[1][0].ID, player_data[2][0].ID, player_data[3][0].ID, player_data[4][0].ID, player_data[5][0].ID, player_data[6][0].ID, player_data[7][0].ID, player_data[8][0].ID, player_data[9][0].ID, player_data[10][0].ID, player_data[0][0].ID)
    const team_name = await getManagedTeamName(req.user.ID)

    if (typeof team_inserted === 'undefined') {
        error.push({
            message: 'You have a team picked for this gameweek'
        })
        return res.render('layout.ejs',{
            title: 'User team ',
            body: 'user/view',
            username:req.user.NAME,
            team_name:team_name,
            error : error,
        });
    }

    if (team_inserted.rowsAffected === 1){
        return res.redirect('/user/view');
    }


    error.push({
        message: 'Some database error occurred'
    })

    res.render('layout.ejs', {
        title: 'Error',
        body: 'user/edit',
        error : error,
        formation
    })

})




router.get('/view', async (req, res) => {
    // console.log("received request from user.js")
    let error=[]
    //console.log(req.user.ID)
    const team_name = await getManagedTeamName(req.user.ID)
    //console.log(team_name)
    res.render('layout.ejs',{
        title: 'User team ',
        body: 'user/view',
        username:req.user.NAME,
        team_name:team_name,
        error:error,
    })
});



router.get('/edit_team_name', async (req, res) => {
    // console.log("received request from user.js")
    const team_name = await getManagedTeamName(req.user.ID)
    // console.log(team_name)
    res.render('layout.ejs',{
        title: 'User team name edit ',
        body: 'user/edit_team_name',
        username:req.user.NAME,
        team_name:team_name
    })
});

router.post('/edit_team_name', async (req, res) => {
    // console.log("received request from user.js")
    let {new_name}= req.body
    const team_name = await db_manager.updateManagedTeamName(req.user.ID, new_name)
    if (team_name.rowsAffected!==1)
        res.render('layout.ejs',{
        title: 'User team name edit ',
        body: 'user/edit_team_name',
        username:req.user.NAME,
        team_name:team_name
    })
    res.redirect('/user/')
});


//still debugging

router.post('/view', async (req, res) => {
    // console.log("received request from user.js")
    let{gw_date}=req.body
    gw_date = moment.utc(gw_date).format('yyyy-MM-DD HH:mm');
    // console.log(gw_date, req.user.ID)
    const team_name = await getManagedTeamName(req.user.ID)
    // console.log(team_name)
    const drafted_players = await getDrafted(gw_date, req.user.ID)
    // console.log(gw_date, req.user.ID, drafted_players)

    const player_name1 = await getPlayerById(drafted_players[0].P1_ID)
    // console.log(player_name1)

    const player_name2 = await getPlayerById(drafted_players[0].P2_ID)
    // console.log(1)
    const player_name3 = await getPlayerById(drafted_players[0].P3_ID)
    // console.log(1)
    const player_name4 = await getPlayerById(drafted_players[0].P4_ID)
    // console.log(1)
    const player_name5 = await getPlayerById(drafted_players[0].P5_ID)
    // console.log(1)
    const player_name6 = await getPlayerById(drafted_players[0].P6_ID)
    // console.log(1)
    const player_name7 = await getPlayerById(drafted_players[0].P7_ID)
    // console.log(1)
    const player_name8 = await getPlayerById(drafted_players[0].P8_ID)
    // console.log(1)
    const player_name9 = await getPlayerById(drafted_players[0].P9_ID)
    // console.log(1)
    const player_name10 = await getPlayerById(drafted_players[0].P10_ID)
    // console.log(1)
    const player_name11 = await getPlayerById(drafted_players[0].P11_ID)
    // console.log(1)
    const points_till_now=team_name[0].POINTS;

    let player=[]

    player.push(player_name11[0])
    player.push(player_name1[0])
    player.push(player_name2[0])
    player.push(player_name3[0])
    player.push(player_name4[0])
    player.push(player_name5[0])
    player.push(player_name6[0])
    player.push(player_name7[0])
    player.push(player_name8[0])
    player.push(player_name9[0])
    player.push(player_name10[0])

    let team = []
    for (let i = 0; i < 11; i++) {
        team.push(await db_player.getTeamByPlayerId(player[i].ID));
    }

    res.render('layout.ejs',{
        title: 'View '+team_name+' team ',
        body: 'user/view_team',
        username: req.user.NAME,
        team_name:team_name,
        player,
        points_till_now,
        team:team


    })
});








module.exports = router;