const { buildSdk } = require("@rpglogs/api-sdk");

const ffSdk = buildSdk(accessToken, 'ff');

async function getUserZoneRanking(zone_id, character_name, server, region)
{
    const response = await ffSdk.getCharacterZoneRankings(
    {
        zoneId: zone_id,
        characterName: character_name,
        characterServerSlug: server,
        characterRegion: region,
        metric: 'rdps',
        difficulty: 101,
        partition: -1,
    });
    return response.characterData.character.zoneRankings;
}

/*
function request_code(req, res, next)
{
    const authurl = "https://www.fflogs.com/oauth/authorize";
    const tokkenurl = "https://www.fflogs.com/oauth/token";
    //process.env.FFLOGSID
    //process.env.FFLOGSPW
}*/
