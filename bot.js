const Discord = require("discord.js");
const prefix = "!";
const client = new Discord.Client(
{
	intents:
	[
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_WEBHOOKS',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'GUILD_MESSAGE_TYPING'
	]
});
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const { Pool } = require("pg");
const dataBase = new Pool(
{
	connectionString: process.env.DATABASE_URL,
	ssl:
	{
		rejectUnauthorized: false
	}
});

dataBase.connect();

dataBase.query("CREATE TABLE IF NOT EXISTS UserSaveData (User_Id BIGINT NOT NULL PRIMARY KEY, FFXIV_Id INT, Config INT DEFAULT 0, Warning_Reason TEXT, Ban_Reason TEXT, Language INT DEFAULT 0)");

var catchMessageUpdate = false;

var FFXIV_Guild;

const channelsId = {
	log:'857670522601996298',
	certification:'856918824627732500',
	console:'857695133700325437',
	role:'857691161116278824',
	jp_static_pve:'857683635388809226',
	jp_party_pve:'857683653266374706',
	jp_party_pvp:'865957945909313546',
	na_static_pve:'863295574212083722',
	na_party_pve:'863295603537608734',
	na_party_pvp:'865957966875197440',
	eu_static_pve:'863295627558387712',
	eu_party_pve:'863295645862330388',
	eu_party_pvp:'865957988148445234',
	fc:'857683691210801202',
	linkshell:'863288605391585321',
	trade:'858316879961915413',
	dialog:'876772352950685697'};

const categorysId = {
	fc:'861391784734621699',
	linkshell:'861415366298042368',
	inquire:'863966045320773652',
	inquire_log:'866230422383624202',
	inquire_close:'863965981146480690',
	negotiation:'866249890572795925',
	negotiation_log:'866229993276047390',
	negotiation_close:'866245563946500116',
	troubleshooting:'869165235225899008',
	troubleshooting_log:'869165664257064980',
	troubleshooting_close:'869165559848263741',
	job_battle:'857687196911271997'};

const config = {
	private: 1 << 0};

const emoji_role = {
	"TANK" : { name : "탱커" , slot : 0, slotname : "Tank", fflogs : null },
	"PLD" : { name : "나이트" , slot : 0, slotname : "Tank", fflogs : 9 },
	"WAR" : { name : "전사" , slot : 0, slotname : "Tank", fflogs : 12 },
	"DRK" : { name : "암흑기사" , slot : 0, slotname : "Tank", fflogs : 4 },
	"GNB" : { name : "건브레이커" , slot : 0, slotname : "Tank", fflogs : 17 },
	"HEALER" : { name : "힐러" , slot : 1, slotname : "Healer", fflogs : null },
	"WHM" : { name : "백마도사" , slot : 1, slotname : "Healer", fflogs : 13 },
	"SCH" : { name : "학자" , slot : 1, slotname : "Healer", fflogs : 10 },
	"AST" : { name : "점성술사" , slot : 1, slotname : "Healer", fflogs : 1 },
	"MeleeDPS" : { name : "근거리 딜러" , slot : 2, slotname : "Melee", fflogs : null },
	"MNK" : { name : "몽크" , slot : 2, slotname : "Melee", fflogs : 7 },
	"DRG" : { name : "용기사" , slot : 2, slotname : "Melee", fflogs : 5 },
	"NIN" : { name : "닌자" , slot : 2, slotname : "Melee", fflogs : 8 },
	"SAM" : { name : "사무라이" , slot : 2, slotname : "Melee", fflogs : 15 },
	"RangeDPS" : { name : "원거리 물리 딜러" , slot : 3, slotname : "Range", fflogs : null },
	"BRD" : { name : "음유시인" , slot : 3, slotname : "Range", fflogs : 2 },
	"MCH" : { name : "기공사" , slot : 3, slotname : "Range", fflogs : 6 },
	"DNC" : { name : "무희" , slot : 3, slotname : "Range", fflogs : 16 },
	"MagicDPS" : { name : "캐스터" , slot : 4, slotname : "Caster", fflogs : null },
	"BLM" : { name : "흑마도사" , slot : 4, slotname : "Caster", fflogs : 3 },
	"SMN" : { name : "소환사" , slot : 4, slotname : "Caster", fflogs : 11 },
	"RDM" : { name : "적마도사" , slot : 4, slotname : "Caster", fflogs : 14 },
	"BLU" : { name : "청마도사" , slot : 4, slotname : "Caster", fflogs : null }
};

const language_convert = {
	0 : { xivapi : "en" , lodestone : "na" },
	1 : { xivapi : "ja" , lodestone : "jp" },
	2 : { xivapi : "de" , lodestone : "de" },
	3 : { xivapi : "fr" , lodestone : "fr" }
};

const jobs_convert = {
	"Paladin" : "나이트",
	"Warrior" : "전사",
	"Dark Knight" : "암흑기사",
	"Gunbreaker" : "건브레이커",
	"White Mage" : "백마도사",
	"Scholar" : "학자",
	"Astrologian" : "점성술사",
	"Monk" : "몽크",
	"Dragoon" : "용기사",
	"Ninja" : "닌자",
	"Samurai" : "사무라이",
	"Bard" : "음유시인",
	"Machinist" : "기공사",
	"Dancer" : "무희",
	"Black Mage" : "흑마도사",
	"Summoner" : "소환사",
	"Red Mage" : "적마도사"
};

const emoji_partyslotcheck = {
	"AA" : 0,
	"BB" : 1,
	"CC" : 2,
	"DD" : 3,
	"EE" : 4,
	"FF" : 5,
	"GG" : 6
};

const emoji_partyslot = [
	{ name : "AA" },
	{ name : "BB" },
	{ name : "CC" },
	{ name : "DD" },
	{ name : "EE" },
	{ name : "FF" },
	{ name : "GG" }
];

const emoji_id = [
	{ name : "PLD" },
	{ name : "WAR" },
	{ name : "DRK" },
	{ name : "GNB" },
	{ name : "WHM" },
	{ name : "SCH" },
	{ name : "AST" },
	{ name : "MNK" },
	{ name : "DRG" },
	{ name : "NIN" },
	{ name : "SAM" },
	{ name : "BRD" },
	{ name : "MCH" },
	{ name : "DNC" },
	{ name : "BLM" },
	{ name : "SMN" },
	{ name : "RDM" },
	{ name : "BLU" },
	{ name : "CRP" },
	{ name : "BSM" },
	{ name : "ARM" },
	{ name : "GSM" },
	{ name : "LTW" },
	{ name : "WVR" },
	{ name : "ALC" },
	{ name : "CUL" },
	{ name : "MIN" },
	{ name : "BOT" },
	{ name : "FSH" }
];

const dataCenterNames = [
	{ eng: "Mana" , kor: "마나" , region: "JP" , id:'857595753982984224' },
	{ eng: "Elemental" , kor: "엘레멘탈" , region: "JP" , id:'857595646247436318' },
	{ eng: "Gaia" , kor: "가이아" , region: "JP" , id:'857595712749043732' },
	{ eng: "Aether" , kor: "에테르" , region: "NA" , id:'857595946207412224' },
	{ eng: "Primal" , kor: "프라이멀" , region: "NA" , id:'857595490802991104' },
	{ eng: "Crystal" , kor: "크리스탈" , region: "NA" , id:'857596288786759730' },
	{ eng: "Chaos" , kor: "카오스" , region: "EU" , id:'857596201008627742' },
	{ eng: "Light" , kor: "라이트" , region: "EU" , id:'857596076526010368' }
];

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`App is running on port ${ PORT }`); });

const http = require("http");
setInterval(function () { http.get("http://final-fantasy-xiv-korea.herokuapp.com"); }, 900000);

client.on("ready", async () =>
{
	FFXIV_Guild = client.guilds.cache.get('817717037044465687');
	const data =
	[
		{
			name: '인증',
			description: '[서버-인증] 자신의 로드스톤을 인증합니다.',
			options:
			[
				{
					name: '주소',
					type: 'STRING',
					description: '캐릭터의 로드스톤 URL',
					required: true
				}
			]
		},
		{
			name: '개인정보',
			description: '[다이얼로그] 모두에게 나의 정보에 대한 조회를 허가 하거나 비허가 합니다.'
		},
		{
			name: '플레이어조회',
			description: '[다이얼로그] 해당 플레이어의 정보를 조회합니다.',
			options:
			[
				{
					name: '유저',
					type: 'USER',
					description: '해당 맴버를 @맨션 으로 적습니다.',
					required: true
				}
			]
		},
		{
			name: 'fc',
			description: '[FC] 자신의 FC를 홍보합니다.',
			options:
			[
				{
					name: '설명',
					type: 'STRING',
					description: 'FC홍보에 쓸 설명문을 작성합니다.',
					required: true
				}
			]
		},
		{
			name: '링크쉘',
			description: '[링크쉘] 자신의 링크쉘을 홍보합니다.',
			options:
			[
				{
					name: '형식',
					type: 'INTEGER',
					description: '링크쉘의 형식을 설정합니다.',
					required: true,
					choices:
					[
						{
							name: '일반 링크쉘',
							value: 1,
						},
						{
							name: '크로스 링크쉘',
							value: 2,
						}
					]
				},
				{
					name: '이름',
					type: 'STRING',
					description: '링크쉘의 이름을 적습니다.',
					required: true
				}
			]
		},
		{
			name: '파티',
			description: '[PVE 파티 모집] [PVP 파티 모집] 파티글을 생성합니다. ',
			options:
			[
				{
					name: '형식',
					type: 'INTEGER',
					description: '파티의 형식을 설정합니다.',
					required: true,
					choices:
					[
						{
							name: '4인',
							value: 1,
						},
						{
							name: '4인 [1,1,2]',
							value: 2,
						},
						{
							name: '8인',
							value: 3,
						},
						{
							name: '8인 [2,2,4]',
							value: 4,
						},
						{
							name: '24인 [1,2,5] x 3',
							value: 5,
						},
						{
							name: '48인 [2,2,4] x 6',
							value: 6,
						},
						{
							name: '56인 [2,2,4] x 7',
							value: 7,
						},
					]
				},
				{
					name: '제목',
					type: 'STRING',
					description: '파티글의 제목을 적습니다.',
					required: true
				}
			]
		},
		{
			name: '거래',
			description: '[거래-게시판] 거래글을 생성합니다.',
			options:
			[
				{
					name: '제목',
					type: 'STRING',
					description: '거래글의 제목을 적습니다.',
					required: true
				}
			]
		},
		{
			name: '거래종료',
			description: '[거래함] 거래를 종료합니다.'
		},
		{
			name: '로그',
			description: '[다이얼로그] 해당 플레이어의 로그를 조회합니다.',
			options:
			[
				{
					name: '존',
					type: 'INTEGER',
					description: '로그의 존을 설정합니다.',
					required: true,
					choices:
					[
						{
							name: '절 알렉산더 (5.1-5.2)',
							value: 3201,
						},
						{
							name: '절 알렉산더 (5.3)',
							value: 3207,
						},
						{
							name: '절 알렉산더 (5.4)',
							value: 3213,
						},
						{
							name: '절 알렉산더 (5.5)',
							value: 3219,
						},
						{
							name: '에덴 재생 영식 (5.4)',
							value: 3801,
						},
						{
							name: '에덴 재생 영식 (5.5)',
							value: 3807,
						},
						{
							name: '에덴 재생 영식 (5.5 Echo)',
							value: 3813,
						}
					]
				},
				{
					name: '유저',
					type: 'USER',
					description: '해당 맴버를 @맨션 으로 적습니다.',
					required: true
				}
			]
		},
		{
			name: '마켓',
			description: '[다이얼로그] 현재 아이템의 시장가를 조회합니다.',
			options:
			[
				{
					name: '품질',
					type: 'INTEGER',
					description: '아이템의 품질을 설정합니다.',
					required: true,
					choices:
					[
						{
							name: 'NQ-HQ',
							value: 0,
						},
						{
							name: 'NQ',
							value: 1,
						},
						{
							name: 'HQ',
							value: 2,
						}
					]
				},
				{
					name: '아이템',
					type: 'STRING',
					description: '아이템의 이름을 적습니다. [자신의 언어설정에 맞는 아이템명을 적으셔야 합니다.]',
					required: true
				}
			]
		},
		{
			name: '언어',
			description: '[다이얼로그] 클라리언트의 언어를 설정합니다.',
			options:
			[
				{
					name: '언어',
					type: 'INTEGER',
					description: '언어 리스트.',
					required: true,
					choices:
					[
						{
							name: '영어',
							value: 0,
						},
						{
							name: '일본어',
							value: 1,
						},
						{
							name: '독일어',
							value: 2,
						},
						{
							name: '프랑스어',
							value: 3,
						}
					]
				}
			]
		},
		{
			name: '스킬',
			description: '[스킬 툴팁] 스킬 툴팁을 추가합니다.',
			options:
			[
				{
					name: '직업',
					type: 'STRING',
					description: '직업을 설정합니다.',
					required: true,
					choices:
					[
						{
							name: '나이트',
							value: 'PLD',
						},
						{
							name: '전사',
							value: 'WAR',
						},
						{
							name: '암흑기사',
							value: 'DRK',
						},
						{
							name: '건브레이커',
							value: 'GNB',
						},
						{
							name: '백마도사',
							value: 'WHM',
						},
						{
							name: '학자',
							value: 'SCH',
						},
						{
							name: '점성술사',
							value: 'AST',
						},
						{
							name: '현자',
							value: 'SAG',
						},
						{
							name: '몽크',
							value: 'MNK',
						},
						{
							name: '용기사',
							value: 'DRG',
						},
						{
							name: '닌자',
							value: 'NIN',
						},
						{
							name: '사무라이',
							value: 'SAM',
						},
						{
							name: '리퍼',
							value: 'REP',
						},
						{
							name: '음유시인',
							value: 'BRD',
						},
						{
							name: '기공사',
							value: 'MCH',
						},
						{
							name: '무희',
							value: 'DNC',
						},
						{
							name: '흑마도사',
							value: 'BLM',
						},
						{
							name: '소환사',
							value: 'SMN',
						},
						{
							name: '적마도사',
							value: 'RDM',
						},
						{
							name: '청마도사',
							value: 'BLU',
						}
					]
				}
			]
		}
	];
	await FFXIV_Guild.commands.set(data);
});

client.on('guildMemberAdd', async (member) =>
{
	const Embed = new Discord.MessageEmbed()
	.setColor('#ff00ff')
	.setTitle("신규회원")
	.setAuthor(member.user.tag, member.user.displayAvatarURL())
	.setDescription("<@" + member.id + ">님이 서버에 입장하셨습니다.")
	.setThumbnail(member.user.displayAvatarURL())
	.setTimestamp()
	.setFooter("유저 ID : " + member.id);
	client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });	
	dataBase.query("SELECT Warning_Reason FROM UserSaveData WHERE User_Id = '" + member.id +"'", (err, res) =>
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			if (res.rows.length > 0)
			{
				if (res.rows[0].warning_reason != null)
				{
					const warningrole = member.guild.roles.cache.find(r => r.name === "경고");
					member.roles.add(warningrole);
				}
			}
		}
	});
});

client.on('guildMemberRemove', async (member) =>
{
	const Embed = new Discord.MessageEmbed()
	.setColor('#ff00ff')
	.setTitle("회원탈퇴")
	.setAuthor(member.user.tag, member.user.displayAvatarURL())
	.setDescription("<@" + member.id + ">님이 서버에서 나가셨습니다.\n이전 닉네임 : " + member.nickname)
	.setThumbnail(member.user.displayAvatarURL())
	.setTimestamp()
	.setFooter("유저 ID : " + member.id);
	client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });	
});

client.on('messageUpdate', async (oldMessage, newMessage) =>
{
	if (newMessage.guild == null) return;
	if (newMessage.author.bot) return;
	catchMessageUpdate = true;
	if(newMessage.channel.parent != channelsId.dialog)
	{
		if (newMessage.channel.parent != categorysId.inquire && newMessage.channel.parent != categorysId.negotiation && newMessage.channel.parent != categorysId.troubleshooting)
		{
			const Embed = new Discord.MessageEmbed()
			.setColor('#ff00ff')
			.setTitle("수정")
			.setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL())
			.setDescription("<@" + newMessage.author.id + ">님이 <#" + newMessage.channel + ">채널에 있는 [해당 메시지](" + newMessage.url + ") 를 수정했습니다. ")
			.addFields(
				{ name : "수정 전" , value : oldMessage.content },
				{ name : "수정 후" , value : newMessage.content })
			.setTimestamp()
			.setFooter("메시지 ID : " + newMessage.id);
			client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
		}
		else
		{
			const Embed = new Discord.MessageEmbed()
			.setColor('#ff00ff')
			.setTitle("수정")
			.setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL())
			.addFields(
				{ name : "수정 전" , value : oldMessage.content },
				{ name : "수정 후" , value : newMessage.content })
			.setTimestamp();
			const logChannelId = newMessage.channel.topic.split("-");
			client.channels.cache.get(logChannelId[0]).send({ embeds: [Embed] });
		}
	}
});

client.on("threadCreate", async (thread) =>
{
	console.log(thread);
});

let makingEmbed = new Discord.MessageEmbed();

let makingAuthor = {
	name : "" ,
	image : "" ,
	url : "" };
