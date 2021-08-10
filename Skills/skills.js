const TankSkill =
[
    {
        name : "철벽 방어 [ ランパート , Rampart ]",
        description : "일정시간 동안 자신이 받는 피해량이 20% 감소합니다.`효과시간: 20초",
        icon : "https://img.finalfantasyxiv.com/lds/d/37546679ae5e431c0903b20fa2c91a88c5a8e001.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "90초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "8"
    },
    {
        name : "비열한 기습 [ ロウブロウ , 	Low Blow ]",
        description : "대상을 기절시킵니다.`효과시간 : 5초",
        icon : "https://img.finalfantasyxiv.com/lds/d/af837b3dd467ee9cdf865a06eb2b1633dd2b492a.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "25초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "12"
    },
    {
        name : "도발 [ 挑発 , Provoke ]",
        description : "대상을 도발하고, 자신에 대한 적개심을 최고위로 한 다음, 한층 더 자신에 대한 적개심을 상승시킨다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/2b45fea903bcf1edd9e08110cf95e8bba9a73c0d.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "30초",
        range : "25m",
        radius : "0m",
        //mp : "",
        level : "15"
    },
    {
        name : "말참견 [ インタージェクト , Interject ]",
        description : "대상의 기술 시전을 중단시킵니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/8442bcce1ec21a449546af9afb79ae9ea8c226cb.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "30초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "18"
    },
    {
        name : "앙갚음 [ リプライザル , Reprisal ]",
        description : "자신 주위의 적이 주는 피해량을 10% 감소시킨다.`효과시간: 10초",
        icon : "https://img.finalfantasyxiv.com/lds/d/6b83d9368623d5cd20a426d26916021b59a14963.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "60초",
        range : "0m",
        radius : "5m",
        //mp : "",
        level : "22"
    },
    {
        name : "거리 유지 [ アームズレングス , Arm's Length ]",
        description : "자신에게 장벽을 치고 효과시간 중에는 일부를 제외한 모든 밀쳐내기와 끌어당기기를 무효화한다.`효과시간: 6초`장벽 추가효과(물리 공격시 발동확률 100%): 공격자에게 20%슬로우를 부여한다.`효과시간: 15초",
        icon : "https://img.finalfantasyxiv.com/lds/d/00ff21ad3e1fb26d7b292a9d912931e7ea64daa4.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "120초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "32"
    },
    {
        name : "기피 [ シャーク , Shirk ]",
        description : "자신을 향한 적개심의 25%를 대상 파티원에게 이동시킵니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/4abd24800cb0999fff8ea79ed1085a7b5f8b14cb.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "120초",
        range : "25m",
        radius : "0m",
        //mp : "",
        level : "48"
    }
];

