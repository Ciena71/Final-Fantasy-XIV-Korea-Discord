const { buildSdk } = require("@rpglogs/api-sdk");

const ffSdk = buildSdk(getAccessToken(), 'ff');

async function getAccessToken()
{
    const authHeader = 'Basic ' +
    btoa
    (
        process.env.FFLOGSID + ':' +
        process.env.FFLOGSPW
    );

    const response = await fetch(
    'https://www.fflogs.com' +
    '/oauth/token',
    {
        method: 'POST',
        headers:
        {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const json = await response.json();

    if (response.status === 200)
    {
        return json.access_token;
    }
    else
    {
        console.log('토큰을 불러오지 못함: ' + JSON.stringify(json ?? {}));
        return null;
        throw new Error(
            '토큰을 불러오지 못함: ' +
            JSON.stringify(json ?? {})
        );
    }
}
  
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