let makingField = {
	name : "" ,
	value : "" ,
	inline : "" };
let makingFooter = {
	name : "" ,
	image : "" };

let makingButton = new Discord.MessageButton();

let makingMenuOption =
{
	label:null,
	value:null,
	description:null,
	emoji:null,
	default:false
};
    
let makingMenu = new Discord.MessageSelectMenu();

client.on("interactionCreate", async (interaction) =>
{
	if (interaction.member.bot) return;

	if (interaction.isSelectMenu())
	{

	}
	else
	if (interaction.isButton())
	{
		switch(interaction.customId)
		{
			case 'edit_message':
			{
				if(interaction.message.embeds.length == 1)
				{
					if(interaction.message.embeds[0].author.name == interaction.member.displayName)
					{
						dataBase.query("SELECT Dialog FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
						{
							if (err)
							{
								console.log(err);
							}
							else
							{
								if(res.rows[0].dialog != null)
								{
									const ChannelId = client.channels.cache.get(res.rows[0].dialog);
									dataBase.query("UPDATE UserSaveData SET Dialog_Channel_Id = " + interaction.channel.id + ", Dialog_Message_Id = " + interaction.message.id + " WHERE User_Id = '" + interaction.member.id +"'");
									ChannelId.send("<@" + interaction.member.id + ">, <#" + interaction.channel.id + "> 의 글을 수정하시려면 아래의 명령어를 따라주세요.");
									ChannelId.send({ embeds: [interaction.message.embeds[0]] });
									if(interaction.channel.parent == categorysId.fc && interaction.channel != channelsId.fc)
									{
										ChannelId.send("```!fc설명 [설명]" +
										"\n!fc문의 [@맨션]" +
										"\n사진 1장을 업로드 하여 사진을 추가할 수 있습니다.```");
									}
									else
									if(interaction.channel.parent == categorysId.linkshell && interaction.channel != channelsId.linkshell)
									{
										ChannelId.send("```!링크쉘설명 [설명] " +
										"\n!링크쉘문의 [@맨션]```");
									}
									else
									if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve || interaction.channelId == channelsId.jp_party_pvp ||
										interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve || interaction.channelId == channelsId.na_party_pvp ||
										interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve || interaction.channelId == channelsId.eu_party_pvp ||
										(interaction.channel.isThread() &&
										(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve || interaction.channel.parentId == channelsId.jp_party_pvp ||
										interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve || interaction.channel.parentId == channelsId.na_party_pvp ||
										interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve || interaction.channel.parentId == channelsId.eu_party_pvp)))
									{
										ChannelId.send("```!파티설명 [설명]```");
									}
									else
									if(interaction.channel == channelsId.trade)
									{
										ChannelId.send("```!거래설명 [설명]```");
									}
								}
							}
						});
					}
				}
				break;
			}
			case 'delete_message':
			{
				if(interaction.message.embeds.length == 1)
				{
					if(interaction.message.embeds[0].author.name == interaction.member.displayName)
					{
						var Embed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle(interaction.channel.name)
						.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
						.setTimestamp()
						.setFooter("메시지 ID : " + interaction.message.id);
						if (interaction.channel == channelsId.jp_static_pve || interaction.channel == channelsId.jp_party_pve || interaction.channel == channelsId.jp_party_pvp ||
							interaction.channel == channelsId.na_static_pve || interaction.channel == channelsId.na_party_pve || interaction.channel == channelsId.na_party_pvp ||
							interaction.channel == channelsId.eu_static_pve || interaction.channel == channelsId.eu_party_pve || interaction.channel == channelsId.eu_party_pvp ||
							(interaction.channel.isThread() &&
							(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve || interaction.channel.parentId == channelsId.jp_party_pvp ||
							interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve || interaction.channel.parentId == channelsId.na_party_pvp ||
							interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve || interaction.channel.parentId == channelsId.eu_party_pvp)))
						{
							Embed.setDescription("<@" + interaction.member.id + ">님이 파티 모집글을 삭제하셨습니다.");
						}
						else
						if (interaction.channel != channelsId.fc && interaction.channel.parent == categorysId.fc)
						{
							Embed.setDescription("<@" + interaction.member.id  + ">님이 FC 홍보글을 삭제하셨습니다.");
						}
						else
						if (interaction.channel != channelsId.linkshell && interaction.channel.parent == categorysId.linkshell)
						{
							Embed.setDescription("<@" + interaction.member.id + ">님이 링크쉘 홍보글을 삭제하셨습니다.");
						}
						else
						if (interaction.channel == channelsId.trade)
						{
							Embed.setDescription("<@" + interaction.member.id + ">님이 해당 거래를 삭제하셨습니다.");
						}
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
						interaction.message.delete();
						dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + interaction.member.id +"'", (err, res) =>
						{
							if (!err)
							{
								if(res.rows[0].dialog_channel_id == interaction.channelId && res.rows[0].dialog_message_id == interaction.message.id)
								{
									dataBase.query("UPDATE UserSaveData SET Dialog_Channel_Id = null, Dialog_Message_Id = null WHERE User_Id = '" + interaction.member.id +"'");
								}
							}
						});
					}
				}
				break;
			}
			case 'trade':
			{
				const editEmbed = interaction.message.embeds[0];
				if(editEmbed.author.name != interaction.member.displayName)
				{
					const sellerId = editEmbed.fields[0].value.replace(/[^0-9]/g,'');
					if(interaction.guild.channels.cache.filter(channel => channel.parentId === categorysId.negotiation && channel.name === interaction.message.id).size == 0)
					{
						interaction.guild.channels.create(interaction.message.id,
						{
							type: 'text',
							parent: categorysId.negotiation,
							permissionOverwrites:
							[
								{
									id: interaction.member.id,
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								},
								{
									id: sellerId,
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								},
								{
									id: interaction.guild.roles.everyone,
									deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								},
								{
									id: '819869630893129742',
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								}
							],
							reason: '새 거래함 신설됨'
						}).then(channel =>
						{
							interaction.guild.channels.create(interaction.message.id,
							{
								type: 'text',
								parent: categorysId.negotiation_log,
								permissionOverwrites:
								[
									{
										id: interaction.guild.roles.everyone,
										deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
									},
									{
										id: '819869630893129742',
										allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
									}
								],
								reason: '새 거래함 기록장 신설됨'
							}).then(logchannel =>
							{
								channel.setTopic(logchannel.id + "-" + interaction.message.id);
								const logEmbed = new Discord.MessageEmbed()
								.setColor('#00ffff')
								.setTitle("거래함")
								.setDescription("<@" + interaction.member.id + ">님과 <@" + sellerId + ">님이 참여하셨습니다.")
								.setTimestamp();
								logchannel.send({ embeds: [logEmbed] });
							});
							const Embed = new Discord.MessageEmbed()
							.setColor('#00ffff')
							.setTitle(interaction.channel.name)
							.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
							.setDescription("<@" + interaction.member.id + ">님이 [해당 거래](" + interaction.message.url + ")에 구매 신청을 하셨습니다.")
							.setTimestamp()
							.setFooter("메시지 ID : " + interaction.message.id);
							client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
							let row = new Discord.MessageActionRow();
							const components = interaction.message.components;
							if(components.length > 0)
							{
								for(var i = 0; i < components.length; i++)
								{
									if(components[i].type == 'ACTION_ROW')
									{
										for(var j = 0; j < components[i].components.length; j++)
										{
											var componentdata = components[i].components[j];
											if(componentdata.custom_id == 'trade')
											{
												componentdata.setDisabled();
											}
											row.addComponents(componentdata);
										}
										break;
									}
								}
							}
							interaction.message.edit({ embeds: [interaction.message.embeds[0]] ,components: [row] });
							channel.send("<@" + interaction.member.id + "> 님이 <@" + sellerId + ">님에게 구매 신청을 하셨습니다.\n용무가 끝나면 /거래종료 를 입력하여 거래를 종료하시면 됩니다.");
						});
					}
				}
				break;
			}
			case 'inquire':
			{
				if(interaction.guild.channels.cache.filter(channel => channel.parentId === categorysId.inquire && channel.name === interaction.member.id).size == 0)
				{
					interaction.guild.channels.create(interaction.member.id,
					{
						type: 'text',
						parent: categorysId.inquire,
						permissionOverwrites:
						[
							{
								id: interaction.member.id,
								allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							},
							{
								id: interaction.guild.roles.everyone,
								deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							},
							{
								id: '857669793620426752',
								allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							},
							{
								id: '819869630893129742',
								allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							}
						],
						reason: '새 건의함 신설됨'
					}).then(channel =>
					{
						interaction.guild.channels.create(interaction.member.id,
						{
							type: 'text',
							parent: categorysId.inquire_log,
							permissionOverwrites:
							[
								{
									id: interaction.guild.roles.everyone,
									deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								},
								{
									id: '819869630893129742',
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								},
								{
									id: '857669793620426752',
									allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
									deny: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
								}
							],
							reason: '새 건의함 기록장 신설됨'
						}).then(logchannel =>
						{
							channel.setTopic(logchannel.id);
							const logEmbed = new Discord.MessageEmbed()
							.setColor('#00ffff')
							.setTitle("건의함")
							.setDescription("<@" + interaction.member.id + ">님이 참여하셨습니다.")
							.setTimestamp();
							logchannel.send({ embeds: [logEmbed] });
						});
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff0000')
						.setTitle(channel.name)
						.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
						.setDescription("<@" + interaction.member.id + ">님이 관리자를 호출하셨습니다.\n<#" + channel.id + ">")
						.setTimestamp()
						.setFooter("채널 ID : " + channel.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
						channel.send("<@" + interaction.member.id + "> @here 이곳에서 질문하시면 됩니다.");
					});
				}
				break;
			}
		}
	}
	else
    if (interaction.isCommand())
	{
		switch(interaction.commandName)
		{
			case '인증':
			{
				if (interaction.channelId == channelsId.certification)
				{
					await interaction.deferReply({ ephemeral: true });
					var check = false;
					const url = interaction.options.get("주소").value.split("/");
					for(var i = 0; i < url.length; i++)
					{
						if(url[i].toLowerCase() == "character")
						{
							check = true;
							if(i + 1 < url.length)
								loadFile(interaction, encodeURIComponent(url[i + 1]));
							else
								interaction.editReply({ content: "/인증 [로드스톤 URL]" });
							break;
						}
					}
					if(!check)
						interaction.editReply({ content: "/인증 [로드스톤 URL]" });
				}
				break;
			}
			case '개인정보':
			{
				if (interaction.channel.parent == categorysId.dialog)
				{
					await interaction.deferReply({ ephemeral: true });
					dataBase.query("SELECT Config FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
					{
						if (err)
						{
							console.log(err);
							interaction.editReply({ content: "플레이어 데이터를 찾지 못했습니다.\n관리자에게 보고하십시오." });
						}
						else
						{
							var userconfig = res.rows[0].config;
							if((userconfig & config.private) == 0)
							{
								userconfig += config.private;
								interaction.editReply({ content: "자신의 정보를 비공개 하셨습니다." });
							}
							else
							{
								userconfig -= config.private;
								interaction.editReply({ content: "자신의 정보를 공개 하셨습니다." });
							}
							dataBase.query("UPDATE UserSaveData SET Config = '" + userconfig + "' WHERE User_Id='" + interaction.member.id +"'");
						}
					});
				}
				break;
			}
			case '플레이어조회':
			{
				if (interaction.channel.parent == categorysId.dialog)
				{
					await interaction.deferReply({ ephemeral: true });
					interaction.guild.members.fetch(interaction.options.get("유저").value).then(target =>
					{
						if(!target.user.bot)
						{
							const name = target.displayName.split(" ", 2);
							if(name.length == 2)
							{
								const server = name[1].split("@", 2);
								if(server.length == 2)
								{
									var dataCenter;
									for(var i = 0; i < dataCenterNames.length; i++)
									{
										if(target.roles.cache.has(dataCenterNames[i].id))
										{
											dataCenter = i;
											break;
										}
									}
									dataBase.query("SELECT FFXIV_Id, Config FROM UserSaveData WHERE User_Id='" + target.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply({ content: "플레이어 조회에 실패했습니다.\n관리자에게 보고하십시오." });
										}
										else
										{
											if((res.rows[0].config & config.private) == 0)
											{
												fetch("https://xivapi.com/character/" + res.rows[0].ffxiv_id + "?columns=Character.FreeCompanyId,Character.FreeCompanyName,Character.ClassJobs,Character.Avatar").then(webData =>
												{
													webData.json().then(data =>
													{
														var jobs = "";
														for(var i = 0; i< emoji_id.length; i++)
														{
															if(i == 4 || i == 7 || i == 11 || i == 14 || i == 18 || i == 22 || i == 26)
																jobs += "\n";
															switch(i)
															{
																case 0:
																{
																	jobs += "탱커\n";
																	break;
																}
																case 4:
																{
																	jobs += "힐러\n";
																	break;
																}
																case 7:
																{
																	jobs += "근거리 딜러\n";
																	break;
																}
																case 11:
																{
																	jobs += "원거리 물리 딜러\n";
																	break;
																}
																case 14:
																{
																	jobs += "캐스터\n";
																	break;
																}
																case 18:
																{
																	jobs += "제작\n";
																	break;
																}
																case 26:
																{
																	jobs += "채집\n";
																	break;
																}
															}
															var emojiId = client.emojis.cache.find(emoji => emoji.name == emoji_id[i].name);
															jobs += `${emojiId}` + " ";
															if(4 <= i && i <= 7)
																jobs += data.Character.ClassJobs[i+3].Level + " ";
															else
															if(8 <= i && i <= 10)
																jobs += data.Character.ClassJobs[i-4].Level + " ";
															else
																jobs += data.Character.ClassJobs[i].Level + " ";
														}
														const Embed = new Discord.MessageEmbed()
														.setColor(getDataCenterColor(target, interaction.guild))
														.setTitle("로드스톤")
														.setURL("https://na.finalfantasyxiv.com/lodestone/character/" + res.rows[0].ffxiv_id)
														.setAuthor(target.displayName, target.user.displayAvatarURL())
														.setDescription("데이터 센터 : " + dataCenterNames[dataCenter].kor + "\n월드 : " + server[1])
														.setThumbnail(data.Character.Avatar)
														.addField("프리컴퍼니", "[" + data.Character.FreeCompanyName + "](https://na.finalfantasyxiv.com/lodestone/freecompany/" + data.Character.FreeCompanyId + ")", true)
														.addField("프프로그", "[링크](https://www.fflogs.com/character/" + dataCenterNames[dataCenter].region + "/" + server[1] + "/" + name[0] + "%20" + server[0] + ")", true)
														.addField("잡 리스트", jobs, false)
														.setTimestamp();
														interaction.channel.send({ embeds: [Embed] }).then(message => { setTimeout(() => message.delete(), 30000); });
														interaction.editReply("정상적으로 조회되었습니다.");
													});
												}).
												catch(error => {
													interaction.editReply({ content: "/플레이어조회 [@맨션]" });
												});
											}
											else
												interaction.editReply({ content: "해당 플레이어는 비공개로 되어있습니다." });
										}
									});
								}
								else
									interaction.editReply({ content: "/플레이어조회 [@맨션]" });
							}
							else
								interaction.editReply({ content: "/플레이어조회 [@맨션]" });
						}
						else
							interaction.editReply({ content: "/플레이어조회 [@맨션]" });
					}).
					catch(error => 
					{
						console.log(error);
						interaction.editReply({ content: "/플레이어조회 [@맨션]" });
					});
				}
				break;
			}
			case '로그':
			{
				if (interaction.channel.parent == categorysId.dialog)
				{
					await interaction.deferReply({ ephemeral: true });
					interaction.guild.members.fetch(interaction.options.get("유저").value).then(target =>
					{
						if(!target.user.bot)
						{
							const name = target.displayName.split(" ", 2);
							if(name.length == 2)
							{
								const server = name[1].split("@", 2);
								if(server.length == 2)
								{
									var dataCenter;
									for(var i = 0; i < dataCenterNames.length; i++)
									{
										if(target.roles.cache.has(dataCenterNames[i].id))
										{
											dataCenter = i;
											break;
										}
									}
									dataBase.query("SELECT FFXIV_Id, Config FROM UserSaveData WHERE User_Id='" + target.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply({ content: "플레이어 로그 조회에 실패했습니다.\n관리자에게 보고하십시오." });
										}
										else
										{
											if((res.rows[0].config & config.private) == 0)
											{
												getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
												{
													var zone = interaction.options.get("존").value;
													fetch("https://www.fflogs.com/v1/rankings/character/" + name[0] + "%20" + server[0] + "/" + server[1] + "/" + dataCenterNames[dataCenter].region + "/?api_key=" + process.env.FFLOGS + "&zone=" + parseInt(zone / 100) + "&partition=" + (zone % 100) + "&metric=rdps").then(webData =>
													{
														webData.json().then(data =>
														{
															if(data.hidden == true)
															{
																interaction.editReply("해당 플레이어의 로그는 비공개 입니다.");
																return;
															}
															var logs;
															const Embed = new Discord.MessageEmbed()
															.setColor(getDataCenterColor(target, interaction.guild))
															.setTitle("프프로그")
															.setURL("https://www.fflogs.com/character/" + dataCenterNames[dataCenter].region + "/" + server[1] + "/" + name[0] + "%20" + server[0] + "#zone=" + parseInt(zone / 100) + "&partition=" + zone % 100)
															.setAuthor(target.displayName, target.user.displayAvatarURL())
															.setThumbnail(avatarurl);
															switch(parseInt(zone / 100))
															{
																case 32:
																{
																	logs = [""];
																	for(var i = 0; i < data.length; i++)
																	{
																		if(logs[0].length > 0)
																			logs[0] += "\n\n";
																		logs[0] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																	}
																	for(var j = 0; j < logs.length; j++)
																	{
																		if(logs[j] == "")
																			logs[j] = "기록 없음";
																	}
																	Embed.addField("절 알렉산더", logs[0]);
																	break;
																}
																case 38:
																{
																	logs = ["", "", "", "", ""];
																	for(var i = 0; i < data.length; i++)
																	{
																		if(data[i].difficulty == 101)
																		{
																			if(data[i].encounterID == 73)
																			{
																				if(logs[0].length > 0)
																					logs[0] += "\n\n";
																				logs[0] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																			}
																			else
																			if(data[i].encounterID == 74)
																			{
																				if(logs[1].length > 0)
																					logs[1] += "\n\n";
																				logs[1] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																			}
																			else
																			if(data[i].encounterID == 75)
																			{
																				if(logs[2].length > 0)
																					logs[2] += "\n\n";
																				logs[2] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																			}
																			else
																			if(data[i].encounterID == 76)
																			{
																				if(logs[3].length > 0)
																					logs[3] += "\n\n";
																				logs[3] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																			}
																			else
																			if(data[i].encounterID == 77)
																			{
																				if(logs[4].length > 0)
																					logs[4] += "\n\n";
																				logs[4] += jobs_convert[data[i].spec] + "\n순위 : " + data[i].percentile + "\nRDPS : " + data[i].total;
																			}
																		}
																	}
																	for(var j = 0; j < logs.length; j++)
																	{
																		if(logs[j] == "")
																			logs[j] = "기록 없음";
																	}
																	Embed.setDescription("에덴 재생 영식")
																	.addField("1층", logs[0], true)
																	.addField('\u200b', '\u200b', true)
																	.addField("2층", logs[1], true)
																	.addField("3층", logs[2], true)
																	.addField('\u200b', '\u200b', true)
																	.addField("4층 전반", logs[3], true)
																	.addField("4층 후반", logs[4], true);
																	break;
																}
															}
															interaction.channel.send({ embeds: [Embed] }).then(message => { setTimeout(() => message.delete(), 30000); });
															interaction.editReply("정상적으로 조회되었습니다.");
														});
													});
												});
											}
											else
												interaction.editReply({ content: "해당 플레이어는 비공개로 되어있습니다." });
										}
									});
								}
								else
									interaction.editReply({ content: "/로그 [존] [@맨션]" });
							}
							else
								interaction.editReply({ content: "/로그 [존] [@맨션]" });
						}
						else
							interaction.editReply({ content: "/로그 [존] [@맨션]" });
					}).
					catch(error => 
					{
						console.log(error);
						interaction.editReply({ content: "/로그 [존] [@맨션]" });
					});
				}
				break;
			}
			case '마켓':
			{
				if (interaction.channel.parent == categorysId.dialog)
				{
					await interaction.deferReply({ ephemeral: true });
					const itemName = interaction.options.get("아이템").value;
					var dataCenter;
					for(var i = 0; i < dataCenterNames.length; i++)
					{
						if(interaction.member.roles.cache.has(dataCenterNames[i].id))
						{
							dataCenter = i;
							break;
						}
					}
					dataBase.query("SELECT Language FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
					{
						if (err)
						{
							console.log(err);
							interaction.editReply({ content: "플레이어 데이터를 찾지 못했습니다.\n관리자에게 보고하십시오." });
						}
						else
						{
							fetch("https://xivapi.com/search?language=" + language_convert[res.rows[0].language].xivapi + "&string=" + encodeURIComponent(itemName).replace(/'/gi,"%27")).then(webData =>
							{
								webData.json().then(data =>
								{
									for(var i=0; i < data.Results.length; i++)
									{
										if(data.Results[i].UrlType == "Item" && data.Results[i].Name.toLowerCase() == itemName.toLowerCase())
										{
											const itemId = data.Results[i].ID;
											fetch("https://universalis.app/api/" + dataCenterNames[dataCenter].eng + "/" + itemId).then(webData1 =>
											{
												webData1.json().then(data1 =>
												{
													const hq = interaction.options.get("품질").value;
													var quality = "NQ-HQ";
													if(hq == 1)
														quality = "NQ";
													else if(hq == 2)
														quality = "HQ";
													const Embed = new Discord.MessageEmbed()
													.setColor(getDataCenterColor(interaction.member, interaction.guild))
													.setTitle(data.Results[i].Name)
													.setThumbnail("https://xivapi.com" + data.Results[i].Icon)
													.setDescription("데이터센터 : " + dataCenterNames[dataCenter].kor + "\n품질 : " + quality)
													.setTimestamp();
													var marketdata = ["","",""];
													var stack = 0;
													for(var j=0; j<data1.listings.length; j++)
													{
														if (hq == 0 || (hq == 1 && data1.listings[j].hq == false) || (hq == 2 && data1.listings[j].hq == true))
														{
															marketdata[0] += data1.listings[j].quantity + "개 x " + data1.listings[j].pricePerUnit + "길\n";
															marketdata[1] += data1.listings[j].quantity * data1.listings[j].pricePerUnit + "길\n";
															marketdata[2] += data1.listings[j].worldName + "\n";
															stack++;
															if(stack >= 10)
																break;
														}
													}
													if(stack > 0)
													{
														Embed.addField("수량 x 단일가", marketdata[0], true);
														Embed.addField("총가", marketdata[1], true);
														Embed.addField("서버", marketdata[2], true);
														interaction.channel.send({ embeds: [Embed] });
														interaction.editReply({ content: "성공적으로 조회했습니다." });
													}
													else
														interaction.editReply({ content: "마켓에 해당품목이 존재하지 않습니다." });
												});
											});
											return;
										}
									}
									interaction.editReply({ content: "없는 아이템입니다." });
								});
							});
						}
					});
				}
				break;
			}
			case '언어':
			{
				if (interaction.channel.parent == categorysId.dialog)
				{
					await interaction.deferReply({ ephemeral: true });
					const language = interaction.options.get("언어").value;
					dataBase.query("UPDATE UserSaveData SET Language = '" + language + "' WHERE User_Id='" + interaction.member.id +"'");
					interaction.editReply({ content: "성공적으로 언어를 변경했습니다." });
				}
				break;
			}
			case 'fc':
			{
				if (interaction.channelId != channelsId.fc && interaction.channel.parent == categorysId.fc)
				{
					await interaction.deferReply({ ephemeral: true });
					if (interaction.options.get("설명").value.includes("@everyone"))
						interaction.editReply("everyone을 사용하실 수 없습니다.");
					else
					{
						dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
						{
							if (err)
							{
								console.log(err);
								interaction.editReply({ content: "플레이어 데이터를 찾지 못했습니다.\n관리자에게 보고하십시오." });
							}
							else
							{
								fetch("https://xivapi.com/character/" + res.rows[0].ffxiv_id + "?columns=Character.FreeCompanyId,Character.FreeCompanyName").then(webData =>
								{
									webData.json().then(data =>
									{
										if(data.Character.FreeCompanyId != null && data.Character.FreeCompanyId != 0)
										{
											fetch("https://xivapi.com/freecompany/" + data.Character.FreeCompanyId + "?data=FCM").then(fcWebData =>
											{
												fcWebData.json().then(fcData =>
												{
													var DataCenterName;
													for(var i = 0; i < dataCenterNames.length; i++)
													{
														if(fcData.FreeCompany.DC == dataCenterNames[i].eng)
														{
															DataCenterName =  dataCenterNames[i].kor;
															break;
														}
													}
													const text = interaction.options.get("설명").value;
													const Embed = new Discord.MessageEmbed()
													.setColor(getDataCenterColor(interaction.member, interaction.guild))
													.setTitle(fcData.FreeCompany.Name)
													.setURL("https://na.finalfantasyxiv.com/lodestone/freecompany/" + data.Character.FreeCompanyId)
													.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
													.setDescription(text)
													.setThumbnail(fcData.FreeCompany.Crest[fcData.FreeCompany.Crest.length - 1])
													.addField("데이터 센터", DataCenterName, true)
													.addField("월드", fcData.FreeCompany.Server, true)
													.addField("약칭", fcData.FreeCompany.Tag, true)
													.addField("슬로건", fcData.FreeCompany.Slogan)
													.addField("문의", "<@" + interaction.member.id + ">")
													.setTimestamp();
													const Button1 = new Discord.MessageButton()
													.setStyle("PRIMARY")
													.setCustomId("edit_message")
													.setLabel("수정하기");
													const Button2 = new Discord.MessageButton()
													.setStyle("DANGER")
													.setCustomId("delete_message")
													.setLabel("제거하기");
													const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
													interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
													{
														var editEmbed = message.embeds[0];
														editEmbed.setFooter("메시지 ID : " + message.id);
														message.edit({ embeds: [editEmbed] });
														const logEmbed = new Discord.MessageEmbed()
														.setColor('#00ffff')
														.setTitle(interaction.channel.name)
														.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
														.setDescription("<@" + interaction.member.id + ">님이 [" + fcData.FreeCompany.Name + "]("+ message.url +") 모집을 게시하셨습니다.")
														.setTimestamp()
														.setFooter("메시지 ID : " + message.id);
														client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
														interaction.editReply("정상적으로 생성되었습니다.");
													});
												});
											}).
											catch(error => {
												interaction.editReply({ content: "/fc [설명]" });
											});
										}
										else
											interaction.editReply({ content: "FC가 없습니다." });
									});
								}).
								catch(error => {
									interaction.editReply({ content: "/fc [설명]" });
								});
							}
						});
					}
				}
				break;
			}
			case '링크쉘':
			{
				if (interaction.channelId != channelsId.linkshell && interaction.channel.parent == categorysId.linkshell)
				{
					await interaction.deferReply({ ephemeral: true });
					switch(interaction.options.get("형식").value)
					{
						case 1:
						{
							const linkshell = interaction.options.get("이름").value;
							const name = interaction.member.displayName.split(" ", 2);
							const server = name[1].split("@", 2);
							var check = false;
							fetch("https://xivapi.com/linkshell/search?name=" + encodeURIComponent(linkshell) + "&server=" + server[1]).then(webData =>
							{
								webData.json().then(data =>
								{
									for(var i = 0; i < data.Results.length; i++)
									{
										if(data.Results[i].Name == linkshell)
										{
											const linkshellserver = data.Results[i].Server.split("\u00a0", 1);
											if(linkshellserver == server[1])
											{
												check = true;
												var DataCenterName;
												for(var j = 0; j < dataCenterNames.length; j++)
												{
													if(interaction.member.roles.cache.has(dataCenterNames[j].id))
													{
														DataCenterName = dataCenterNames[j].kor;
														break;
													}
												}
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(linkshell)
												.setURL("https://na.finalfantasyxiv.com/lodestone/linkshell/" + data.Results[i].ID)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.addField("문의", "<@" + interaction.member.id + ">")
												.addField("타입", "일반 링크쉘", true)
												.addField("데이터 센터", DataCenterName, true)
												.addField("월드", server[1], true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [" + linkshell + "]("+ message.url +") 모집을 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
												break;
											}
										}
									}
									if(!check)
									{
										interaction.editReply({ content: "/링크쉘 [타입] [링크쉘 이름]" });
									}
								});
							});
							break;
						}
						case 2:
						{
							const linkshell = interaction.options.get("이름").value;
							var check = false;
							fetch("https://xivapi.com/linkshell/crossworld/search?name=" + encodeURIComponent(linkshell)).then(webData =>
							{
								webData.json().then(data =>
								{
									var DataCenterName;
									var ENGDataCenterName;
									for(var j = 0; j < dataCenterNames.length; j++)
									{
										if(interaction.member.roles.cache.has(dataCenterNames[j].id))
										{
											DataCenterName = dataCenterNames[j].kor;
											ENGDataCenterName = dataCenterNames[j].eng;
											break;
										}
									}
									for(var i = 0; i < data.Results.length; i++)
									{
										if(data.Results[i].Name == linkshell)
										{
											if(ENGDataCenterName == data.Results[i].Server)
											{
												check = true;
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(linkshell)
												.setURL("https://na.finalfantasyxiv.com/lodestone/crossworld_linkshell/" + data.Results[i].ID)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.addField("문의", "<@" + interaction.member.id + ">")
												.addField("타입", " 크로스-월드 링크쉘", true)
												.addField("데이터 센터", DataCenterName, true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [" + linkshell + "]("+ message.url +") 모집을 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
												break;
											}
										}
									}
									if(!check)
									{
										interaction.editReply({ content: "/링크쉘 [타입] [링크쉘 이름]" });
									}
								});
							});
							break;
						}
					}
				}
				break;
			}
			case '파티':
			{
				if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve || interaction.channelId == channelsId.jp_party_pvp ||
					interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve || interaction.channelId == channelsId.na_party_pvp ||
					interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve || interaction.channelId == channelsId.eu_party_pvp ||
					(interaction.channel.isThread() && 
					(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve || interaction.channel.parentId == channelsId.jp_party_pvp ||
					interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve || interaction.channel.parentId == channelsId.na_party_pvp ||
					interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve || interaction.channel.parentId == channelsId.eu_party_pvp)))
				{
					await interaction.deferReply({ ephemeral: true });
					if (interaction.options.get("제목").value.includes("@everyone"))
						interaction.editReply("everyone을 사용하실 수 없습니다.");
					else
					{
						switch(interaction.options.get("형식").value)
						{
							case 1:
							{
								if (interaction.channelId == channelsId.jp_party_pve || interaction.channelId == channelsId.jp_party_pvp ||
									interaction.channelId == channelsId.na_party_pve || interaction.channelID == channelsId.na_party_pvp ||
									interaction.channelId == channelsId.eu_party_pve || interaction.channelId == channelsId.eu_party_pvp)
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{ 
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error =>
											{
												interaction.editReply("/파티 [타입] [파티제목]");
											});
										}
									});
								}
								else
									interaction.editReply("공대 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 2:
							{
								if (interaction.channelId == channelsId.jp_party_pve || interaction.channelId == channelsId.jp_party_pvp ||
									interaction.channelId == channelsId.na_party_pve || interaction.channelID == channelsId.na_party_pvp ||
									interaction.channelId == channelsId.eu_party_pve || interaction.channelId == channelsId.eu_party_pvp ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_party_pve || interaction.channel.parentId == channelsId.jp_party_pvp ||
									interaction.channel.parentId == channelsId.na_party_pve || interaction.channel.parentId == channelsId.na_party_pvp ||
									interaction.channel.parentId == channelsId.eu_party_pve || interaction.channel.parentId == channelsId.eu_party_pvp)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{ 
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("탱커", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("힐러", "공석", true)
												.addField("딜러", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("딜러", "공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error =>
											{
												interaction.editReply("/파티 [타입] [파티제목]");
											});
										}
									});
								}
								else
									interaction.editReply("PVE 공대 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 3:
							{
								if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve ||
									interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve ||
									interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve ||
									interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve ||
									interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{ 
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.addField("공용", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("공용", "공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error => {
												interaction.editReply("/파티 [타입] [파티제목]").then(message => { setTimeout(() => message.delete(), 10000); });
											});
										}
									});
								}
								else
									interaction.editReply("PVP 파티 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 4:
							{
								if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve ||
									interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve ||
									interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve ||
									interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve ||
									interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{ 
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("탱커", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("탱커", "공석", true)
												.addField("힐러", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("힐러", "공석", true)
												.addField("딜러", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("딜러", "공석", true)
												.addField("딜러", "공석", true)
												.addField('\u200b', '\u200b', true)
												.addField("딜러", "공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error => {
												interaction.editReply("/파티 [타입] [파티제목]").then(message => { setTimeout(() => message.delete(), 10000); });
											});
										}
									});
								}
								else
									interaction.editReply("PVP 파티 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 5:
							{
								if (interaction.channelId == channelsId.jp_party_pve ||
									interaction.channelId == channelsId.na_party_pve ||
									interaction.channelId == channelsId.eu_party_pve ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_party_pve ||
									interaction.channel.parentId == channelsId.na_party_pve ||
									interaction.channel.parentId == channelsId.eu_party_pve)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("연합 A", "탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 B", "탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 C", "탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error => {
												interaction.editReply("/파티 [타입] [파티제목]").then(message => { setTimeout(() => message.delete(), 10000); });
											});
										}
									});
								}
								else
									interaction.editReply("PVP 파티 모집 게시판과 PVE 공대 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 6:
							{
								if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve ||
									interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve ||
									interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve ||
									interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve ||
									interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("연합 A", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 B", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 C", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 D", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 E", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 F", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error => {
												interaction.editReply("/파티 [타입] [파티제목]").then(message => { setTimeout(() => message.delete(), 10000); });
											});
										}
									});
								}
								else
									interaction.editReply("PVP 파티 모집 게시판에 개설할 수 없습니다.");
								break;
							}
							case 7:
							{
								if (interaction.channelId == channelsId.jp_static_pve || interaction.channelId == channelsId.jp_party_pve ||
									interaction.channelId == channelsId.na_static_pve || interaction.channelId == channelsId.na_party_pve ||
									interaction.channelId == channelsId.eu_static_pve || interaction.channelId == channelsId.eu_party_pve ||
									(interaction.channel.isThread() &&
									(interaction.channel.parentId == channelsId.jp_static_pve || interaction.channel.parentId == channelsId.jp_party_pve ||
									interaction.channel.parentId == channelsId.na_static_pve || interaction.channel.parentId == channelsId.na_party_pve ||
									interaction.channel.parentId == channelsId.eu_static_pve || interaction.channel.parentId == channelsId.eu_party_pve)))
								{
									dataBase.query("SELECT FFXIV_Id FROM UserSaveData WHERE User_Id='" + interaction.member.id +"'", (err, res) =>
									{
										if (err)
										{
											console.log(err);
											interaction.editReply("파티 생성에 실패했습니다.\n관리자에게 보고하십시오.");
										}
										else
										{
											getAvatarURL(res.rows[0].ffxiv_id).then((avatarurl) =>
											{
												const Embed = new Discord.MessageEmbed()
												.setColor(getDataCenterColor(interaction.member, interaction.guild))
												.setTitle(interaction.options.get("제목").value)
												.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
												.setDescription("설명")
												.setThumbnail(avatarurl)
												.addField("연합 A", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 B", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 C", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 D", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 E", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 F", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.addField("연합 G", "탱커\n공석\n\n탱커\n공석\n\n힐러\n공석\n\n힐러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석\n\n딜러\n공석", true)
												.setTimestamp();
												const Button1 = new Discord.MessageButton()
												.setStyle("PRIMARY")
												.setCustomId("edit_message")
												.setLabel("수정하기");
												const Button2 = new Discord.MessageButton()
												.setStyle("DANGER")
												.setCustomId("delete_message")
												.setLabel("제거하기");
												const row = new Discord.MessageActionRow().addComponents(Button1, Button2);
												interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
												{
													var editEmbed = message.embeds[0];
													editEmbed.setFooter("메시지 ID : " + message.id);
													message.edit({ embeds: [editEmbed] });
													const logEmbed = new Discord.MessageEmbed()
													.setColor('#00ffff')
													.setTitle(interaction.channel.name)
													.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
													.setDescription("<@" + interaction.member.id + ">님이 [해당파티](" + message.url + ") 를 게시하셨습니다.")
													.setTimestamp()
													.setFooter("메시지 ID : " + message.id);
													client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
													interaction.editReply({ content: "정상적으로 생성되었습니다." });
												});
											}).
											catch(error => {
												interaction.editReply("/파티 [타입] [파티제목]").then(message => { setTimeout(() => message.delete(), 10000); });
											});
										}
									});
								}
								else
									interaction.editReply("PVP 파티 모집 게시판에 개설할 수 없습니다.");
								break;
							}
						}
					}
				}
				break;
			}
			case '거래':
			{
				if (interaction.channelId == channelsId.trade)
				{
					await interaction.deferReply({ ephemeral: true });
					const tradeName = interaction.options.get("제목").value;
					const name = interaction.member.displayName.split(" ", 2);
					const server = name[1].split("@", 2);
					var DataCenterName;
					for(var j = 0; j < dataCenterNames.length; j++)
					{
						if(interaction.member.roles.cache.has(dataCenterNames[j].id))
						{
							DataCenterName = dataCenterNames[j].kor;
							break;
						}
					}
					const Embed = new Discord.MessageEmbed()
					.setColor(getDataCenterColor(interaction.member, interaction.guild))
					.setTitle(tradeName)
					.setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
					.addField("판매자", "<@" + interaction.member.id + ">", true)
					.addField("데이터 센터", DataCenterName, true)
					.addField("월드", server[1], true)
					.setTimestamp();
					const Button1 = new Discord.MessageButton()
					.setStyle("SUCCESS")
					.setCustomId("trade")
					.setLabel("거래하기");
					const Button2 = new Discord.MessageButton()
					.setStyle("PRIMARY")
					.setCustomId("edit_message")
					.setLabel("수정하기");
					const Button3 = new Discord.MessageButton()
					.setStyle("DANGER")
					.setCustomId("delete_message")
					.setLabel("제거하기");
					const row = new Discord.MessageActionRow().addComponents(Button1, Button2, Button3);
					interaction.channel.send({ embeds: [Embed] ,components: [row] }).then(message =>
					{
						var editEmbed = message.embeds[0];
						editEmbed.setFooter("메시지 ID : " + message.id);
						message.edit({ embeds: [editEmbed] });
						const logEmbed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle(interaction.channel.name)
						.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
						.setDescription("<@" + interaction.member.id + ">님이 [" + tradeName + "]("+ message.url +") 거래글을 게시하셨습니다.")
						.setTimestamp()
						.setFooter("메시지 ID : " + message.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
						interaction.editReply({ content: "정상적으로 생성되었습니다." });
					});
					break;
				}
				break;
			}
			case '스킬':
			{
				if (interaction.channel.isThread())
				{
					if (interaction.channel.parent.parentId == categorysId.job_battle)
					{
						if (interaction.member.roles.cache.has(interaction.guild.roles.cache.find(r => r.name === "관리자").id))
						{
							if (interaction.channel.name == "PVE 스킬 툴팁")
							{
								await interaction.deferReply({ ephemeral: true });
								interaction.channel.bulkDelete(99).then(() => 
								{
									const job = interaction.options.get("직업").value;
									interaction.channel.send("```전용 스킬```");
									const jobSkill = require('./Skills/' + job + 'Skill.json');
									for(var i = 0; i<jobSkill.length; i++)
									{
										const Embed = new Discord.MessageEmbed()
										.setColor('#ff0000')
										.setTitle(jobSkill[i].name.replace(/`/gi,"\n"))
										.setDescription(jobSkill[i].description.replace(/`/gi,"\n"))
										.setThumbnail(jobSkill[i].icon);
										if(jobSkill[i].type != null)
											Embed.addField("종류", jobSkill[i].type, true)
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].cast != null)
											Embed.addField("시전 시간", jobSkill[i].cast, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].recast != null)
											Embed.addField("재사용 시간", jobSkill[i].recast, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].range != null)
											Embed.addField("거리", jobSkill[i].range, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].radius != null)
											Embed.addField("범위", jobSkill[i].radius, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].mp != null)
											Embed.addField("MP", jobSkill[i].mp, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(jobSkill[i].level != null)
											Embed.addField("요구 레벨", jobSkill[i].level);
										interaction.channel.send({ embeds: [Embed] });
									}
									interaction.channel.send("```공용 스킬```");
									const roleSkill = require('./Skills/' + emoji_role[job].slotname + 'Skill.json');
									for(var i=0; i<roleSkill.length; i++)
									{
										const Embed = new Discord.MessageEmbed()
										.setColor('#ff00ff')
										.setTitle(roleSkill[i].name.replace(/`/gi,"\n"))
										.setDescription(roleSkill[i].description.replace(/`/gi,"\n"))
										.setThumbnail(roleSkill[i].icon);
										if(roleSkill[i].type != null)
											Embed.addField("종류", roleSkill[i].type, true)
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].cast != null)
											Embed.addField("시전 시간", roleSkill[i].cast, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].recast != null)
											Embed.addField("재사용 시간", roleSkill[i].recast, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].range != null)
											Embed.addField("거리", roleSkill[i].range, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].radius != null)
											Embed.addField("범위", roleSkill[i].radius, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].mp != null)
											Embed.addField("MP", roleSkill[i].mp, true);
										else
											Embed.addField('\u200b', '\u200b', true);
										if(roleSkill[i].level != null)
											Embed.addField("요구 레벨", roleSkill[i].level);
										interaction.channel.send({ embeds: [Embed] });
									}
									interaction.channel.send("```특성```");
									const jobTrait = require('./Skills/' + job + 'Trait.json');
									for(var i=0; i<jobTrait.length; i++)
									{
										const Embed = new Discord.MessageEmbed()
										.setColor('#00ffff')
										.setTitle(jobTrait[i].name.replace(/`/gi,"\n"))
										.setDescription(jobTrait[i].description.replace(/`/gi,"\n"))
										.setThumbnail(jobTrait[i].icon)
										.addField("요구 레벨", jobTrait[i].level);
										interaction.channel.send({ embeds: [Embed] });
									}
									interaction.editReply({ content: "정상적으로 생성되었습니다." });
								});
							}
						}
					}
				}
				break;
			}
		}
    }
});