const PaladinSkill = [
    {
        name : "재빠른 검격 [ ファストブレード , Fast Blade ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 200",
        icon : "https://img.finalfantasyxiv.com/lds/d/8325a7bb54f039c5bd3cd2af4430dccfd525e0b9.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "1"
    },
    {
        name : "임전무퇴 [ ファイト・オア・フライト , Fight or Flight ]",
        description : "자신이 주는 물리 피해량이 25% 증가합니다.`효과시간: 25초",
        icon : "https://img.finalfantasyxiv.com/lds/d/87405b9b9f00d9957df252ea0116e4137bc4dbd1.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "60초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "2"
    },
    {
        name : "폭도의 검격 [ ライオットソード , Riot Blade ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 100`콤보 조건: 재빠른 검격 [ ファストブレード , Fast Blade ]`콤보 시 위력: 300`콤보 보너스: 자신의 MP 회복",
        icon : "https://img.finalfantasyxiv.com/lds/d/bdda04f3b284e3cbf7d07e50d9bffb21b74ce869.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "4"
    },
    {
        name : "개기식 [ トータルエクリプス , Total Eclipse ]",
        description : "자신을 중심으로 주위 적에게 물리 공격을 가합니다.`위력: 120",
        icon : "https://img.finalfantasyxiv.com/lds/d/07c42572697cdcf5381955b09ed7c3028be8a0bb.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "0m",
        radius : "5m",
        //mp : "",
        level : "6"
    },
    {
        name : "방패 가격 [ シールドバッシュ , Shield Bash ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 110`추가 효과: 대상을 기절시킵니다.`효과시간: 6초",
        icon : "https://img.finalfantasyxiv.com/lds/d/49cbc217420d69d69bb1bfcf6fba10358dcd2521.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "10"
    },
    {
        name : "굳건한 의지 [ アイアンウィル , Iron Will ]",
        description : "전투 중 자신에 대한 적개심이 매우 높게 상승합니다.`재사용 시 해제됩니다.`효과시간: 해제 시까지",
        icon : "https://img.finalfantasyxiv.com/lds/d/1e60c8b0c72bbc52497a163755dc855f5cdf7091.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "10초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "10"
    },
    {
        name : "방패 던지기 [ シールドロブ , Shield Lob ]",
        description : "대상에게 원거리 물리 공격을 가합니다.`위력: 120`추가 효과: 적개심 상승",
        icon : "https://img.finalfantasyxiv.com/lds/d/d95d796eae4df45f2419a8c6df1cdf4afc7b0523.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "15m",
        radius : "0m",
        //mp : "",
        level : "15"
    },
    {
        name : "할로네의 분노 [ レイジ・オブ・ハルオーネ , Rage of Halone ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 100`콤보 조건: 폭도의 검격 [ ライオットソード , Riot Blade ]`콤보 시 위력: 350",
        icon : "https://img.finalfantasyxiv.com/lds/d/b35b9fa5ce7169d660177032734661f18a79ee5b.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "26"
    },
    {
        name : "내면의 기개 [ スピリッツウィズイン , Spirits Within ]",
        description : "대상에게 물리 공격을 가합니다.`자신의 남은 HP가 많을수록 위력이 증가합니다.`위력: 100~370`추가 효과: 자신의 MP 회복",
        icon : "https://img.finalfantasyxiv.com/lds/d/77d7542966599928d86107be0838c975b85b466b.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "30초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "30"
    },
    {
        name : "방벽 [ シェルトロン , Sheltron ]",
        description : "일정 시간동안 받는 공격에 반드시 블록합니다.`효과시간: 6초`발동조건: 충의 [ オウス , Oath ] 50",
        icon : "https://img.finalfantasyxiv.com/lds/d/e622516a93fd2298b9fd40e0d2d60c3fc8485c5a.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "5초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "35"
    },
    {
        name : "경계 [ センチネル , Sentinel ]",
        description : "일정 시간동안 자신의 피해량을 30% 경감시킨다.`효과시간: 15초",
        icon : "https://img.finalfantasyxiv.com/lds/d/913eb4344bb6c8710f250115fa22484b026f08bd.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "120초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "38"
    },
    {
        name : "홍염 [ プロミネンス , Prominence ]",
        description : "자신을 중심으로 주위 적에게 범위 물리 공격을 가합니다.`위력100`콤보조건: 개기식 [ トータルエクリプス , Total Eclipse ]`콤보 시 위력: 220`콤보 보너스: 자신의 MP 회복",
        icon : "https://img.finalfantasyxiv.com/lds/d/c0f8a1aa0ba0a20c0d8580e63932678c5c4a8b9b.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "0m",
        radius : "5m",
        //mp : "",
        level : "40"
    },
    {
        name : "감싸기 [ かばう , Cover ]",
        description : "대상 파티원이 받는 공격을 대신 받습니다.`일부 공격은 해당되지 않습니다.`효과시간: 12초`대상과 10m 이상 떨어지면 효과가 발휘되지 않습니다.`발동조건: 충의 [ オウス , Oath ] 50",
        icon : "https://img.finalfantasyxiv.com/lds/d/81b581992c0df5ad867ed18ad229f6d6f7fd3eea.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "120초",
        range : "10m",
        radius : "0m",
        //mp : "",
        level : "45"
    },
    {
        name : "파멸의 진 [ サークル・オブ・ドゥーム , Circle of Scorn ]",
        description : "자신을 중심으로 주위 적에게 범위 물리 공격을 가하고, 15초 동안 지속 피해를 줍니다.`위력: 120`지속 피해 위력: 35",
        icon : "https://img.finalfantasyxiv.com/lds/d/af5ddb89ddd5ade6706afe571f45aa6028e1925b.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "25초",
        range : "0m",
        radius : "5m",
        //mp : "",
        level : "50"
    },
    {
        name : "천하무적 [ インビンシブル , Hallowed Ground ]",
        description : "10초 동안 일부를 제외한 모든 피해를 무효화합니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/249bf48c39ec44b9b32f0681ea256850ed6aa8f8.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "420초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "50"
    },
    {
        name : "꿰뚫는 검격 [ ゴアブレード , Goring Blade ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 100`콤보 조건: 폭도의 검격 [ ライオットソード , Riot Blade ]`콤보 시 위력: 390`콤보 보너스: 대상에게 21초 동안 지속 피해 부여`지속 피해 위력: 85",
        icon : "https://img.finalfantasyxiv.com/lds/d/eb067afbfb5a4198760b2e28e9c3cf669d9866b8.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "54"
    },
    {
        name : "신성한 보호막 [ ディヴァインヴェール , 	Divine Veil ]",
        description : "30초 안에 자신 또는 파티원의 회복마법을 받으면 반경 15m 이내의 파티원에게 보호막을 칩니다.`보호막 효과: 30초 동안 시전자의 최대 HP 대비 10%만큼 피해를 흡수합니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/495faab61344751872ca0867e2d5e59b04c6940c.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "90초",
        range : "0m",
        radius : "0m",
        //mp : "",
        level : "56"
    },
    {
        name : "관용 [ クレメンシー , Clemency ]",
        description : "대상의 HP를 회복합니다. 대상이 파티원인 경우, 회복된 HP의 50%만큼 자신도 HP를 회복합니다.`회복력: 1200",
        icon : "https://img.finalfantasyxiv.com/lds/d/3c20e8bf8f5f130db398ac4ba5df14e403b7666a.png",
        type : "마법",
        cast : "1.5초",
        recast : "2.5초",
        range : "30m",
        radius : "0m",
        mp : "2000",
        level : "58"
    },
    {
        name : "제왕의 권위 [ ロイヤルアソリティ , Royal Authority ]",
        description : "대상에게 물리 공격을 가합니다.`위력: 100`콤보 조건: 폭도의 검격 [ ライオットソード , Riot Blade ]`콤보 시 위력: 550`콤보 보너스: 자신에게 15초 동안 충의의 검 [ 忠義の剣 , Sword Oath ] 3단계 부여",
        icon : "https://img.finalfantasyxiv.com/lds/d/3fe523f08ebd0b93125ae42d5bcf8e18dce08a02.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "60"
    },
    {
        name : "중재 [ インターベンション , Intervention ]",
        description : "충의 [ オウス , Oath ] 50을 소비하여 6초 동안 파티원 1명이 받는 피해량을 10% 감소시킵니다.`추가 효과: 자신에게 철벽 방어 [ ランパート , Rampart ] 또는 경계 [ センチネル , Sentinel ]가 적용되는 동안에 사용하면, 대상이 받는 피해량 감소 효과가 해당 기술의 절반만큼 향상됩니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/fdb9b8347b33dae63e25debeab15aa75c270f39a.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "10초",
        range : "30m",
        radius : "0m",
        //mp : "",
        level : "62"
    },
    {
        name : "성령의 권능 [ ホーリースピリット , Holy Spirit ]",
        description : "대상에게 무속성 마법 공격을 가합니다.`위력: 350",
        icon : "https://img.finalfantasyxiv.com/lds/d/b8ad098c5afaad79a847f3fb79298456c1e9d689.png",
        type : "마법",
        cast : "1.5초",
        recast : "2.5초",
        range : "25m",
        radius : "0m",
        mp : "2000",
        level : "64"
    },
    {
        name : "안식 기도 [ レクイエスカット , Requiescat ]",
        description : "대상에게 무속성 마법 공격을 가합니다.`위력: 550`자신의 남은 MP가 적을수록 위력이 감소합니다.`추가 효과: 남은 MP가 최대 MP의 80% 이상일 경우, 12초 동안 공격마법으로 주는 피해량과 회복 마법의 회복량이 50% 증가하며 시전 시간 없이 마법을 사용할 수 있습니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/acbcd4de5a1839e4fd8c96ae05eb4109caed9ca1.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "60초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "68"
    },
    {
        name : "결연한 수호자 [ パッセージ・オブ・アームズ , Passage of Arms ]",
        description : "18초 동안 자신의 방패 막기 발동률이 100%가 되고, 후방 부채꼴 범위 안에 있는 파티원이 받는 피해를 15% 감소시킵니다.`효과 지속 중에 움직이면 즉시 해제됩니다.`실행 후 자동 공격이 정지됩니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/b570dfda793945b3bb8fddef02b1a865b8a04b32.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "120초",
        range : "0m",
        radius : "8m",
        //mp : "",
        level : "70"
    },
    {
        name : "신성한 원 [ ホーリーサークル , Holy Circle ]",
        description : "자신을 중심으로 주위 적에게 무속성 범위 마법 공격을 가합니다.`위력: 250",
        icon : "https://img.finalfantasyxiv.com/lds/d/dc9363f9c04c5c75cf48e2a500bbbbe0d4710a35.png",
        type : "마법",
        cast : "1.5초",
        recast : "2.5초",
        range : "0m",
        radius : "5m",
        mp : "2000",
        level : "72"
    },
    {
        name : "개입 [ インターヴィーン , Intervene ]",
        description : "대상에게 신속하게 접근하여 물리 공격을 가합니다.`위력: 200`최대 누적수: 2`속박 상태에서는 사용할 수 없습니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/c841f5c954aa4e31bd1d82ffd00f863eb944a386.png",
        type : "어빌리티",
        cast : "즉시 발동",
        recast : "30초",
        range : "15m",
        radius : "0m",
        //mp : "",
        level : "74"
    },
    {
        name : "회한의 검 [ ロイエ , Atonement ]",
        description : "충의의 검 [ 忠義の剣 , Sword Oath ] 1단계를 소비하여, 대상에게 물리 공격을 가하고 자신의 MP를 회복합니다.`위력: 550",
        icon : "https://img.finalfantasyxiv.com/lds/d/f59cb1517f2f26c490a87d58366b5bccff372f19.png",
        type : "웨폰 스킬",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "3m",
        radius : "0m",
        //mp : "",
        level : "76"
    },
    {
        name : "고백 기도 [ コンフィテオル , Confiteor ]",
        description : "안식 기도 [ レクイエスカット , Requiescat ] 효과를 소비하여, 대상과 그 주위 적에게 무속성 범위 마법 공격을 가합니다.`위력: 800",
        icon : "https://img.finalfantasyxiv.com/lds/d/362579dcb6dc2b7c9ea6eac6917c7b9c61f7ce1b.png",
        type : "마법",
        cast : "즉시 발동",
        recast : "2.5초",
        range : "25m",
        radius : "5m",
        mp : "2000",
        level : "80"
    }
];