client.on("messageCreate", async (msg) =>
{
	if (msg.author.bot) return;
	if (msg.guild == null) return;
	if (msg.content.includes("@everyone"))
	{
		if(!msg.member.roles.cache.has(msg.guild.roles.cache.find(r => r.name === "관리자").id))
		{
			setTimeout(() => msg.delete(), 1000);
			msg.reply("everyone을 사용할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
			return;
		}
	}
	if (msg.channel == channelsId.certification ||
	msg.channel == channelsId.console ||
	msg.channel == channelsId.jp_static_pve ||
	msg.channel == channelsId.jp_party_pve ||
	msg.channel == channelsId.jp_party_pvp ||
	msg.channel == channelsId.na_static_pve ||
	msg.channel == channelsId.na_party_pve ||
	msg.channel == channelsId.na_party_pvp ||
	msg.channel == channelsId.eu_static_pve ||
	msg.channel == channelsId.eu_party_pve ||
	msg.channel == channelsId.eu_party_pvp ||
	(msg.channel.isThread() && (msg.channel.parentId == channelsId.jp_static_pve ||
	msg.channel.parentId == channelsId.jp_party_pve ||
	msg.channel.parentId == channelsId.jp_party_pvp ||
	msg.channel.parentId == channelsId.na_static_pve ||
	msg.channel.parentId == channelsId.na_party_pve ||
	msg.channel.parentId == channelsId.na_party_pvp ||
	msg.channel.parentId == channelsId.eu_static_pve ||
	msg.channel.parentId == channelsId.eu_party_pve ||
	msg.channel.parentId == channelsId.eu_party_pvp)) ||
	msg.channel == channelsId.trade ||
	(msg.channel != channelsId.fc && msg.channel.parent == categorysId.fc) ||
	(msg.channel != channelsId.linkshell && msg.channel.parent == categorysId.linkshell) ||
	msg.channel.parentId == categorysId.job_battle ||
	msg.channel.parent.parentId == categorysId.job_battle)
	{
		setTimeout(() => msg.delete(), 1000);
	}
	else
	{
		if(msg.channel.parent != categorysId.dialog)
		{
			if(msg.channel.parent != categorysId.inquire && msg.channel.parent != categorysId.negotiation && msg.channel.parent != categorysId.troubleshooting)
			{
				const Embed = new Discord.MessageEmbed()
				.setColor('#ff00ff')
				.setTitle("채팅")
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setDescription("**<@" + msg.author.id + ">님이 <#" + msg.channel.id + ">채널에 말하셨습니다.\n[해당 메시지](" + msg.url + ")**\n" + msg.content)
				.setTimestamp()
				.setFooter("메시지 ID : " + msg.id);
				client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
			}
			else
			{
				const Embed = new Discord.MessageEmbed()
				.setColor('#ff00ff')
				.setTitle("채팅")
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setDescription(msg.content)
				.setTimestamp();
				const logChannelId = msg.channel.topic.split("-");
				client.channels.cache.get(logChannelId[0]).send({ embeds: [Embed] });
			}
		}
		else
		{
			if(msg.attachments.size == 1)
			{
				const image = msg.attachments.first().url;
				if(image.substr(image.length - 3, 3) == 'jpg' ||
				image.substr(image.length - 4, 4) == 'jpeg' ||
				image.substr(image.length - 3, 3) == 'png' ||
				image.substr(image.length - 4, 4) == 'webp' ||
				image.substr(image.length - 3, 3) == 'gif')
				{
					dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
					{
						if (err)
						{
							msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
							console.log(err);
						}
						else
						{
							const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
							if (channelId != channelsId.fc && channelId.parent == categorysId.fc)
							{
								try
								{
									channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
									{
										var editEmbed = messageId.embeds[0];
										if(editEmbed.author.name == msg.member.displayName)
										{
											editEmbed.setImage(image);
											const logEmbed = new Discord.MessageEmbed()
											.setColor('#00ffff')
											.setTitle(channelId.name)
											.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
											.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")에 이미지를 수정하셨습니다.")
											.setImage(image)
											.setTimestamp()
											.setFooter("메시지 ID : " + messageId.id);
											client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
											messageId.edit({ embeds: [editEmbed] });
											msg.channel.send({ embeds: [editEmbed] });
											msg.channel.send("```!FC설명 [설명]" +
											"\n!fc문의 [@맨션]" +
											"\n사진 1장을 업로드 하여 사진을 추가할 수 있습니다.```");
										}
										else
											msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { setTimeout(() => message.delete(), 10000); });
									});
								}
								catch(error)
								{
									console.log(error);
									msg.reply("FC사진 수정에 문제가 발생했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
								}
							}
						}
					});
				}
			}
		}
	}
	if (!msg.content.startsWith(prefix))
		return;
	var cmd = msg.content.slice(prefix.length).split(" ", 2);
	switch(cmd[0])
	{
		case "메시지":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 3);
				if(cmd.length != 3)
					msg.reply("!메시지 [#채널 맨션] [텍스트]").then(message => { setTimeout(() => message.delete(), 10000); });
				else
				{
					var text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
					sendMessage(msg, cmd[1].replace(/[^0-9]/g,''), text);
				}
			}
			break;
		}
		case "메시지수정":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 4);
				if(cmd.length != 4)
					msg.reply("!메시지수정 [#채널 맨션] [메시지ID] [텍스트]").then(message => { setTimeout(() => message.delete(), 10000); });
				else
				{
					var text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + cmd[2].length + 3);
					editMessage(msg, cmd[1].replace(/[^0-9]/g,''), cmd[2], text);
				}
			}
			break;
		}
		case "삭제":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 3);
				if(cmd.length != 3)
					msg.reply("!삭제 [#채널 맨션] [메시지ID]").then(message => { setTimeout(() => message.delete(), 10000); });
				else
					removeMessage(msg, cmd[1].replace(/[^0-9]/g,''), cmd[2]);
			}
			break;
		}
		case "이모지":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 4);
				if(cmd.length != 4)
					msg.reply("!이모지 [#채널 맨션] [텍스트ID] [이모지]").then(message => { setTimeout(() => message.delete(), 10000); });
				else
					addEmoji(msg, cmd[1].replace(/[^0-9]/g,''), cmd[2], cmd[3]);
			}
			break;
		}
		case "임베드":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 3);
				if((cmd.length == 2 && 
						(cmd[1] == "초기화" || 
					cmd[1] == "작성자적용" || 
					cmd[1] == "필드적용" || 
					cmd[1] == "하단적용")) ||
				(cmd.length == 3 && 
					(cmd[1] == "컬러" || 
					cmd[1] == "타이틀" || 
					cmd[1] == "URL" || 
					cmd[1] == "작성자명" || 
					cmd[1] == "작성자사진" || 
					cmd[1] == "작성자주소" || 
					cmd[1] == "설명" || 
					cmd[1] == "섬네일" || 
					cmd[1] == "필드이름" || 
					cmd[1] == "필드값" || 
					cmd[1] == "필드인라인" || 
					cmd[1] == "이미지" || 
					cmd[1] == "하단명" || 
					cmd[1] == "하단사진" || 
					cmd[1] == "채널")))
				{
					switch(cmd[1])
					{
						case "초기화":
							{
								delete makingAuthor.name;
								delete makingAuthor.image;
								delete makingAuthor.url;
								delete makingField.name;
								delete makingField.value;
								delete makingField.inline;
								delete makingFooter.name;
								delete makingFooter.image;
								makingEmbed = new Discord.MessageEmbed();
								break;
							}
						case "컬러":
							{
								makingEmbed.setColor(cmd[2]);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "타이틀":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingEmbed.setTitle(text);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "URL":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingEmbed.setURL(text);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "작성자명":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingAuthor.name = text;
								break;
							}
						case "작성자사진":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingAuthor.image = text;
								break;
							}
						case "작성자주소":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingAuthor.url = text;
								break;
							}
						case "작성자적용":
							{
								makingEmbed.setAuthor(makingAuthor.name, makingAuthor.image, makingAuthor.url);
								delete makingAuthor.name;
								delete makingAuthor.image;
								delete makingAuthor.url;
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "설명":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingEmbed.setDescription(text);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "섬네일":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingEmbed.setThumbnail(text);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "필드이름":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingField.name = text;
								break;
							}
						case "필드값":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingField.value = text;
								break;
							}
						case "필드인라인":
							{
								if(cmd[2] == "true")
									makingField.inline = true;
								if(cmd[2] == "false")
									makingField.inline = false;
								break;
							}
						case "필드적용":
							{
								makingEmbed.addField(makingField.name, makingField.value, makingField.inline);
								delete makingField.name;
								delete makingField.value;
								delete makingField.inline;
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "이미지":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingEmbed.setImage(text);
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "하단명":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingFooter.name = text;
								break;
							}
						case "하단사진":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingFooter.image = text;
								break;
							}
						case "하단적용":
							{
								makingEmbed.Footer(makingFooter.name, makingFooter.image);
								delete makingFooter.name;
								delete makingFooter.image;
								msg.reply({ embeds: [makingEmbed] }).then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
						case "채널":
							{
								const channelId = client.channels.cache.get(cmd[2].replace(/[^0-9]/g,''));
								if(channelId.id != channelsId.log)
								{
									channelId.send({ embeds: [makingEmbed] }).then(message =>
									{
										const Embed = new Discord.MessageEmbed()
										.setColor('#ffff00')
										.setTitle("콘솔")
										.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
										.setDescription("<#" + channelId.id + ">채널에 임베드를 송출하셨습니다.\n[해당 메시지](" + message.url + ")")
										.setTimestamp()
										.setFooter("메시지 ID : " + message.id);
										client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
										delete makingAuthor.name;
										delete makingAuthor.image;
										delete makingAuthor.url;
										delete makingField.name;
										delete makingField.value;
										delete makingField.inline;
										delete makingFooter.name;
										delete makingFooter.image;
										makingEmbed = new Discord.MessageEmbed();
									});
								}
								else
									msg.reply("로그에는 송출할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
								break;
							}
					}
				}
				else
					msg.reply("\n!임베드 초기화   (임베드를 초기화합니다.)"+
						"\n!임베드 컬러 [색컬러]   (임베드 색을 적용합니다."+
						"\n!임베드 타이틀 [타이틀명]   (임베드 타이틀을 적용합니다.)"+
						"\n!임베드 URL [URL]   (임베드 URL를 적용합니다.)"+
						"\n!임베드 작성자명 [작성자명]   (임베드 작성자명을 적용합니다.)"+
						"\n!임베드 작성자사진 [URL]   (임베드 작성자사진을 적용합니다.)"+
						"\n!임베드 작성자주소 [URL]   (임베드 작성자주소를 적용합니다.)"+
						"\n!임베드 작성자적용   (임베드 현재 작성자를 적용합니다.)"+
						"\n!임베드 설명 [설명]   (임베드 설명을 적용합니다.)"+
						"\n!임베드 섬네일 [URL]   (임베드 섬네일을 적용합니다.)"+
						"\n!임베드 필드이름 [필드이름]   (임베드의 필드이름를 적용합니다.)"+
						"\n!임베드 필드값 [필드값]   (임베드의 필드값을 적용합니다.)"+
						"\n!임베드 필드인라인 [true,false]   (임베드의 필드인라인을 적용합니다.)"+
						"\n!임베드 필드적용   (임베드의 현재필드를 추가합니다.)"+
						"\n!임베드 이미지 [url]   (임베드의 이미지를 적용합니다.)"+
						"\n!임베드 하단명 [하단명]   (임베드의 하단명을 적용합니다.)"+
						"\n!임베드 하단사진 [URL]   (임베드의 하단사진을 적용합니다.)"+
						"\n!임베드 하단적용   (임베드의 현재 하단을 적용합니다.)"+
						"\n!임베드 채널 [#채널 맨션]   (현재 임베드를 해당 채널에 송출합니다.)").then(message => { setTimeout(() => message.delete(), 60000); });
			}
			break;
		}
		case "버튼":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 4);
				if((cmd.length == 2 && 
						(cmd[1] == "초기화" || 
					cmd[1] == "비활성화")) ||
				(cmd.length == 3 && 
					(cmd[1] == "스타일" || 
					cmd[1] == "ID" || 
					cmd[1] == "이모지" || 
					cmd[1] == "URL")) ||
				(cmd.length == 4 &&
						cmd[1] == "적용") ||
				(cmd.length >= 3 &&
					cmd[1] == "라벨"))
				{
					switch(cmd[1])
					{
						case "초기화":
							{
								makingButton = new Discord.MessageButton();
								break;
							}
						case "스타일":
							{
								makingButton.setStyle(cmd[2]);
								break;
							}
						case "ID":
							{
								makingButton.setCustomId(cmd[2]);
								break;
							}
						case "라벨":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingButton.setLabel(text);
								break;
							}
						case "이모지":
							{
								const text = cmd[2].split(":");
								if(text.length == 3)
									makingButton.setEmoji(text[2].replace(/[^0-9]/g,''));
								else
									makingButton.setEmoji(cmd[2]);
								break;
							}
						case "비활성화":
							{
								makingButton.setDisabled();
								break;
							}
						case "URL":
							{
								makingButton.setURL(cmd[2]);
								break;
							}
						case "적용":
							{
								addButton(msg, cmd[2].replace(/[^0-9]/g,''), cmd[3]);
								break;
							}
					}
				}
				else
					msg.reply("\n!버튼 초기화                  (버튼을 초기화합니다.)" +
						"\n!버튼 스타일 [스타일]               (버튼 스타일을 적용합니다." +
						"\n!버튼 ID [ID]                      (버튼 ID를 적용합니다.)" +
						"\n!버튼 라벨 [라벨]                   (버튼 라벨을 적용합니다.)" +
						"\n!버튼 이모지 [이모지]               (버튼 이모지를 적용합니다.)" +
						"\n!버튼 비활성화                      (버튼을 비활성화합니다.)" +
						"\n!버튼 URL [URL]                    (버튼 URL를 적용합니다.)" +
						"\n!버튼 적용 [#채널 맨션] [메시지 ID]  (버튼을 적용합니다.)").then(message => { setTimeout(() => message.delete(), 60000); });
			}
			break;
		}
		case "메뉴":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 4);
				if((cmd.length == 2 &&
					(cmd[1] == "초기화" ||
					cmd[1] == "옵션추가")) ||
				(cmd.length == 3 && 
					(cmd[1] == "ID" || 
					cmd[1] == "최대값" || 
					cmd[1] == "최소값")) ||
				(cmd.length == 4 &&
						cmd[1] == "적용") ||
				(cmd.length >= 3 &&
					cmd[1] == "홀더"))
				{
					switch(cmd[1])
					{
						case "초기화":
							{
								makingMenu = new Discord.MessageSelectMenu();
								break;
							}
						case "ID":
							{
								makingMenu.setCustomId(cmd[2]);
								break;
							}
						case "홀더":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingMenu.setPlaceholder(text);
								break;
							}
						case "최대값":
							{
								makingMenu.setMaxValues(text);
								break;
							}
						case "최소값":
							{
								makingMenu.setMinValues(text);
								break;
							}
						case "옵션추가":
							{
								makingMenu.addOptions(makingMenuOption);
								makingMenuOption =
								{
									label:null,
									value:null,
									description:null,
									emoji:null,
									default:false
								};
								break;
							}
						case "적용":
							{
								addMenu(msg, cmd[2].replace(/[^0-9]/g,''), cmd[3]);
								break;
							}
					}
				}
				else
					msg.reply("\n!메뉴 초기화                 (메뉴를 초기화합니다.)" +
						"\n!메뉴 ID [ID]                      (메뉴 ID를 적용합니다.)" +
						"\n!메뉴 홀더 [메뉴 이름]              (메뉴 홀더를 적용합니다.)" +
						"\n!메뉴 최대값 [숫자]                 (메뉴 최대값을 적용합니다.)" +
						"\n!메뉴 최소값 [숫자]                 (메뉴 최소값을 적용합니다.)" +
						"\n!메뉴 옵션추가                      (메뉴 옵션을 추가합니다.)" +
						"\n!메뉴 적용 [#채널 맨션] [메시지 ID]  (메뉴를 적용합니다.)").then(message => { setTimeout(() => message.delete(), 60000); });
			}
			break;
		}
		case "메뉴옵션":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 3);
				if((cmd.length == 2 &&
					(cmd[1] == "초기화" ||
					cmd[1] == "기본값")) ||
				(cmd.length == 3 && 
					(cmd[1] == "라벨" || 
					cmd[1] == "값" || 
					cmd[1] == "설명" || 
					cmd[1] == "이모지")))
				{
					switch(cmd[1])
					{
						case "초기화":
							{
								makingMenuOption =
								{
									label:null,
									value:null,
									description:null,
									emoji:null,
									default:false
								};
								break;
							}
						case "라벨":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingMenuOption.label = text;
								break;
							}
						case "값":
							{
								makingMenuOption.value = cmd[2];
								break;
							}
						case "설명":
							{
								const text = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
								makingMenuOption.description = text;
								break;
							}
						case "이모지":
							{
								const text = cmd[2].split(":");
								if(text.length == 3)
									makingMenuOption.emoji = text[2].replace(/[^0-9]/g,'');
								else
									makingMenuOption.emoji = cmd[2];
								break;
							}
						case "기본값":
							{
								makingMenuOption.default = true;
								break;
							}
					}
				}
				else
					msg.reply("\n!메뉴옵션 초기화      (메뉴 옵션을 초기화합니다.)" +
						"\n!메뉴옵션 라벨 [라벨]       (메뉴 옵션 라벨을 적용합니다.)" +
						"\n!메뉴옵션 값 [값]           (메뉴 옵션 값을 적용합니다.)" +
						"\n!메뉴옵션 설명 [설명]       (메뉴 옵션 설명을 적용합니다.)" +
						"\n!메뉴옵션 이모지 [이모지]    (메뉴 옵션 이모지를 적용합니다.)" +
						"\n!메뉴옵션 기본값            (메뉴 옵션을 기본값으로 적용합니다.)").then(message => { setTimeout(() => message.delete(), 60000); });
			}
			break;
		}
		case "경고":
		{
			if (msg.channel == channelsId.console)
			{
				cmd = msg.content.slice(prefix.length).split(" ", 3);
				if(cmd.length != 3)
					msg.reply("!경고 [@맨션] [사유]").then(message => { setTimeout(() => message.delete(), 10000); });
				else
				{
					var userid = cmd[1].replace(/[^0-9]/g,'');
					if(cmd[1].slice(0,2) == "<@")
					{
						msg.guild.members.fetch(userid).then(target =>
						{
							if(!target.user.bot)
							{
								const adminrole = msg.guild.roles.cache.find(r => r.name === "관리자");
								if(!target.roles.cache.has(adminrole.id))
								{	
									const reason = msg.content.slice(prefix.length + cmd[0].length + cmd[1].length + 2);
									const adminrole = msg.guild.roles.cache.find(r => r.name === "경고");
									if(target.roles.cache.has(adminrole.id))
									{
										dataBase.query("INSERT INTO UserSaveData (User_Id, Ban_Reason) VALUES (" + target.id + ", '" + reason + "') ON CONFLICT (User_Id) DO UPDATE SET Ban_Reason = '" + reason + "'");
										const logEmbed = new Discord.MessageEmbed()
										.setColor('#00ffff')
										.setTitle(msg.channel.name)
										.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
										.setDescription("<@" + msg.member.id + ">님이 <@" + target.id + ">님을 2차 경고하셨습니다.")
										.addField("사유", reason)
										.setTimestamp()
										.setFooter("유저 ID : " + target.id);
										client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
										msg.reply("<@" + target.id + ">님을 2차 경고하셨기 때문에 밴되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
										msg.guild.members.ban(target.user, { reason: reason });
									}
									else
									{
										dataBase.query("INSERT INTO UserSaveData (User_Id, Warning_Reason) VALUES (" + target.id + ", '" + reason + "') ON CONFLICT (User_Id) DO UPDATE SET Warning_Reason = '" + reason + "'");
										
										const logEmbed = new Discord.MessageEmbed()
										.setColor('#00ffff')
										.setTitle(msg.channel.name)
										.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
										.setDescription("<@" + msg.member.id + ">님이 <@" + target.id + ">님을 1차 경고하셨습니다.")
										.addField("사유", reason)
										.setTimestamp()
										.setFooter("유저 ID : " + target.id);
										client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
										msg.reply("<@" + target.id + ">님을 경고하셨습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
										const warningrole = msg.guild.roles.cache.find(r => r.name === "경고");
										target.roles.add(warningrole);
									}
								}
								else
									msg.reply("관리자를 경고하실 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
							}
							else
								msg.reply("봇을 경고하실 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
						}).
						catch(error => {
							msg.reply("!경고 [@맨션] [사유]").then(message => { setTimeout(() => message.delete(), 10000); });
						});
					}
				}
			}
			break;
		}
		case "채널":
		{
			if (msg.channel == channelsId.console)
			{
				if(cmd.length == 2)
				{
					const channelId = client.channels.cache.get(cmd[1].replace(/[^0-9]/g,''));
					msg.reply("<#" + channelId.id + ">의 ID는 " + channelId.id + " 입니다.").then(message => { setTimeout(() => message.delete(), 20000); });
				}
				else
					msg.reply("!채널 [#채널 맨션]").then(message => { setTimeout(() => message.delete(), 10000); });
			}
			break;
		}
		case "사사게":
		{
			if (msg.channel == channelsId.console)
			{
				if(cmd.length == 2)
				{
					var editname = msg.content.slice(prefix.length + cmd[0].length + 1).toLowerCase().replace(/ /gi,"-").replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');
					var name = editname.charAt(editname.length-1);
					while(true)
					{
						if(name == "-" || name == " ")
						{
							name = editname.slice(0,-1);
							editname = name;
							if(editname.length <= 0)
								break;
							else
								name = editname.charAt(editname.length-1);
						}
						else
						{
							name = editname;
							break;
						}
					}
					if(name.length != 0)
					{
						if(msg.guild.channels.cache.filter(channel => channel.parentId === categorysId.troubleshooting && channel.name === name).size == 0)
						{
							msg.guild.channels.create(name,
							{
								type: 'text',
								parent: categorysId.troubleshooting,
								permissionOverwrites:
								[
									{
										id: msg.guild.roles.everyone,
										deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
									},
									{
										id: '857669793620426752',
										allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
									},
									{
										id: '819869630893129742',
										allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
									}
								],
								reason: '새 사건 사고 게시판 신설됨'
							}).then(channel =>
							{
								msg.guild.channels.create(name,
								{
									type: 'text',
									parent: categorysId.troubleshooting_log,
									permissionOverwrites:
									[
										{
											id: msg.guild.roles.everyone,
											deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
										},
										{
											id: '819869630893129742',
											allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
										},
										{
											id: '857669793620426752',
											allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
											deny: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
										}
									],
									reason: '새 사건 사고 게시판 기록장 신설됨'
								}).then(logchannel =>
								{
									channel.setTopic(logchannel.id);
									const logEmbed = new Discord.MessageEmbed()
									.setColor('#00ffff')
									.setTitle("사건 사고 게시판")
									.setDescription("<@" + msg.member.id + ">님이 사건 사고 게시판을 신설했습니다.")
									.setTimestamp();
									logchannel.send({ embeds: [logEmbed] });
								});
								const Embed = new Discord.MessageEmbed()
								.setColor('#00ffff')
								.setTitle(msg.channel.name)
								.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
								.setDescription("<@" + msg.member.id + ">님이 <#" + channel.id + "> 사건 사고 게시판을 신설하셨습니다.")
								.setTimestamp()
								.setFooter("채널 ID : " + channel.id);
								client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
								channel.send("@here 새로운 사건 사고 게시판이 신설되었습니다.");
							});
						}
						else
							msg.reply("이미 진행중인 사건 사고 게시판의 제목과 동일하게 신설할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
					}
					else
						msg.reply("제목을 공백으로 할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
				}
				else
					msg.reply("!사사게 [신규 채널 이름]").then(message => { setTimeout(() => message.delete(), 10000); });
			}
			break;
		}
		case "소환":
		{
			if (msg.channel.parent == categorysId.troubleshooting)
			{
				const role = msg.guild.roles.cache.find(r => r.name === "관리자");
				if(msg.member.roles.cache.has(role.id))
				{
					var text = "";
					if(cmd.length == 2)
					{
						for(var i = 1; i < cmd.length; i++)
						{
							msg.guild.members.fetch(cmd[i].replace(/[^0-9]/g,'')).then(target =>
							{
								if(!target.user.bot && !target.roles.cache.has(role.id))
								{
									text += "<@" + target.id + "> ";
									msg.channel.permissionOverwrites.edit(target.user,{ VIEW_CHANNEL: true });
								}
							});
						}
					}
					text += "님이 호출되었습니다.";
					msg.channel.send(text);
					msg.delete();
				}
			}
			break;
		}
		case "종료":
		{
			if (msg.channel.parent == categorysId.inquire || msg.channel.parent == categorysId.troubleshooting)
			{
				const role = msg.guild.roles.cache.find(r => r.name === "관리자");
				if(msg.member.roles.cache.has(role.id))
				{
					if(msg.channel.parent == categorysId.inquire)
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle(msg.channel.name)
						.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
						.setDescription("<@" + msg.member.id + ">님이 <#" + msg.channel.id + "> 문의를 종료하셨습니다.")
						.setTimestamp()
						.setFooter("채널 ID : " + msg.channel.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
						const logEmbed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle("종료")
						.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
						.setDescription("<@" + msg.member.id + ">님이 문의를 종료하셨습니다.")
						.setTimestamp();
						client.channels.cache.get(msg.channel.topic).send({ embeds: [logEmbed] });
						msg.channel.setParent(categorysId.inquire_close);
						msg.channel.permissionOverwrites.set(
						[
							{
								id: msg.guild.roles.everyone,
								deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							},
							{
								id: '857669793620426752',
								allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
							}
						], '종료된 건의함');
					}
					else
					if(msg.channel.parent == categorysId.troubleshooting)
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle(msg.channel.name)
						.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
						.setDescription("<@" + msg.member.id + ">님이 <#" + msg.channel.id + "> 사건 사고 게시판을 종료하셨습니다.")
						.setTimestamp()
						.setFooter("채널 ID : " + msg.channel.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
						const logEmbed = new Discord.MessageEmbed()
						.setColor('#00ffff')
						.setTitle("종료")
						.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
						.setDescription("<@" + msg.member.id + ">님이 해당 사건 사고 게시판을 종료하셨습니다.")
						.setTimestamp();
						client.channels.cache.get(msg.channel.topic).send({ embeds: [logEmbed] });
						msg.channel.setParent(categorysId.troubleshooting_close);
						msg.channel.permissionOverwrites.set(
						[
							{
								id: msg.guild.roles.everyone,
								deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
							},
							{
								id: '857669793620426752',
								allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
							}
						], '종료된 사건 사고 게시판');
					}
				}
			}
			break;
		}
		case "fc설명":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId != channelsId.fc && channelId.parent == categorysId.fc)
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												const oldtext = editEmbed.description;
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.setDescription(text);
												const logEmbed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")의 설명 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!fc설명 [설명]" +
												"\n!fc문의 [@맨션]" +
												"\n사진 1장을 업로드 하여 사진을 추가할 수 있습니다.```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { message.delete({ timeout: 10000 }) });
										});
									}
									catch(error)
									{
										console.log(error);
										msg.reply("!fc설명 [설명]").then(message => { message.delete({ timeout: 10000 }) });
									}
								}
								else
									msg.reply("!fc설명 [설명]").then(message => { message.delete({ timeout: 10000 }) });
							}
						}
					}
				});
			}
			break;
		}
		case "fc문의":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId != channelsId.fc && channelId.parent == categorysId.fc)
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												const oldtext = editEmbed.fields[4].value;
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.fields[4].value = text;
												const logEmbed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")의 문의 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!fc설명 [설명]" +
												"\n!fc문의 [@맨션]" +
												"\n사진 1장을 업로드 하여 사진을 추가할 수 있습니다.```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { message.delete({ timeout: 10000 }) });
										});
									}
									catch(error)
									{
										msg.reply("!fc문의 [@맨션]").then(message => { message.delete({ timeout: 10000 }) });
									}
								}
								else
									msg.reply("!fc문의 [@맨션]").then(message => { message.delete({ timeout: 10000 }) });
							}
						}
					}
				});
			}
			break;
		}
		case "링크쉘설명":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId != channelsId.linkshell && channelId.parent == categorysId.linkshell)
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												var oldtext = editEmbed.description;
												if(oldtext == null)
													oldtext = "null";
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.setDescription(text);
												const logEmbed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")의 설명 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!링크쉘설명 [설명] " +
												"\n!링크쉘문의 [@맨션]```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { message.delete({ timeout: 10000 }) });
										});
									}
									catch(error)
									{
										msg.reply("!링크쉘설명 [메시지ID] [설명]").then(message => { message.delete({ timeout: 10000 }) });
									}
								}
								else
									msg.reply("!링크쉘설명 [메시지ID] [설명]").then(message => { message.delete({ timeout: 10000 }) });
							}
						}
					}
				});
			}
			break;
		}
		case "링크쉘문의":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId != channelsId.linkshell && channelId.parent == categorysId.linkshell)
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												const oldtext = editEmbed.fields[0].value;
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.fields[0].value = text;
												const logEmbed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")의 문의 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!링크쉘설명 [설명] " +
												"\n!링크쉘문의 [@맨션]```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { message.delete({ timeout: 10000 }) });
										});
									}
									catch(error)
									{
										msg.reply("!링크쉘문의 [@맨션]").then(message => { message.delete({ timeout: 10000 }) });
									}
								}
								else
									msg.reply("!링크쉘문의 [@맨션]").then(message => { message.delete({ timeout: 10000 }) });
							}
						}
					}
				});
			}
			break;
		}
		case "파티설명":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId.channelId == channelsId.jp_static_pve || channelId.channelId == channelsId.jp_party_pve || channelId.channelId == channelsId.jp_party_pvp ||
								channelId.channelId == channelsId.na_static_pve || channelId.channelId == channelsId.na_party_pve || channelId.channelId == channelsId.na_party_pvp ||
								channelId.channelId == channelsId.eu_static_pve || channelId.channelId == channelsId.eu_party_pve || channelId.channelId == channelsId.eu_party_pvp ||
								(channelId.isThread() &&
								(channelId.parentId == channelsId.jp_static_pve || channelId.parentId == channelsId.jp_party_pve || channelId.parentId == channelsId.jp_party_pvp ||
								channelId.parentId == channelsId.na_static_pve || channelId.parentId == channelsId.na_party_pve || channelId.parentId == channelsId.na_party_pvp ||
								channelId.parentId == channelsId.eu_static_pve || channelId.parentId == channelsId.eu_party_pve || channelId.parentId == channelsId.eu_party_pvp)))
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												var oldtext = editEmbed.description;
												if (oldtext == null)
													oldtext = "null";
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.description = text;
												const Embed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당파티](" + messageId.url + ")의 설명 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!파티설명 [설명]```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { setTimeout(() => message.delete(), 10000); });
										});
									}
									catch(err)
									{
										msg.reply("없는 파티입니다.").then(message => { setTimeout(() => message.delete(), 10000); });
									}
								}
								else
									msg.reply("!파티설명 [설명]").then(message => { setTimeout(() => message.delete(), 10000); });
							}
						}
					}
				});
			}
			break;
		}
		case "거래설명":
		{
			if (msg.channel.parent == categorysId.dialog)
			{
				dataBase.query("SELECT Dialog_Channel_Id, Dialog_Message_Id FROM UserSaveData WHERE User_Id = '" + msg.member.id +"'", (err, res) =>
				{
					if (err)
					{
						msg.reply("플레이어 데이터를 찾지 못했습니다. 관리자에게 보고하십시오.");
						console.log(err);
					}
					else
					{
						const channelId = client.channels.cache.get(res.rows[0].dialog_channel_id);
						if (channelId)
						{
							if (channelId == channelsId.trade)
							{
								cmd = msg.content.slice(prefix.length).split(" ", 2);
								if(cmd.length == 2)
								{
									try
									{
										channelId.messages.fetch(res.rows[0].dialog_message_id).then(messageId =>
										{
											var editEmbed = messageId.embeds[0];
											if(editEmbed.author.name == msg.member.displayName)
											{
												var oldtext = editEmbed.description;
												if (oldtext == null)
													oldtext = "null";
												const text = msg.content.slice(prefix.length + cmd[0].length + 1);
												editEmbed.setDescription(text);
												const logEmbed = new Discord.MessageEmbed()
												.setColor('#00ffff')
												.setTitle(channelId.name)
												.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
												.setDescription("<@" + msg.member.id + ">님이 [해당 메시지]("+ messageId.url +")의 설명 부분을 수정하셨습니다.")
												.addField("수정 전", oldtext)
												.addField("수정 후", text)
												.setTimestamp()
												.setFooter("메시지 ID : " + messageId.id);
												client.channels.cache.get(channelsId.log).send({ embeds: [logEmbed] });
												messageId.edit({ embeds: [editEmbed] });
												msg.channel.send({ embeds: [editEmbed] });
												msg.channel.send("```!거래설명 [설명]```");
											}
											else
												msg.reply("자기가 작성한 글만 수정이 가능합니다.").then(message => { setTimeout(() => message.delete(), 10000); });
										});
									}
									catch(error)
									{
										console.log(error);
										msg.reply("!거래설명 [설명]").then(message => { setTimeout(() => message.delete(), 10000); });
									}
								}
								else
									msg.reply("!거래설명 [설명]").then(message => { setTimeout(() => message.delete(), 10000); });
							}
						}
					}
				});
			}
			break;
		}
		case "거래종료":
		{
			if (msg.channel.parent == categorysId.negotiation)
			{
				const logChannelId = msg.channel.topic.split("-");
				client.channels.cache.get(channelsId.trade).messages.fetch(logChannelId[1]).then(message =>
				{
					const Button1 = new Discord.MessageButton()
					.setStyle("SUCCESS")
					.setCustomId("trade")
					.setLabel("거래하기");
					const Button2 = new Discord.MessageButton()
					.setStyle("PRIMARY")
					.setCustomId("edit_message")
					.setLabel("수정하기");
					const Button3 = new Discord.MessageButton()
					.setStyle("DANGER")
					.setCustomId("delete_message")
					.setLabel("제거하기");
					const row = new Discord.MessageActionRow().addComponents(Button1, Button2, Button3);
					message.edit({ embeds: [message.embeds[0]] ,components: [row] });
				});
				const Embed = new Discord.MessageEmbed()
				.setColor('#00ffff')
				.setTitle("거래함")
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setDescription("<@" + msg.member.id + ">님이 <#" + msg.channel.id + "> 거래함을 종료하셨습니다.")
				.setTimestamp()
				.setFooter("채널 ID : " + msg.channel.id);
				client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
				const logEmbed = new Discord.MessageEmbed()
				.setColor('#00ffff')
				.setTitle("종료")
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setDescription("<@" + msg.member.id + ">님이 거래를 종료하셨습니다.")
				.setTimestamp();
				client.channels.cache.get(logChannelId[0]).send({ embeds: [logEmbed] });
				msg.channel.setParent(categorysId.negotiation_close);
				msg.channel.permissionOverwrites.set(
				[
					{
						id: msg.guild.roles.everyone,
						deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
					},
					{
						id: '857669793620426752',
						allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
					}
				], '종료된 거래함');
				client.channels.cache.get(logChannelId[0]).permissionOverwrites.set(
				[
					{
						id: msg.guild.roles.everyone,
						deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
					},
					{
						id: '819869630893129742',
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
					},
					{
						id: '857669793620426752',
						allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
						deny: ['SEND_MESSAGES', 'MANAGE_MESSAGES']
					}
				], '종료된 거래함');
			}
			break;
		}
	}
});

client.on('raw', async (packet) =>
{
	switch(packet.t)
	{
		case 'MESSAGE_UPDATE':
		{
			if (packet.d.guild_id == null) return;
			await sleep(1000);
			if(catchMessageUpdate)
				catchMessageUpdate = false;
			else
			{
				if (packet.d.channel_id === channelsId.log) return;
				if (packet.d.author == null) return;
				if (packet.d.author.bot) return;
				const channelId = client.channels.cache.get(packet.d.channel_id);
				const messageId = await channelId.messages.fetch(packet.d.id);
				if(channelId.parent != categorysId.dialog)
				{
					if (channelId.parent != categorysId.inquire && channelId.parent != categorysId.negotiation && channelId.parent != categorysId.troubleshooting)
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff00ff')
						.setTitle("수정")
						.setAuthor(packet.d.author.tag, packet.d.author.displayAvatarURL())
						.setDescription("<@" + packet.d.author.id + ">님이 <#" + channelId.id + ">채널에 있는 [해당 메시지](" + messageId.url + ") 를 수정했습니다. ")
						.addFields(
							{ name : "수정 전" , value : "~~캐시되지 않음~~" },
							{ name : "수정 후" , value : packet.d.content })
						.setTimestamp()
						.setFooter("메시지 ID : " + messageId.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
					}
					else
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff00ff')
						.setTitle("수정")
						.setAuthor(packet.d.author.tag, packet.d.author.displayAvatarURL())
						.addFields(
							{ name : "수정 전" , value : "~~캐시되지 않음~~" },
							{ name : "수정 후" , value : packet.d.content })
						.setTimestamp()
						const logChannelId = messageId.channel.topic.split("-");
						client.channels.cache.get(logChannelId[0]).send({ embeds: [Embed] });
					}
				}
			}
			break;
		}
		case 'MESSAGE_DELETE':
		{
			if (packet.d.guild_id == null) return;
			const channelId = client.channels.cache.get(packet.d.channel_id);
			if (packet.d.channel_id === channelsId.log ||
			packet.d.channel_id === channelsId.certification ||
			packet.d.channel_id === channelsId.console ||
			packet.d.channel_id === channelsId.jp_static_pve ||
			packet.d.channel_id === channelsId.jp_party_pve ||
			packet.d.channel_id === channelsId.jp_party_pvp ||
			packet.d.channel_id === channelsId.na_static_pve ||
			packet.d.channel_id === channelsId.na_party_pve ||
			packet.d.channel_id === channelsId.na_party_pvp ||
			packet.d.channel_id === channelsId.eu_static_pve ||
			packet.d.channel_id === channelsId.eu_party_pve ||
			packet.d.channel_id === channelsId.eu_party_pvp ||
			(channelId.isThread() &&
			(channelId.parentId === channelsId.jp_static_pve ||
			channelId.parentId === channelsId.jp_party_pve ||
			channelId.parentId === channelsId.jp_party_pvp ||
			channelId.parentId === channelsId.na_static_pve ||
			channelId.parentId === channelsId.na_party_pve ||
			channelId.parentId === channelsId.na_party_pvp ||
			channelId.parentId === channelsId.eu_static_pve ||
			channelId.parentId === channelsId.eu_party_pve ||
			channelId.parentId === channelsId.eu_party_pvp)) ||
			packet.d.channel_id === channelsId.trade ||
			channelId.parent === categorysId.dialog ||
			(packet.d.channel_id != channelsId.fc && channelId.parent == categorysId.fc) ||
			(packet.d.channel_id != channelsId.linkshell && channelId.parent == categorysId.linkshell) ||
			channelId.parentId == categorysId.job_battle ||
			channelId.parent.parentId == categorysId.job_battle) return;
			channelId.messages.fetch(packet.d.id).then(messageId =>
			{
				if(channelId.parent != categorysId.dialog)
				{
					if (channelId.parent != categorysId.inquire && channelId.parent != categorysId.negotiation && channelId.parent != categorysId.troubleshooting)
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff00ff')
						.setTitle("제거")
						.setAuthor(messageId.author.tag, messageId.author.displayAvatarURL())
						.setDescription("**<#" + channelId.id + ">채널에 있는 <@" + messageId.author.id + ">님의 메시지가 제거되었습니다.**\n" + messageId.content)
						.setTimestamp()
						.setFooter("메시지 ID : " + messageId.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
					}
					else
					{
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff00ff')
						.setTitle("제거")
						.setAuthor(messageId.author.tag, messageId.author.displayAvatarURL())
						.setDescription(messageId.content)
						.setTimestamp();
						const logChannelId = messageId.channel.topic.split("-");
						client.channels.cache.get(logChannelId[0]).send({ embeds: [Embed] });
					}
				}
			});
			break;
		}
		case 'MESSAGE_REACTION_ADD':
		{
			if (packet.d.guild_id == null) return;
			if (packet.d.channel_id === channelsId.log) return;
			const guild = client.guilds.cache.get(packet.d.guild_id);
			const member = await guild.members.fetch(packet.d.user_id);
			if (member.user.bot) return;
			if (packet.d.channel_id === channelsId.role)
			{
				if (packet.d.emoji.name in emoji_role)
				{
					try
					{
						const role = await guild.roles.cache.find(role => role.name === emoji_role[packet.d.emoji.name].name);
						switch(emoji_role[packet.d.emoji.name].slot)
						{
							case 0:
								{
									const roletab = guild.roles.cache.find(r => r.name === "⁣              탱커              ⁣");
									member.roles.add(roletab);
									break;
								}
							case 1:
								{
									const roletab = guild.roles.cache.find(r => r.name === "⁣              힐러              ⁣");
									member.roles.add(roletab);
									break;
								}
							case 2:
								{
									const roletab = guild.roles.cache.find(r => r.name === "⁣            근접 딜러            ⁣");
									member.roles.add(roletab);
									break;
								}
							case 3:
								{
									const roletab = guild.roles.cache.find(r => r.name === "⁣         원거리 물리 딜러         ⁣");
									member.roles.add(roletab);
									break;
								}
							case 4:
								{
									const roletab = guild.roles.cache.find(r => r.name === "⁣             캐스터             ⁣");
									member.roles.add(roletab);
									break;
								}
						}
						member.roles.add(role);
					}
					catch (error)
					{
						console.log(error);
						packet.d.channel_id.send("역할 지정에 실패하셨습니다.\n관리자에게 보고하십시오.").then(message => { setTimeout(() => message.delete(), 10000); });
					}
				}
			}
			const channelId = client.channels.cache.get(packet.d.channel_id);
			if (packet.d.channel_id == channelsId.jp_static_pve || packet.d.channel_id == channelsId.jp_party_pve || packet.d.channel_id == channelsId.jp_party_pvp ||
				packet.d.channel_id == channelsId.na_static_pve || packet.d.channel_id == channelsId.na_party_pve || packet.d.channel_id == channelsId.na_party_pvp ||
				packet.d.channel_id == channelsId.eu_static_pve || packet.d.channel_id == channelsId.eu_party_pve || packet.d.channel_id == channelsId.eu_party_pvp ||
				(channelId.isThread() &&
				(channelId.parentId == channelsId.jp_static_pve || channelId.parentId == channelsId.jp_party_pve || channelId.parentId == channelsId.jp_party_pvp ||
				channelId.parentId == channelsId.na_static_pve || channelId.parentId == channelsId.na_party_pve || channelId.parentId == channelsId.na_party_pvp ||
				channelId.parentId == channelsId.eu_static_pve || channelId.parentId == channelsId.eu_party_pve || channelId.parentId == channelsId.eu_party_pvp)))
			{
				const emojiId = client.emojis.cache.find(emoji => emoji.name == packet.d.emoji.name);
				const messageId = await channelId.messages.fetch(packet.d.message_id);
				if (packet.d.emoji.name in emoji_partyslotcheck && messageId.embeds[0].fields[0].name == "연합 A" && emoji_partyslotcheck[packet.d.emoji.name] < messageId.embeds[0].fields.length)
				{
					for(var i=0;i<emoji_partyslot.length;i++)
					{
						if(i != emoji_partyslotcheck[packet.d.emoji.name])
						{
							const emojiId = messageId.reactions.cache.find(reaction => reaction.emoji.name == emoji_partyslot[i].name);
							if(emojiId != null)
							{
								if(emojiId.users.cache.has(member.id))
								{
									emojiId.users.remove(member.id);
								}
							}
						}
					}
				}
				else
				if (packet.d.emoji.name in emoji_role)
				{
					try
					{
						var editEmbed = messageId.embeds[0];
						var success = false;
						var isAlreadyJoin = isAlreadyRole(editEmbed, member);
						if(isAlreadyJoin != null)
						{
							if(editEmbed.fields[0].name == "연합 A")
							{
								const party = parseInt(isAlreadyJoin / 10) - 1;
								const slot = isAlreadyJoin % 10;
								const fieldvalue = editEmbed.fields[party].value.split("\n");
								const fieldname = fieldvalue[slot * 3].split(" ");
								switch(packet.d.emoji.name)
								{
									case "TANK":
									case "PLD":
									case "WAR":
									case "DRK":
									case "GNB":
									{
										if(fieldname[0] == "탱커" || fieldname[0] == "공용")
										{
											editEmbed.fields[party].value = "";
											for(var i = 0; i < 8; i++)
											{
												if(i != slot)
													editEmbed.fields[party].value += fieldvalue[i * 3] + "\n" + fieldvalue[i * 3 + 1]; 
												else
													editEmbed.fields[party].value += fieldname[0] + " " + `${emojiId}` + "\n" + fieldvalue[i * 3 + 1]; 
												if(i < 7)
													editEmbed.fields[party].value += "\n\n";
											}
											success = true;
										}
										break;
									}
									case "HEALER":
									case "WHM":
									case "SCH":
									case "AST":
									{
										const fieldname = fieldvalue[slot * 3].split(" ");
										if(fieldname[0] == "힐러" || fieldname[0] == "공용")
										{
											editEmbed.fields[party].value = "";
											for(var i = 0; i < 8; i++)
											{
												if(i != slot)
													editEmbed.fields[party].value += fieldvalue[i * 3] + "\n" + fieldvalue[i * 3 + 1]; 
												else
													editEmbed.fields[party].value += fieldname[0] + " " + `${emojiId}` + "\n" + fieldvalue[i * 3 + 1]; 
												if(i < 7)
													editEmbed.fields[party].value += "\n\n";
											}
											success = true;
										}
										break;
									}
									case "MeleeDPS":
									case "RangeDPS":
									case "MagicDPS":
									case "MNK":
									case "DRG":
									case "NIN":
									case "SAM":
									case "BRD":
									case "MCH":
									case "DNC":
									case "BLM":
									case "SMN":
									case "RDM":
									{
										const fieldname = fieldvalue[slot * 3].split(" ");
										if(fieldname[0] == "딜러" || fieldname[0] == "공용")
										{
											editEmbed.fields[party].value = "";
											for(var i = 0; i < 8; i++)
											{
												if(i != slot)
													editEmbed.fields[party].value += fieldvalue[i * 3] + "\n" + fieldvalue[i * 3 + 1]; 
												else
													editEmbed.fields[party].value += fieldname[0] + " " + `${emojiId}` + "\n" + fieldvalue[i * 3 + 1]; 
												if(i < 7)
													editEmbed.fields[party].value += "\n\n";
											}
											success = true;
										}
										break;
									}
								}
								if(success)
								{
									const oldEmojiName = fieldname[1].split(":", 2);
									messageId.reactions.cache.find(reaction => reaction.emoji.name == oldEmojiName[1]).users.remove(member.id);
								}
							}
							else
							{
								const fieldname = editEmbed.fields[isAlreadyJoin].name.split(" ");
								switch(packet.d.emoji.name)
								{
									case "TANK":
									case "PLD":
									case "WAR":
									case "DRK":
									case "GNB":
									{
										if(fieldname[0] == "탱커" || fieldname[0] == "공용")
										{
											editEmbed.fields[isAlreadyJoin].name = fieldname[0] + " " + `${emojiId}`;
											editEmbed.fields[isAlreadyJoin].value = "<@" + member.id + ">";
											success = true;
										}
										break;
									}
									case "HEALER":
									case "WHM":
									case "SCH":
									case "AST":
									{
										if(fieldname[0] == "힐러" || fieldname[0] == "공용")
										{
											editEmbed.fields[isAlreadyJoin].name = fieldname[0] + " " + `${emojiId}`;
											editEmbed.fields[isAlreadyJoin].value = "<@" + member.id + ">";
											success = true;
										}
										break;
									}
									case "MeleeDPS":
									case "RangeDPS":
									case "MagicDPS":
									case "MNK":
									case "DRG":
									case "NIN":
									case "SAM":
									case "BRD":
									case "MCH":
									case "DNC":
									case "BLM":
									case "SMN":
									case "RDM":
									{
										if(fieldname[0] == "딜러" || fieldname[0] == "공용")
										{
											editEmbed.fields[isAlreadyJoin].name = fieldname[0] + " " + `${emojiId}`;
											editEmbed.fields[isAlreadyJoin].value = "<@" + member.id + ">";
											success = true;
										}
										break;
									}
								}
								if(success)
								{
									const oldEmojiName = fieldname[1].split(":", 2);
									messageId.reactions.cache.find(reaction => reaction.emoji.name == oldEmojiName[1]).users.remove(member.id);
								}
							}
						}
						else
						{
							if(editEmbed.fields[0].name == "연합 A")
							{
								var slot = null;
								for(var i=0;i<emoji_partyslot.length;i++)
								{
									if(i != emoji_partyslotcheck[packet.d.emoji.name])
									{
										const emojiId = messageId.reactions.cache.find(reaction => reaction.emoji.name == emoji_partyslot[i].name);
										if(emojiId != null)
										{
											if(emojiId.users.cache.has(member.id))
											{
												slot = i;
												break;
											}
										}
									}
								}
								if(slot != null)
								{
									const fieldvalue = editEmbed.fields[slot].value.split("\n");
									switch(packet.d.emoji.name)
									{
										case "TANK":
										case "PLD":
										case "WAR":
										case "DRK":
										case "GNB":
										{
											for(var i=0;i<fieldvalue.length;i++)
											{
												if(fieldvalue[i] == "탱커" && fieldvalue[i+1] == "공석")
												{
													editEmbed.fields[slot].value = "";
													for(var j=0;j<fieldvalue.length;j++)
													{
														if(i == j || i + 1 == j)
														{
															if(i == j)
																editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
															else
																editEmbed.fields[slot].value += "<@" + member.id + ">";
														}
														else
															editEmbed.fields[slot].value += fieldvalue[j];
														if(j < fieldvalue.length - 1)
															editEmbed.fields[slot].value += "\n";
													}
													success = true;
													break;
												}
											}
											if(!success)
											{
												for(var i=0;i<fieldvalue.length;i++)
												{
													if(fieldvalue[i] == "공용" && fieldvalue[i+1] == "공석")
													{
														editEmbed.fields[slot].value = "";
														for(var j=0;j<fieldvalue.length;j++)
														{
															if(i == j || i + 1 == j)
															{
																if(i == j)
																	editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
																else
																	editEmbed.fields[slot].value += "<@" + member.id + ">";
															}
															else
																editEmbed.fields[slot].value += fieldvalue[j];
															if(j < fieldvalue.length - 1)
																editEmbed.fields[slot].value += "\n";
														}
														success = true;
														break;
													}
												}
											}
											break;
										}
										case "HEALER":
										case "WHM":
										case "SCH":
										case "AST":
										{
											for(var i=0;i<fieldvalue.length;i++)
											{
												if(fieldvalue[i] == "힐러" && fieldvalue[i+1] == "공석")
												{
													editEmbed.fields[slot].value = "";
													for(var j=0;j<fieldvalue.length;j++)
													{
														if(i == j || i + 1 == j)
														{
															if(i == j)
																editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
															else
																editEmbed.fields[slot].value += "<@" + member.id + ">";
														}
														else
															editEmbed.fields[slot].value += fieldvalue[j];
														if(j < fieldvalue.length - 1)
															editEmbed.fields[slot].value += "\n";
													}
													success = true;
													break;
												}
											}
											if(!success)
											{
												for(var i=0;i<fieldvalue.length;i++)
												{
													if(fieldvalue[i] == "공용" && fieldvalue[i+1] == "공석")
													{
														editEmbed.fields[slot].value = "";
														for(var j=0;j<fieldvalue.length;j++)
														{
															if(i == j || i + 1 == j)
															{
																if(i == j)
																	editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
																else
																	editEmbed.fields[slot].value += "<@" + member.id + ">";
															}
															else
																editEmbed.fields[slot].value += fieldvalue[j];
															if(j < fieldvalue.length - 1)
																editEmbed.fields[slot].value += "\n";
														}
														success = true;
														break;
													}
												}
											}
											break;
										}
										case "MeleeDPS":
										case "RangeDPS":
										case "MagicDPS":
										case "MNK":
										case "DRG":
										case "NIN":
										case "SAM":
										case "BRD":
										case "MCH":
										case "DNC":
										case "BLM":
										case "SMN":
										case "RDM":
										{
											for(var i=0;i<fieldvalue.length;i++)
											{
												if(fieldvalue[i] == "딜러" && fieldvalue[i+1] == "공석")
												{
													editEmbed.fields[slot].value = "";
													for(var j=0;j<fieldvalue.length;j++)
													{
														if(i == j || i + 1 == j)
														{
															if(i == j)
																editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
															else
																editEmbed.fields[slot].value += "<@" + member.id + ">";
														}
														else
															editEmbed.fields[slot].value += fieldvalue[j];
														if(j < fieldvalue.length - 1)
															editEmbed.fields[slot].value += "\n";
													}
													success = true;
													break;
												}
											}
											if(!success)
											{
												for(var i=0;i<fieldvalue.length;i++)
												{
													if(fieldvalue[i] == "공용" && fieldvalue[i+1] == "공석")
													{
														editEmbed.fields[slot].value = "";
														for(var j=0;j<fieldvalue.length;j++)
														{
															if(i == j || i + 1 == j)
															{
																if(i == j)
																	editEmbed.fields[slot].value += fieldvalue[j] + " " + `${emojiId}`;
																else
																	editEmbed.fields[slot].value += "<@" + member.id + ">";
															}
															else
																editEmbed.fields[slot].value += fieldvalue[j];
															if(j < fieldvalue.length - 1)
																editEmbed.fields[slot].value += "\n";
														}
														success = true;
														break;
													}
												}
											}
											break;
										}
									}
								}
							}
							else
							{
								switch(packet.d.emoji.name)
								{
									case "TANK":
									case "PLD":
									case "WAR":
									case "DRK":
									case "GNB":
									{
										for(var i=0; i < editEmbed.fields.length; i++)
										{
											if(editEmbed.fields[i].name == "탱커" && editEmbed.fields[i].value == "공석")
											{
												editEmbed.fields[i].name = "탱커 " + `${emojiId}`;
												editEmbed.fields[i].value = "<@" + member.id + ">";
												success = true;
												break;
											}
										}
										if(!success)
										{
											for(var i=0; i < editEmbed.fields.length; i++)
											{
												if(editEmbed.fields[i].name == "공용" && editEmbed.fields[i].value == "공석")
												{
													editEmbed.fields[i].name = "공용 " + `${emojiId}`;
													editEmbed.fields[i].value = "<@" + member.id + ">";
													success = true;
													break;
												}
											}
										}
										break;
									}
									case "HEALER":
									case "WHM":
									case "SCH":
									case "AST":
									{
										for(var i=0; i < editEmbed.fields.length; i++)
										{
											if(editEmbed.fields[i].name == "힐러" && editEmbed.fields[i].value == "공석")
											{
												editEmbed.fields[i].name = "힐러 " + `${emojiId}`;
												editEmbed.fields[i].value = "<@" + member.id + ">";
												success = true;
												break;
											}
										}
										if(!success)
										{
											for(var i=0; i < editEmbed.fields.length; i++)
											{
												if(editEmbed.fields[i].name == "공용" && editEmbed.fields[i].value == "공석")
												{
													editEmbed.fields[i].name = "공용 " + `${emojiId}`;
													editEmbed.fields[i].value = "<@" + member.id + ">";
													success = true;
													break;
												}
											}
										}
										break;
									}
									case "MeleeDPS":
									case "RangeDPS":
									case "MagicDPS":
									case "MNK":
									case "DRG":
									case "NIN":
									case "SAM":
									case "BRD":
									case "MCH":
									case "DNC":
									case "BLM":
									case "SMN":
									case "RDM":
									{
										for(var i=0; i < editEmbed.fields.length; i++)
										{
											if(editEmbed.fields[i].name == "딜러" && editEmbed.fields[i].value == "공석")
											{
												editEmbed.fields[i].name = "딜러 " + `${emojiId}`;
												editEmbed.fields[i].value = "<@" + member.id + ">";
												success = true;
												break;
											}
										}
										if(!success)
										{
											for(var i=0; i < editEmbed.fields.length; i++)
											{
												if(editEmbed.fields[i].name == "공용" && editEmbed.fields[i].value == "공석")
												{
													editEmbed.fields[i].name = "공용 " + `${emojiId}`;
													editEmbed.fields[i].value = "<@" + member.id + ">";
													success = true;
													break;
												}
											}
										}
										break;
									}
								}
							}
						}
						if(success === true)
						{
							const Embed = new Discord.MessageEmbed()
							.setColor('#00ffff')
							.setTitle(channelId.name)
							.setAuthor(member.user.tag, member.user.displayAvatarURL())
							.setDescription("<@" + member.id + ">님이 [해당파티](" + messageId.url + ") 에 " + `${emojiId}` + " 로 참가하셨습니다.")
							.setTimestamp()
							.setFooter("메시지 ID : " + messageId.id);
							client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
							messageId.edit({ embeds: [editEmbed] });
						}
						else
							messageId.reactions.cache.find(reaction => reaction.emoji.name == emojiId.name).users.remove(member.id);
					}
					catch (error)
					{
						console.log(error);
						messageId.reply("<@" + member.id + ">, 공대 입장에 실패했습니다.\n관리자에게 보고하십시오.").then(message => { setTimeout(() => message.delete(), 10000); });
					}
				}
				else
					messageId.reactions.cache.find(reaction => reaction.emoji.name == emojiId.name).users.remove(member.id);
			}
			break;
		}
		case 'MESSAGE_REACTION_REMOVE':
		{
			if (packet.d.guild_id == null) return;
			if (packet.d.channel_id === channelsId.log) return;
			const guild = client.guilds.cache.get(packet.d.guild_id);
			const member = await guild.members.fetch(packet.d.user_id);
			if (member.user.bot) return;
			if (packet.d.channel_id === channelsId.role)
			{
				if (packet.d.emoji.name in emoji_role)
				{
					try
					{
						const role = await guild.roles.cache.find(role => role.name === emoji_role[packet.d.emoji.name].name);
						switch(emoji_role[packet.d.emoji.name].slot)
						{
							case 0:
								{
									var check = true;
									for(var i = 0; i < 4; i++)
									{
										if(emoji_id[i].name != packet.d.emoji.name)
										{
											const oldrole = guild.roles.cache.find(r => r.name === emoji_role[emoji_id[i].name].name);
											if(member.roles.cache.has(oldrole.id))
											{
												check = false;
												break;
											}
										}
									}
									if(check)
									{
										const roletab = guild.roles.cache.find(r => r.name === "⁣              탱커              ⁣");
										member.roles.remove(roletab);
									}
									break;
								}
							case 1:
								{
									var check = true;
									for(var i = 4; i < 7; i++)
									{
										if(emoji_id[i].name != packet.d.emoji.name)
										{
											const oldrole = guild.roles.cache.find(r => r.name === emoji_role[emoji_id[i].name].name);
											if(member.roles.cache.has(oldrole.id))
											{
												check = false;
												break;
											}
										}
									}
									if(check)
									{
										const roletab = guild.roles.cache.find(r => r.name === "⁣              힐러              ⁣");
										member.roles.remove(roletab);
									}
									break;
								}
							case 2:
								{
									var check = true;
									for(var i = 7; i < 11; i++)
									{
										if(emoji_id[i].name != packet.d.emoji.name)
										{
											const oldrole = guild.roles.cache.find(r => r.name === emoji_role[emoji_id[i].name].name);
											if(member.roles.cache.has(oldrole.id))
											{
												check = false;
												break;
											}
										}
									}
									if(check)
									{
										const roletab = guild.roles.cache.find(r => r.name === "⁣            근접 딜러            ⁣");
										member.roles.remove(roletab);
									}
									break;
								}
							case 3:
								{
									var check = true;
									for(var i = 11; i < 14; i++)
									{
										if(emoji_id[i].name != packet.d.emoji.name)
										{
											const oldrole = guild.roles.cache.find(r => r.name === emoji_role[emoji_id[i].name].name);
											if(member.roles.cache.has(oldrole.id))
											{
												check = false;
												break;
											}
										}
									}
									if(check)
									{
										const roletab = guild.roles.cache.find(r => r.name === "⁣         원거리 물리 딜러         ⁣");
										member.roles.remove(roletab);
									}
									break;
								}
							case 4:
								{
									var check = true;
									for(var i = 14; i < 18; i++)
									{
										if(emoji_id[i].name != packet.d.emoji.name)
										{
											const oldrole = guild.roles.cache.find(r => r.name === emoji_role[emoji_id[i].name].name);
											if(member.roles.cache.has(oldrole.id))
											{
												check = false;
												break;
											}
										}
									}
									if(check)
									{
										const roletab = guild.roles.cache.find(r => r.name === "⁣             캐스터             ⁣");
										member.roles.remove(roletab);
									}
									break;
								}
						}
						member.roles.remove(role);
					}
					catch (error)
					{
						console.log(error);
						packet.d.channel_id.send("역할 제거에 실패하셨습니다.\n관리자에게 보고하십시오.").then(message => { setTimeout(() => message.delete(), 10000); });
					}
				}
			}
			const channelId = client.channels.cache.get(packet.d.channel_id);
			if (packet.d.channel_id == channelsId.jp_static_pve || packet.d.channel_id == channelsId.jp_party_pve || packet.d.channel_id == channelsId.jp_party_pvp ||
				packet.d.channel_id == channelsId.na_static_pve || packet.d.channel_id == channelsId.na_party_pve || packet.d.channel_id == channelsId.na_party_pvp ||
				packet.d.channel_id == channelsId.eu_static_pve || packet.d.channel_id == channelsId.eu_party_pve || packet.d.channel_id == channelsId.eu_party_pvp ||
				(channelId.isThread() &&
				(channelId.parentId == channelsId.jp_static_pve || channelId.parentId == channelsId.jp_party_pve || channelId.parentId == channelsId.jp_party_pvp ||
				channelId.parentId == channelsId.na_static_pve || channelId.parentId == channelsId.na_party_pve || channelId.parentId == channelsId.na_party_pvp ||
				channelId.parentId == channelsId.eu_static_pve || channelId.parentId == channelsId.eu_party_pve || channelId.parentId == channelsId.eu_party_pvp)))
			{
				if (packet.d.emoji.name in emoji_role)
				{
					const emojiId = client.emojis.cache.find(emoji => emoji.name == packet.d.emoji.name);
					const messageId = await channelId.messages.fetch(packet.d.message_id);
					try
					{
						var editEmbed = messageId.embeds[0];
						const index = isAlreadyRole(editEmbed,member);
						if(index != null)
						{
							if(editEmbed.fields[0].name == "연합 A")
							{
								const party = parseInt(index / 10) - 1;
								const slot = index % 10;
								const fieldvalue = editEmbed.fields[party].value.split("\n");
								const fieldname = fieldvalue[slot*3].split(" ");
								if(fieldname.length >= 2 && fieldname[1].replace(/[^0-9]/g,'') == emojiId.id)
								{
									editEmbed.fields[party].value = "";
									for(var i = 0; i < 8; i++)
									{
										if(slot == i)
											editEmbed.fields[party].value += fieldvalue[i * 3].substr(0,2) + "\n공석";
										else
											editEmbed.fields[party].value += fieldvalue[i * 3] + "\n" + fieldvalue[i * 3 + 1];
										if(i < 7)
											editEmbed.fields[party].value += "\n\n";
									}
									const Embed = new Discord.MessageEmbed()
									.setColor('#00ffff')
									.setTitle(channelId.name)
									.setAuthor(member.user.tag, member.user.displayAvatarURL())
									.setDescription("<@" + member.id + ">님이 [해당파티](" + messageId.url + ") 에 " + `${emojiId}` + " 직업을 탈퇴하셨습니다.")
									.setTimestamp()
									.setFooter("메시지 ID : " + messageId.id);
									client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
									messageId.edit({ embeds: [editEmbed] });
								}
							}
							else
							{
								const fieldname = editEmbed.fields[index].name.split(" ");
								if(fieldname.length >= 2 && fieldname[1].replace(/[^0-9]/g,'') == emojiId.id)
								{
									editEmbed.fields[index].name = fieldname[0];
									editEmbed.fields[index].value = "공석";
									const Embed = new Discord.MessageEmbed()
									.setColor('#00ffff')
									.setTitle(channelId.name)
									.setAuthor(member.user.tag, member.user.displayAvatarURL())
									.setDescription("<@" + member.id + ">님이 [해당파티](" + messageId.url + ") 에 " + `${emojiId}` + " 직업을 탈퇴하셨습니다.")
									.setTimestamp()
									.setFooter("메시지 ID : " + messageId.id);
									client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
									messageId.edit({ embeds: [editEmbed] });
								}
							}
						}
					}
					catch (error)
					{
						console.log(error);
						messageId.reply("탈퇴에 실패했습니다.\n관리자에게 보고하십시오.").then(message => { setTimeout(() => message.delete(), 10000); });
					}
				}
			}
			break;
		}
	}
});

async function sendMessage(msg, channel, text)
{
	try
	{
		if(channel != channelsId.log)
		{
			const channelId = client.channels.cache.get(channel);
			channelId.send(text).then(message =>
			{
				makingButton = new Discord.MessageButton();
				const Embed = new Discord.MessageEmbed()
				.setColor('#ffff00')
				.setTitle("콘솔")
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
				.setDescription("<#" + channelId.id + ">채널에 [메시지](" + message.url + ")를 송출하셨습니다.")
				.setTimestamp()
				.setFooter("메시지 ID : " + message.id);
				client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
				msg.reply("메시지가 성공적으로 송출되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
			});
		}
		else
			msg.reply("로그에는 송출할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
	catch(err)
	{
		console.log(err);
		msg.reply("메시지 송출에 실패했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function editMessage(msg, channel, message, text)
{
	try
	{
		if(channel != channelsId.log)
		{
			const channelId = client.channels.cache.get(channel);
			const messageId = await channelId.messages.fetch(message);
			const oldtext = messageId.content;
			messageId.edit(text);
			const Embed = new Discord.MessageEmbed()
			.setColor('#ffff00')
			.setTitle("콘솔")
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription("<#" + channelId.id + ">채널의 [메시지](" + messageId.url + ")를 수정하셨습니다.")
			.addFields(
					{ name : "수정 전" , value : oldtext },
					{ name : "수정 후" , value : text })
			.setTimestamp()
			.setFooter("메시지 ID : " + messageId.id);
			client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
			msg.reply("메시지가 성공적으로 수정되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
		}
		else
			msg.reply("로그에는 송출할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
	catch(err)
	{
		console.log(err);
		msg.reply("메시지 송출에 실패했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function removeMessage(msg, channel, message)
{
	try
	{
		if(channel != channelsId.log)
		{
			const channelId = client.channels.cache.get(channel);
			const messageId = await channelId.messages.fetch(message);
			const Embed = new Discord.MessageEmbed()
			.setColor('#ffff00')
			.setTitle("콘솔")
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription("<#" + channelId.id + ">채널의 메시지를 삭제했습니다.\n" + messageId.content)
			.setTimestamp()
			.setFooter("메시지 ID : " + messageId.id);
			client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
			messageId.delete();
			msg.reply("메시지가 성공적으로 삭제되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
		}
		else
			msg.reply("로그는 삭제할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
		
	}
	catch(err)
	{
		console.log(err);
		msg.reply("메시지 삭제에 실패했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function addEmoji(msg, channel, message, emoji)
{
	try
	{
		const emojiName = emoji.split(":");
		const emojiId = client.emojis.cache.find(emoji => emoji.name == emojiName[1]);
		const channelId = client.channels.cache.get(channel);
		const messageId = await channelId.messages.fetch(message);
		messageId.react(emojiId);
		const Embed = new Discord.MessageEmbed()
		.setColor('#ffff00')
		.setTitle("콘솔")
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
		.setDescription("<#" + channelId.id + ">채널에 있는 [해당 메시지](" + messageId.url + ") 에 " + `${emojiId}` + " 이모지를 추가하셨습니다.")
		.setTimestamp()
		.setFooter("메시지 ID : " + messageId.id);
		client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
		msg.reply("이모지가 성공적으로 추가되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
	catch(err)
	{
		console.log(err);
		msg.reply("메시지 발견에 오류가 났습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function addButton(msg, channel, message)
{
	try
	{
		if(channel != channelsId.log)
		{
			const channelId = client.channels.cache.get(channel);
			const messageId = await channelId.messages.fetch(message);
			const text = messageId.content;
			const embeds = messageId.embeds;
			const components = messageId.components;
			let row = new Discord.MessageActionRow();
			if(components.length > 0)
			{
				for(var i = 0; i < components.length; i++)
				{
					if(components[i].type == 'ACTION_ROW')
					{
						for(var j = 0; j < components[i].components.length; j++)
						{
							row.addComponents(components[i].components[j]);
						}
						break;
					}
				}
			}
			row.addComponents(makingButton);
			if(text != null && embeds.length != 0)
				messageId.edit({ content: text, embeds: [embeds], components: [row] });
			if(text != null && embeds.length == 0)
				messageId.edit({ content: text, components: [row] });
			if(text == null && embeds.length != 0)
				messageId.edit({ embeds: [embeds], components: [row] });
			const Embed = new Discord.MessageEmbed()
			.setColor('#ffff00')
			.setTitle("콘솔")
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription("<#" + channelId.id + ">채널의 [메시지](" + messageId.url + ")에 버튼을 추가하셨습니다.")
			.setTimestamp()
			.setFooter("메시지 ID : " + messageId.id);
			client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
			makingButton = new Discord.MessageButton();
			msg.reply("버튼이 성공적으로 추가되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
		}
		else
			msg.reply("로그에는 버튼을 추가할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
	catch(err)
	{
		console.log(err);
		msg.reply("버튼 추가에 실패했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function addMenu(msg, channel, message)
{
	try
	{
		if(channel != channelsId.log)
		{
			const channelId = client.channels.cache.get(channel);
			const messageId = await channelId.messages.fetch(message);
			const text = messageId.content;
			const embeds = messageId.embeds;
			const components = messageId.components;
			let row = new Discord.MessageActionRow();
			if(components.length > 0)
			{
				for(var i = 0; i < components.length; i++)
				{
					if(components[i].type == 'ACTION_ROW')
					{
						for(var j = 0; j < components[i].components.length; j++)
						{
							row.addComponents(components[i].components[j]);
						}
						break;
					}
				}
			}
			row.addComponents(makingMenu);
			if(text != null && embeds.length != 0)
				messageId.edit({ content: text, embeds: [embeds], components: [row] });
			if(text != null && embeds.length == 0)
				messageId.edit({ content: text, components: [row] });
			if(text == null && embeds.length != 0)
				messageId.edit({ embeds: [embeds], components: [row] });
			const Embed = new Discord.MessageEmbed()
			.setColor('#ffff00')
			.setTitle("콘솔")
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
			.setDescription("<#" + channelId.id + ">채널의 [메시지](" + messageId.url + ")에 메뉴를 추가하셨습니다.")
			.setTimestamp()
			.setFooter("메시지 ID : " + messageId.id);
			client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
			makingMenu = new Discord.MessageSelectMenu();
			msg.reply("메뉴가 성공적으로 추가되었습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
		}
		else
			msg.reply("로그에는 메뉴를 추가할 수 없습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
	catch(err)
	{
		console.log(err);
		msg.reply("메뉴 추가에 실패했습니다.").then(message => { setTimeout(() => message.delete(), 10000); });
	}
}

async function loadFile(msg, url)
{
	const response = await fetch("https://xivapi.com/character/"+url+"?columns=Character.Bio,Character.DC,Character.Name,Character.Server");
	const data = await response.json();
	if(data.Error == true)
	{
		msg.editReply({ content: "아이디를 찾지 못했습니다.\n혹은 로드스톤이 점검중입니다." });
		return;
	}
	dataBase.query("SELECT User_Id FROM UserSaveData WHERE FFXIV_Id = '" + url +"'", (err, res) =>
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			if(res.rows.length > 0)
			{
				if(res.rows[0].user_id != msg.member.id)
				{
					msg.editReply({ content: "다른 디스코드 계정이 이미 사용중인 로드스톤 캐릭터 입니다.\n관리자에게 보고하십시오." });
					return;
				}
			}
			if(data.Character.Bio == msg.member.id)
			{
				if(msg.member.nickname != data.Character.Name + "@" + data.Character.Server)
				{
					try
					{
						const oldname = msg.member.nickname;
						const dialogchannels = msg.guild.channels.cache.filter(channel => channel.parent.isThread() && channel.parent.id === channelsId.dialog && channel.name === msg.member.id);
						if(dialogchannels.size == 0)
						{
							msg.guild.channels.cache.get(channelsId.dialog).threads.create(
							{
								name: msg.member.id,
								autoArchiveDuration: 5,
								type: 'private_thread',
								reason: msg.user.tag + "님의 다이얼로그 생성"
							})
							.then(threadChannel => 
							{
								dataBase.query("INSERT INTO UserSaveData (User_Id, FFXIV_Id, Dialog) VALUES (" + msg.member.id + ", " + url + ", " + threadChannel.id + ") ON CONFLICT (User_Id) DO UPDATE SET FFXIV_Id = " + url + ", Dialog = " + threadChannel.id);
								threadChannel.members.add(msg.member);
							})
							.catch(console.error);
						}
						else
						{
							dialogchannels.first().members.add(msg.member);
							dataBase.query("INSERT INTO UserSaveData (User_Id, FFXIV_Id) VALUES (" + msg.member.id + ", " + url + ") ON CONFLICT (User_Id) DO UPDATE SET FFXIV_Id = " + url);
						}
						msg.member.setNickname(data.Character.Name+"@"+data.Character.Server);
						var checker = false;
						for(var i = 0; i < dataCenterNames.length; i++)
						{
							if(msg.member.roles.cache.has(dataCenterNames[i].id))
							{
								if(data.Character.DC !== dataCenterNames[i].eng)
									msg.member.roles.remove(dataCenterNames[i].id);
								else
									checker = true;
							}
						}
						if(!checker)
						{
							for(var i = 0; i < dataCenterNames.length; i++)
							{
								if(data.Character.DC === dataCenterNames[i].eng)
								{
									msg.member.roles.add(dataCenterNames[i].id);
									break;
								}
							}
						}
						msg.editReply({ content: "성공적으로 인증되었습니다" });
						const Embed = new Discord.MessageEmbed()
						.setColor('#ff00ff')
						.setTitle("서버-인증")
						.setAuthor(msg.user.tag, msg.user.displayAvatarURL(), "https://na.finalfantasyxiv.com/lodestone/character/" + url)
						.setDescription("<@" + msg.member.id + ">님이 " + oldname + " 에서 " + data.Character.Name + "@" + data.Character.Server + "으로 변경하셨습니다.\n[로드스톤](https://na.finalfantasyxiv.com/lodestone/character/" + url + ")")
						.setTimestamp()
						.setFooter("유저 ID : " + msg.member.id);
						client.channels.cache.get(channelsId.log).send({ embeds: [Embed] });
					}
					catch(error)
					{
						console.log(error);
					}
				}
				else
					msg.editReply({ content: "이미 인증하셨습니다." });
			}
			else
			{
				msg.editReply({ content: "당신의 DM으로 인증코드가 전송되었습니다." });
				msg.user.send("```당신의 인증코드는\n" + msg.user.id + "\n입니다.\n로드스톤에서 해당 캐릭터 프로필란에 입력 후 5분후에 해당 디스코드 서버에서 다시 인증하십시오.```").then(message => { setTimeout(() => message.delete(), 60000); });
			}
		}
	});
}

function getDataCenterColor(user, guild)
{
	for(var i = 0; i < dataCenterNames.length; i++)
	{
		const role = guild.roles.cache.find(r => r.name === dataCenterNames[i].kor);
		if(user.roles.cache.has(role.id))
		{
			return role.color;
		}
	}
	return null;
}

function sleep(ms)
{
	const wakeUpTime = Date.now() + ms;
	while (Date.now() < wakeUpTime) {}
}

async function getAvatarURL(id)
{
	const response = await fetch("https://xivapi.com/character/" + id + "?columns=Character.Avatar");
	const data = await response.json();
	return data.Character.Avatar;
}

function isAlreadyRole(editEmbed, member)
{
	if(editEmbed.fields[0].name == "연합 A")
	{
		for(var j=0; j<editEmbed.fields.length; j++)
		{
			const fieldvalue = editEmbed.fields[j].value.split("\n");
			for(var i=0; i<fieldvalue.length;i++)
			{
				if(fieldvalue[i] == "<@" + member.id + ">")
					return parseInt(i / 3) + 10 + 10 * j;
			}
		}
	}
	else
	{
		for(var i=0; i<editEmbed.fields.length;i++)
		{
			if(editEmbed.fields[i].value == "<@" + member.id + ">")
				return i;
		}
	}
	return null;
}

client.login(process.env.TOKEN);