const PaladinTrait =
[
    {
        name : "방어 숙련 [ タンクマスタリー , Tank Mastery ]",
        description : "자신이 받는 피해량이 20% 감소합니다.`활력 및 힘 능력치에 따른 최대 HP 및 주는 피해량 수치에 방어 역할 고유의 증가치가 붙습니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/b6414caac03c831ec90c34e501e444031d44003c.png",
        level : "1"
    },
    {
        name : "충의 숙련 [ 忠義マスタリー , Oath Mastery ]",
        description : "자동 공격이 명중할 때 마다 충의 [ オウス , Oath ]가 5씩 증가합니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/c97161e572623646278dfd6fa020475e13fe529a.png",
        level : "35"
    },
    {
        name : "기사도 [ シバルリー , Chivalry ]",
        description : "폭도의 검격 [ ライオットソード , Riot Blade ]과 내면의 기개 [ スピリッツウィズイン , Spirits Within ]에 MP 회복 효과가 추가 됩니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/4b7555b6cbdbf6b07c617b5b509f7429f0f4ef93.png",
        level : "58"
    },
    {
        name : "할로네의 분노 숙련 [ レイジ・オブ・ハルオーネマスタリー , Rage of Halone Mastery ]",
        description : "할로네의 분노 [ レイジ・オブ・ハルオーネ , Rage of Halone ]가 제왕의 권위 [ ロイヤルアソリティ , Royal Authority ]로 변화합니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/39b5861722dd63bcf20bebf2abefc74c5356d387.png",
        level : "60"
    },
    {
        name : "신성 마법 숙련 [ 神聖魔法マスタリー , Divine Magic Mastery ]",
        description : "마법의 소비 MP가 50% 감소하고, 공격받아도 시전이 중단되지 않습니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/815a1f0594a8f931d556eb9a8b7d96e100e26c02.png",
        level : "64"
    },
    {
        name : "홍염 효과 향상 [ プロミネンス効果アップ , Enhanced Prominence ]",
        description : "홍염 [ プロミネンス , Prominence ]에 MP 회복 효과가 추가됩니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/a9ede15173bae76cc4d80dea6b4561e7124767c6.png",
        level : "66"
    },
    {
        name : "방벽 효과 향상 [ シェルトロン効果アップ , Enhanced Sheltron ]",
        description : "방벽 [ シェルトロン , Sheltron ]의 지속시간이 6초로 늘어납니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/3e996f1f8ad2754a92af246efd96067a0dd4b836.png",
        level : "74"
    },
    {
        name : "충의의 검 [ 忠義の剣 , Sword Oath ]",
        description : "제왕의 권위 [ ロイヤルアソリティ , Royal Authority ] 콤보 성공 시 충의의 검 [ 忠義の剣 , Sword Oath ]이 3단계가 부여됩니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/8db9eaad2592dd6df49ff21328773d0b428caeb1.png",
        level : "76"
    },
    {
        name : "안식 기도 효과 향상 [ レクイエスカット効果アップ , Enhanced Requiescat ]",
        description : "안식 기도 [ レクイエスカット , Requiescat ] 지속 중에는 시전 시간 없이 마법을 사용할 수 있습니다.",
        icon : "https://img.finalfantasyxiv.com/lds/d/a21087cafe218d0e03e3f4e86e23985f7ad04ce2.png",
        level : "78"
    }
];
/*
const WarriorSkill =
[
    {
        name : "",
        description : "",
        icon : "",
        type : "",
        cast : "",
        recast : "",
        range : "",
        radius : "",
        mp : "",
        level : ""
    }
];*/
