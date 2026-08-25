(() => {

"use strict";

/*
==============================================================
PRIYANKA ♥ DEBASHIS
SINGLE CONTINUOUS STORY GAME
==============================================================

STORY FLOW

1. Priyanka and Debashis meet.
2. Debashis walks to Priyanka.
3. Dialogue:
   Debashis: "Bengali?"
   Priyanka:  "YES"
   Debashis: "Haat ta Dao"
   Priyanka:  "Yarki Hoche naki, haat dhorbe!"
4. Priyanka becomes angry, turns left and runs away.
5. Large separation is created.
6. Enemies begin attacking Debashis.
7. Priyanka controls BOTH characters through mirroring.
8. Enemy defeated -> Priyanka gets closer.
9. Priyanka hurt -> Debashis gets farther away.
10. When they meet -> Happy Halfway Anniversary.
11. Continue -> they play together forever.

There is NO level name and NO fixed world ending.
The terrain keeps generating forever.
==============================================================
*/


// ============================================================
// DOM
// ============================================================

const canvas =
  document.getElementById(
    "gameCanvas"
  );

const ctx =
  canvas.getContext(
    "2d"
  );

const startOverlay =
  document.getElementById(
    "startOverlay"
  );

const startButton =
  document.getElementById(
    "startButton"
  );

const dialogueBox =
  document.getElementById(
    "dialogueBox"
  );

const dialogueSpeaker =
  document.getElementById(
    "dialogueSpeaker"
  );

const dialogueText =
  document.getElementById(
    "dialogueText"
  );

const hud =
  document.getElementById(
    "hud"
  );

const mobileControls =
  document.getElementById(
    "mobileControls"
  );

const healthElement =
  document.getElementById(
    "priyankaHealth"
  );

const heartsElement =
  document.getElementById(
    "debashisHearts"
  );

const progressFill =
  document.getElementById(
    "heartProgressFill"
  );

const gameHint =
  document.getElementById(
    "gameHint"
  );

const gameMessage =
  document.getElementById(
    "gameMessage"
  );

const celebrationOverlay =
  document.getElementById(
    "celebrationOverlay"
  );

const continueButton =
  document.getElementById(
    "continueButton"
  );

const closeButton =
  document.getElementById(
    "closeButton"
  );

const gameOverOverlay =
  document.getElementById(
    "gameOverOverlay"
  );

const restartButton =
  document.getElementById(
    "restartButton"
  );

const closedOverlay =
  document.getElementById(
    "closedOverlay"
  );

const fadeScreen =
  document.getElementById(
    "fadeScreen"
  );

const soundButton =
  document.getElementById(
    "soundButton"
  );


// ============================================================
// GAME STATES
// ============================================================

const MODE = {

  WAIT:
    "WAIT",

  MEETING:
    "MEETING",

  DIALOGUE:
    "DIALOGUE",

  RUNAWAY:
    "RUNAWAY",

  CHASE:
    "CHASE",

  CELEBRATION:
    "CELEBRATION",

  TOGETHER:
    "TOGETHER",

  GAME_OVER:
    "GAME_OVER",

  CLOSED:
    "CLOSED"
};


let mode =
  MODE.WAIT;


// ============================================================
// MAIN CONFIGURATION
//
// THIS IS THE FIRST PLACE TO EDIT GAME DIFFICULTY.
// ============================================================

const CONFIG = {

  //-------------------------------------------
  // Relationship distance
  //-------------------------------------------

  startDistance:
    1050,

  reunionDistance:
    82,

  minimumDistance:
    70,

  maximumDistance:
    1750,


  //-------------------------------------------
  // Distance rewards
  //-------------------------------------------

  normalKillReward:
    27,

  fastKillReward:
    34,

  strongKillReward:
    52,

  eliteKillReward:
    72,


  //-------------------------------------------
  // Penalties
  //-------------------------------------------

  priyankaHitPenalty:
    62,

  debashisHitPenalty:
    35,


  //-------------------------------------------
  // Health
  //-------------------------------------------

  priyankaMaxHealth:
    100,

  debashisMaxHearts:
    3,


  //-------------------------------------------
  // Movement
  //-------------------------------------------

  walkSpeed:
    180,

  runSpeed:
    325,

  jumpPower:
    570,

  gravity:
    1500,

  dodgeDuration:
    0.42,


  //-------------------------------------------
  // Combat
  //-------------------------------------------

  heartSpeed:
    520,

  heartCooldown:
    0.33,


  //-------------------------------------------
  // Enemy balance
  //
  // Moderate but intentionally challenging.
  //-------------------------------------------

  enemySpawnMin:
    1.15,

  enemySpawnMax:
    2.20,

  maxActiveEnemies:
    3,


  //-------------------------------------------
  // Enemy counterattack
  //-------------------------------------------

  enemyAttackChance:
    0.38,

  enemyAttackTravelTime:
    1.05,


  //-------------------------------------------
  // Procedural scenery
  //-------------------------------------------

  chunkWidth:
    820,

  chunksAhead:
    5,

  chunksBehind:
    2
};


// ============================================================
// CHARACTER ATLASES
// ============================================================

const PRIYANKA_CELL = {

  width:
    200,

  height:
    220
};


const DEBASHIS_CELL = {

  width:
    200,

  height:
    220
};


const PRIYANKA_ANIMS = {

  idle:
    { row:0, frames:6, fps:4 },

  walkR:
    { row:1, frames:7, fps:8 },

  walkL:
    { row:2, frames:7, fps:8 },

  runR:
    { row:3, frames:7, fps:11 },

  runL:
    { row:4, frames:7, fps:11 },

  jump:
    { row:5, frames:4, fps:8 },

  dodge:
    { row:6, frames:3, fps:13 },

  attack:
    { row:7, frames:3, fps:11 }
};


const DEBASHIS_ANIMS = {

  idle:
    { row:0, frames:5, fps:4 },

  walkR:
    { row:1, frames:7, fps:8 },

  walkL:
    { row:2, frames:7, fps:8 },

  runR:
    { row:3, frames:7, fps:11 },

  runL:
    { row:4, frames:7, fps:11 },

  jump:
    { row:5, frames:4, fps:8 },

  dodge:
    { row:6, frames:3, fps:13 },

  attack:
    { row:7, frames:4, fps:11 }
};


// ============================================================
// LOAD IMAGES
// ============================================================

const priyankaAtlas =
  new Image();

priyankaAtlas.src =
  "assets/priyanka_atlas.png";


const debashisAtlas =
  new Image();

debashisAtlas.src =
  "assets/debashis_atlas.png";


const environmentAtlas =
  new Image();

environmentAtlas.src =
  "assets/environment_atlas.png";


// ============================================================
// ENVIRONMENT ATLAS CROPS
//
// Edit these rectangles if you later want to recrop
// environment_atlas.png.
// ============================================================

const ENV = {

  sky:
    {x:10, y:18, w:1028, h:95},

  mid:
    {x:10, y:140, w:1028, h:95},

  forest:
    {x:10, y:252, w:1028, h:95},

  front:
    {x:10, y:373, w:1028, h:52},

  heartDoor:
    {x:10, y:442, w:120, h:136},

  fountain:
    {x:132, y:446, w:150, h:128},

  pinkTree:
    {x:283, y:440, w:165, h:140},

  windmill:
    {x:452, y:448, w:160, h:132},

  bridge:
    {x:610, y:448, w:180, h:128},

  portal:
    {x:810, y:438, w:150, h:150},

  gazebo:
    {x:982, y:446, w:150, h:140},

  grass:
    {x:1090, y:157, w:145, h:45},

  purpleTree:
    {x:172, y:720, w:120, h:130},

  goldTree:
    {x:295, y:718, w:120, h:130},

  flowerPatch:
    {x:612, y:726, w:120, h:70},

  mist:
    {x:1208, y:850, w:120, h:45}
};


// ============================================================
// CANVAS SIZE
// ============================================================

let W =
  0;

let H =
  0;

let DPR =
  1;


function resize() {

  DPR =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  W =
    window.innerWidth;

  H =
    window.innerHeight;

  canvas.width =
    Math.round(
      W *
      DPR
    );

  canvas.height =
    Math.round(
      H *
      DPR
    );

  canvas.style.width =
    W +
    "px";

  canvas.style.height =
    H +
    "px";

  ctx.setTransform(
    DPR,
    0,
    0,
    DPR,
    0,
    0
  );
}


window.addEventListener(
  "resize",
  resize
);

resize();


// ============================================================
// UTILITY
// ============================================================

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}


function lerp(
  a,
  b,
  t
) {

  return (
    a +
    (
      b -
      a
    ) *
    t
  );
}


function randomRange(
  min,
  max
) {

  return (
    min +
    Math.random() *
    (
      max -
      min
    )
  );
}


function groundY() {

  return (
    H *
    0.79
  );
}


// ============================================================
// MAIN GAME DATA
// ============================================================

const player = {

  worldX:
    0,

  y:
    0,

  vy:
    0,

  health:
    CONFIG
      .priyankaMaxHealth,

  grounded:
    true,

  facing:
    1,

  state:
    "idle",

  animTime:
    0,

  attacking:
    0,

  attackCooldown:
    0,

  dodging:
    0,

  invulnerable:
    0
};


const debashis = {

  hearts:
    CONFIG
      .debashisMaxHearts,

  y:
    0,

  vy:
    0,

  grounded:
    true,

  facing:
    1,

  state:
    "idle",

  animTime:
    0,

  attacking:
    0,

  dodging:
    0
};


let relationshipDistance =
  CONFIG.startDistance;


let worldScroll =
  0;


let enemySpawnTimer =
  2.4;


let hazardSpawnTimer =
  4.2;


let time =
  0;


let celebrationTime =
  0;


let messageTimer =
  0;


const keys = {

  left:
    false,

  right:
    false,

  run:
    false
};


const enemies =
  [];


const hearts =
  [];


const incomingAttacks =
  [];


const hazards =
  [];


const particles =
  [];


const chunks =
  new Map();


// ============================================================
// OPENING CINEMATIC DATA
// ============================================================

const meeting = {

  priyankaX:
    0,

  debashisX:
    0,

  targetDebashisX:
    0,

  phaseTime:
    0
};


const dialogueSequence = [

  {
    speaker:
      "DEBASHIS",

    text:
      "Bengali?",

    duration:
      1.55,

    sound:
      "dialogueDebashis"
  },

  {
    speaker:
      "PRIYANKA",

    text:
      "YES",

    duration:
      1.25,

    sound:
      "dialoguePriyanka"
  },

  {
    speaker:
      "DEBASHIS",

    text:
      "Haat ta Dao",

    duration:
      1.65,

    sound:
      "dialogueDebashis"
  },

  {
    speaker:
      "PRIYANKA",

    text:
      "Yarki Hoche naki, haat dhorbe!",

    duration:
      2.35,

    sound:
      "dialoguePriyanka"
  }
];


let dialogueIndex =
  -1;


let dialogueTimer =
  0;


// ============================================================
// ENEMY TYPES
// ============================================================

const ENEMY_TYPES = {

  shadow: {

    hp:
      1,

    speed:
      82,

    reward:
      CONFIG
        .normalKillReward,

    radius:
      25,

    color:
      "#351334"
  },


  runner: {

    hp:
      1,

    speed:
      122,

    reward:
      CONFIG
        .fastKillReward,

    radius:
      23,

    color:
      "#68408d"
  },


  thorn: {

    hp:
      2,

    speed:
      74,

    reward:
      CONFIG
        .strongKillReward,

    radius:
      29,

    color:
      "#3c6a39"
  },


  guardian: {

    hp:
      4,

    speed:
      60,

    reward:
      CONFIG
        .eliteKillReward,

    radius:
      34,

    color:
      "#8c234b"
  }
};


// ============================================================
// PROCEDURAL CHUNK GENERATOR
// ============================================================

function seededRandom(
  seed
) {

  let x =
    Math.sin(
      seed *
      999.91
    ) *
    43758.5453;

  return (
    x -
    Math.floor(
      x
    )
  );
}


function createChunk(
  index
) {

  const types = [

    "pinkTree",

    "fountain",

    "purpleTree",

    "goldTree",

    "flowerPatch",

    "windmill",

    "bridge",

    "gazebo"
  ];


  const objects =
    [];


  const count =
    4 +
    Math.floor(
      seededRandom(
        index +
        2
      ) *
      4
    );


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const r =
      seededRandom(
        index *
        20 +
        i *
        7.37
      );


    const type =
      types[
        Math.floor(
          r *
          types.length
        )
      ];


    objects.push({

      type,

      x:
        index *
        CONFIG.chunkWidth +
        90 +
        seededRandom(
          index *
          40 +
          i *
          5.9
        ) *
        (
          CONFIG.chunkWidth -
          180
        ),

      scale:
        0.6 +
        seededRandom(
          index *
          70 +
          i
        ) *
        0.55
    });
  }


  return {

    index,

    objects
  };
}


function maintainChunks() {

  const center =
    Math.floor(
      worldScroll /
      CONFIG.chunkWidth
    );


  for (
    let i =
      center -
      CONFIG.chunksBehind;
    i <=
      center +
      CONFIG.chunksAhead;
    i++
  ) {

    if (
      i < 0
    ) {

      continue;
    }


    if (
      !chunks.has(
        i
      )
    ) {

      chunks.set(
        i,
        createChunk(
          i
        )
      );
    }
  }


  for (
    const index
    of chunks.keys()
  ) {

    if (
      index <
      center -
      CONFIG.chunksBehind -
      1
    ) {

      chunks.delete(
        index
      );
    }
  }
}


// ============================================================
// UI
// ============================================================

function showMessage(
  text,
  duration = 1.6
) {

  gameMessage
    .textContent =
    text;

  gameMessage
    .classList
    .add(
      "show"
    );

  messageTimer =
    duration;
}


function hideMessage() {

  gameMessage
    .classList
    .remove(
      "show"
    );
}


function updateHud() {

  const hp =
    clamp(
      player.health /
      CONFIG.priyankaMaxHealth,
      0,
      1
    );


  healthElement
    .style
    .width =
    (
      hp *
      100
    ) +
    "%";


  const heartNodes =
    heartsElement
      .querySelectorAll(
        "span"
      );


  heartNodes
    .forEach(
      (
        node,
        index
      ) => {

        node
          .classList
          .toggle(
            "lost",
            index >=
            debashis.hearts
          );
      }
    );


  const progress =
    clamp(
      (
        CONFIG.startDistance -
        relationshipDistance
      ) /
      (
        CONFIG.startDistance -
        CONFIG.reunionDistance
      ),
      0,
      1
    );


  progressFill
    .style
    .width =
    (
      progress *
      100
    ) +
    "%";
}


// ============================================================
// CHARACTER SCREEN POSITIONS
// ============================================================

function chaseSeparation() {

  const t =
    clamp(
      (
        relationshipDistance -
        CONFIG.reunionDistance
      ) /
      (
        CONFIG.startDistance -
        CONFIG.reunionDistance
      ),
      0,
      1
    );


  return lerp(
    W *
      0.12,
    W *
      0.43,
    t
  );
}


function getCharacterScreenPositions() {

  if (
    mode ===
    MODE.TOGETHER
  ) {

    return {

      priyanka:
        W *
        0.60,

      debashis:
        W *
        0.43
    };
  }


  return {

    priyanka:
      W *
      0.20,

    debashis:
      W *
      0.20 +
      chaseSeparation()
  };
}


// ============================================================
// CHARACTER ACTIONS
// ============================================================

function setMirroredState(
  state
) {

  player.state =
    state;

  debashis.state =
    state;
}


function jump() {

  if (
    !player.grounded ||
    player.dodging >
    0
  ) {

    return;
  }


  player.vy =
    CONFIG.jumpPower;

  debashis.vy =
    CONFIG.jumpPower;


  player.grounded =
    false;

  debashis.grounded =
    false;


  gameAudio.play(
    "jump",
    0.72
  );
}


function dodge() {

  if (
    player.dodging >
    0
  ) {

    return;
  }


  player.dodging =
    CONFIG.dodgeDuration;

  debashis.dodging =
    CONFIG.dodgeDuration;


  player.invulnerable =
    CONFIG.dodgeDuration +
    0.12;


  gameAudio.play(
    "dodge",
    0.65
  );
}


function fireHeart() {

  if (
    player.attackCooldown >
    0
  ) {

    return;
  }


  player.attackCooldown =
    CONFIG.heartCooldown;


  player.attacking =
    0.28;

  debashis.attacking =
    0.28;


  const positions =
    getCharacterScreenPositions();


  // Priyanka's shot is visible and can hit
  // anything that has crossed behind Debashis.
  hearts.push({

    owner:
      "priyanka",

    x:
      positions.priyanka +
      34,

    y:
      groundY() -
      player.y -
      82,

    vx:
      CONFIG.heartSpeed,

    life:
      1.5
  });


  // Debashis mirrors Priyanka.
  // This is the main protective shot.
  hearts.push({

    owner:
      "debashis",

    x:
      positions.debashis +
      34,

    y:
      groundY() -
      debashis.y -
      82,

    vx:
      CONFIG.heartSpeed,

    life:
      1.5
  });


  gameAudio.play(
    "heart",
    0.72
  );


  spawnSparkles(
    positions.debashis +
    34,
    groundY() -
    82,
    "#ff72b1",
    10
  );
}


// ============================================================
// PLAYER DAMAGE
// ============================================================

function hurtPriyanka(
  damage
) {

  if (
    player.invulnerable >
    0
  ) {

    return;
  }


  player.health =
    Math.max(
      0,
      player.health -
      damage
    );


  player.invulnerable =
    0.9;


  relationshipDistance =
    clamp(
      relationshipDistance +
      CONFIG
        .priyankaHitPenalty,
      CONFIG.minimumDistance,
      CONFIG.maximumDistance
    );


  gameAudio.play(
    "playerHit",
    0.76
  );


  showMessage(
    "Priyanka was hurt — Debashis moved farther away",
    1.6
  );


  updateHud();


  if (
    player.health <=
    0
  ) {

    triggerGameOver();
  }
}


function hurtDebashis() {

  debashis.hearts =
    Math.max(
      0,
      debashis.hearts -
      1
    );


  relationshipDistance =
    clamp(
      relationshipDistance +
      CONFIG
        .debashisHitPenalty,
      CONFIG.minimumDistance,
      CONFIG.maximumDistance
    );


  gameAudio.play(
    "debashisHit",
    0.75
  );


  showMessage(
    "Protect Debashis!",
    1.2
  );


  updateHud();


  if (
    debashis.hearts <=
    0
  ) {

    triggerGameOver();
  }
}


// ============================================================
// ENEMY SPAWNING
// ============================================================

function pickEnemyType() {

  const progress =
    clamp(
      (
        CONFIG.startDistance -
        relationshipDistance
      ) /
      (
        CONFIG.startDistance -
        CONFIG.reunionDistance
      ),
      0,
      1
    );


  const roll =
    Math.random();


  if (
    progress >
      0.70 &&
    roll <
      0.13
  ) {

    return "guardian";
  }


  if (
    progress >
      0.40 &&
    roll <
      0.37
  ) {

    return "thorn";
  }


  if (
    roll <
      0.36
  ) {

    return "runner";
  }


  return "shadow";
}


function spawnEnemy() {

  if (
    mode !==
      MODE.CHASE &&
    mode !==
      MODE.TOGETHER
  ) {

    return;
  }


  if (
    enemies.length >=
    CONFIG.maxActiveEnemies
  ) {

    return;
  }


  const type =
    pickEnemyType();


  const definition =
    ENEMY_TYPES[
      type
    ];


  enemies.push({

    type,

    relX:
      W *
      0.40 +
      randomRange(
        40,
        160
      ),

    hp:
      definition.hp,

    speed:
      definition.speed,

    reward:
      definition.reward,

    radius:
      definition.radius,

    color:
      definition.color,

    attackTimer:
      randomRange(
        0.75,
        1.7
      ),

    attacked:
      false,

    bob:
      Math.random() *
      Math.PI *
      2
  });
}


// ============================================================
// HAZARD SPAWNING
//
// These require jump/dodge because Debashis reaches them
// first and mirrors Priyanka.
// ============================================================

function spawnHazard() {

  if (
    mode !==
      MODE.CHASE
  ) {

    return;
  }


  hazards.push({

    type:
      Math.random() >
      0.5
        ? "thorn"
        : "lowBranch",

    relX:
      W *
      0.48 +
      80,

    speed:
      randomRange(
        100,
        135
      ),

    resolved:
      false
  });
}


// ============================================================
// ENEMY DEFEATED
// ============================================================

function defeatEnemy(
  index
) {

  const enemy =
    enemies[index];


  relationshipDistance =
    clamp(
      relationshipDistance -
      enemy.reward,
      CONFIG.minimumDistance,
      CONFIG.maximumDistance
    );


  const positions =
    getCharacterScreenPositions();


  spawnSparkles(
    positions.debashis +
    enemy.relX,
    groundY() -
    55,
    "#ffd08c",
    17
  );


  enemies.splice(
    index,
    1
  );


  gameAudio.play(
    "enemyDefeat",
    0.60
  );


  showMessage(
    "♥ Closer",
    0.75
  );


  updateHud();


  if (
    mode ===
      MODE.CHASE &&
    relationshipDistance <=
      CONFIG.reunionDistance
  ) {

    beginReunion();
  }
}


// ============================================================
// INCOMING ATTACKS AIMED AT PRIYANKA
// ============================================================

function spawnIncomingAttack(
  enemy
) {

  incomingAttacks.push({

    life:
      CONFIG
        .enemyAttackTravelTime,

    duration:
      CONFIG
        .enemyAttackTravelTime,

    sourceOffset:
      enemy.relX,

    checked:
      false
  });


  showMessage(
    "Dodge!",
    0.65
  );
}


// ============================================================
// PARTICLES
// ============================================================

function spawnSparkles(
  x,
  y,
  color,
  count
) {

  for (
    let i = 0;
    i < count;
    i++
  ) {

    particles.push({

      x,

      y,

      vx:
        randomRange(
          -90,
          90
        ),

      vy:
        randomRange(
          -120,
          30
        ),

      life:
        randomRange(
          0.35,
          0.8
        ),

      maxLife:
        0.8,

      size:
        randomRange(
          2,
          5
        ),

      color
    });
  }
}


// ============================================================
// OPENING STORY
// ============================================================

function startStory() {

  startOverlay
    .classList
    .add(
      "hidden"
    );


  mode =
    MODE.MEETING;


  meeting.priyankaX =
    W *
    0.36;


  meeting.debashisX =
    W *
    0.80;


  meeting.targetDebashisX =
    W *
    0.56;


  meeting.phaseTime =
    0;


  player.state =
    "idle";


  debashis.state =
    "walkL";


  gameAudio.start();

  gameAudio.play(
    "ui",
    0.5
  );
}


function startDialogue() {

  mode =
    MODE.DIALOGUE;


  dialogueBox
    .classList
    .remove(
      "hidden"
    );


  dialogueIndex =
    -1;


  nextDialogue();
}


function nextDialogue() {

  dialogueIndex++;


  if (
    dialogueIndex >=
    dialogueSequence.length
  ) {

    dialogueBox
      .classList
      .add(
        "hidden"
      );


    mode =
      MODE.RUNAWAY;


    meeting.phaseTime =
      0;


    player.state =
      "runL";


    debashis.state =
      "idle";


    return;
  }


  const item =
    dialogueSequence[
      dialogueIndex
    ];


  dialogueSpeaker
    .textContent =
    item.speaker;


  dialogueText
    .textContent =
    item.text;


  dialogueTimer =
    item.duration;


  gameAudio.play(
    item.sound,
    0.62
  );
}


function beginChase() {

  mode =
    MODE.CHASE;


  relationshipDistance =
    CONFIG.startDistance;


  player.worldX =
    0;


  worldScroll =
    0;


  player.state =
    "idle";


  debashis.state =
    "idle";


  hud
    .classList
    .remove(
      "hidden"
    );


  mobileControls
    .classList
    .remove(
      "hidden"
    );


  enemySpawnTimer =
    0.65;


  hazardSpawnTimer =
    4.0;


  updateHud();


  showMessage(
    "Enemies are coming — protect Debashis ♥",
    2.2
  );
}


// ============================================================
// GAME OVER / RESET
// ============================================================

function triggerGameOver() {

  mode =
    MODE.GAME_OVER;


  mobileControls
    .classList
    .add(
      "hidden"
    );


  gameOverOverlay
    .classList
    .remove(
      "hidden"
    );
}


function restartGameplay() {

  enemies.length =
    0;

  hearts.length =
    0;

  incomingAttacks.length =
    0;

  hazards.length =
    0;

  particles.length =
    0;


  player.health =
    CONFIG.priyankaMaxHealth;


  player.y =
    0;

  player.vy =
    0;

  player.grounded =
    true;

  player.invulnerable =
    0;


  debashis.hearts =
    CONFIG.debashisMaxHearts;

  debashis.y =
    0;

  debashis.vy =
    0;

  debashis.grounded =
    true;


  relationshipDistance =
    CONFIG.startDistance;


  gameOverOverlay
    .classList
    .add(
      "hidden"
    );


  beginChase();
}


// ============================================================
// REUNION / ANNIVERSARY
// ============================================================

function beginReunion() {

  if (
    mode !==
    MODE.CHASE
  ) {

    return;
  }


  mode =
    MODE.CELEBRATION;


  enemies.length =
    0;

  incomingAttacks.length =
    0;

  hazards.length =
    0;


  mobileControls
    .classList
    .add(
      "hidden"
    );


  gameHint
    .textContent =
    "Together ♥";


  celebrationTime =
    0;


  gameAudio.play(
    "celebration",
    0.78
  );


  for (
    let i = 0;
    i < 70;
    i++
  ) {

    particles.push({

      x:
        randomRange(
          0,
          W
        ),

      y:
        randomRange(
          H *
          0.06,
          H *
          0.55
        ),

      vx:
        randomRange(
          -55,
          55
        ),

      vy:
        randomRange(
          -45,
          45
        ),

      life:
        randomRange(
          1.2,
          3.0
        ),

      maxLife:
        3,

      size:
        randomRange(
          2,
          7
        ),

      color:
        Math.random() >
        0.5
          ? "#ffd574"
          : "#ff7eb4"
    });
  }


  setTimeout(
    () => {

      if (
        mode ===
        MODE.CELEBRATION
      ) {

        celebrationOverlay
          .classList
          .remove(
            "hidden"
          );
      }
    },
    1100
  );
}


function continueTogether() {

  celebrationOverlay
    .classList
    .add(
      "hidden"
    );


  mode =
    MODE.TOGETHER;


  relationshipDistance =
    CONFIG.minimumDistance;


  player.health =
    CONFIG.priyankaMaxHealth;


  debashis.hearts =
    CONFIG.debashisMaxHearts;


  hud
    .classList
    .remove(
      "hidden"
    );


  mobileControls
    .classList
    .remove(
      "hidden"
    );


  gameHint
    .textContent =
    "Together Forever ♥";


  enemySpawnTimer =
    1.3;


  showMessage(
    "Now they face the journey together ♥",
    2.4
  );


  updateHud();
}


function closeStory() {

  fadeScreen
    .classList
    .add(
      "on"
    );


  setTimeout(
    () => {

      celebrationOverlay
        .classList
        .add(
          "hidden"
        );


      closedOverlay
        .classList
        .remove(
          "hidden"
        );


      fadeScreen
        .classList
        .remove(
          "on"
        );


      mode =
        MODE.CLOSED;


      gameAudio.music.pause();


      // Browsers usually block window.close()
      // unless the window was opened by script.
      try {

        window.close();

      }
      catch (
        error
      ) {

        // Fallback screen stays visible.
      }

    },
    1500
  );
}


// ============================================================
// PHYSICS
// ============================================================

function updateVertical(
  character,
  dt
) {

  if (
    !character.grounded
  ) {

    character.vy -=
      CONFIG.gravity *
      dt;


    character.y +=
      character.vy *
      dt;


    if (
      character.y <=
      0
    ) {

      character.y =
        0;


      character.vy =
        0;


      character.grounded =
        true;
    }
  }
}


// ============================================================
// UPDATE GAMEPLAY
// ============================================================

function updateGameplay(
  dt
) {

  let movement =
    0;


  if (
    keys.left
  ) {

    movement--;
  }


  if (
    keys.right
  ) {

    movement++;
  }


  const speed =
    keys.run
      ? CONFIG.runSpeed
      : CONFIG.walkSpeed;


  if (
    movement !==
    0
  ) {

    const facing =
      movement >
      0
        ? 1
        : -1;


    player.facing =
      facing;


    debashis.facing =
      facing;


    player.worldX =
      Math.max(
        0,
        player.worldX +
        movement *
        speed *
        dt
      );


    worldScroll =
      Math.max(
        0,
        worldScroll +
        movement *
        speed *
        dt
      );


    if (
      player.grounded &&
      player.attacking <=
        0 &&
      player.dodging <=
        0
    ) {

      setMirroredState(
        keys.run
          ? (
              facing >
              0
                ? "runR"
                : "runL"
            )
          : (
              facing >
              0
                ? "walkR"
                : "walkL"
            )
      );
    }
  }
  else if (
    player.grounded &&
    player.attacking <=
      0 &&
    player.dodging <=
      0
  ) {

    setMirroredState(
      "idle"
    );
  }


  if (
    !player.grounded &&
    player.dodging <=
      0
  ) {

    setMirroredState(
      "jump"
    );
  }


  if (
    player.dodging >
    0
  ) {

    setMirroredState(
      "dodge"
    );
  }


  if (
    player.attacking >
    0
  ) {

    setMirroredState(
      "attack"
    );
  }


  player.attackCooldown =
    Math.max(
      0,
      player.attackCooldown -
      dt
    );


  player.attacking =
    Math.max(
      0,
      player.attacking -
      dt
    );


  debashis.attacking =
    Math.max(
      0,
      debashis.attacking -
      dt
    );


  player.dodging =
    Math.max(
      0,
      player.dodging -
      dt
    );


  debashis.dodging =
    Math.max(
      0,
      debashis.dodging -
      dt
    );


  player.invulnerable =
    Math.max(
      0,
      player.invulnerable -
      dt
    );


  updateVertical(
    player,
    dt
  );


  updateVertical(
    debashis,
    dt
  );


  player.animTime +=
    dt;


  debashis.animTime +=
    dt;


  maintainChunks();


  updateEnemies(
    dt
  );


  updateHearts(
    dt
  );


  updateIncomingAttacks(
    dt
  );


  updateHazards(
    dt
  );


  updateParticles(
    dt
  );


  enemySpawnTimer -=
    dt;


  if (
    enemySpawnTimer <=
    0
  ) {

    spawnEnemy();


    const progress =
      clamp(
        (
          CONFIG.startDistance -
          relationshipDistance
        ) /
        (
          CONFIG.startDistance -
          CONFIG.reunionDistance
        ),
        0,
        1
      );


    const difficultyFactor =
      lerp(
        1,
        0.73,
        progress
      );


    enemySpawnTimer =
      randomRange(
        CONFIG.enemySpawnMin,
        CONFIG.enemySpawnMax
      ) *
      difficultyFactor;
  }


  if (
    mode ===
    MODE.CHASE
  ) {

    hazardSpawnTimer -=
      dt;


    if (
      hazardSpawnTimer <=
      0
    ) {

      spawnHazard();


      hazardSpawnTimer =
        randomRange(
          4.4,
          7.2
        );
    }
  }
}


// ============================================================
// ENEMY UPDATE
// ============================================================

function updateEnemies(
  dt
) {

  for (
    let i =
      enemies.length -
      1;
    i >=
      0;
    i--
  ) {

    const enemy =
      enemies[i];


    enemy.relX -=
      enemy.speed *
      dt;


    enemy.attackTimer -=
      dt;


    if (
      !enemy.attacked &&
      enemy.attackTimer <=
        0 &&
      enemy.relX <
        W *
        0.31 &&
      Math.random() <
        CONFIG.enemyAttackChance
    ) {

      enemy.attacked =
        true;


      spawnIncomingAttack(
        enemy
      );
    }


    // Enemy reached Debashis
    if (
      enemy.relX <=
      4
    ) {

      enemies.splice(
        i,
        1
      );


      hurtDebashis();
    }
  }
}


// ============================================================
// HEART PROJECTILES
// ============================================================

function updateHearts(
  dt
) {

  const positions =
    getCharacterScreenPositions();


  for (
    let i =
      hearts.length -
      1;
    i >=
      0;
    i--
  ) {

    const heart =
      hearts[i];


    heart.x +=
      heart.vx *
      dt;


    heart.life -=
      dt;


    let hit =
      false;


    for (
      let e =
        enemies.length -
        1;
      e >=
        0;
      e--
    ) {

      const enemy =
        enemies[e];


      const ex =
        positions.debashis +
        enemy.relX;


      const ey =
        groundY() -
        53;


      if (
        Math.abs(
          heart.x -
          ex
        ) <
          enemy.radius +
          15 &&
        Math.abs(
          heart.y -
          ey
        ) <
          45
      ) {

        enemy.hp--;


        spawnSparkles(
          ex,
          ey,
          "#ff86b6",
          8
        );


        hearts.splice(
          i,
          1
        );


        hit =
          true;


        if (
          enemy.hp <=
          0
        ) {

          defeatEnemy(
            e
          );
        }


        break;
      }
    }


    if (
      !hit &&
      heart.life <=
      0
    ) {

      hearts.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// ENEMY ATTACKS AGAINST PRIYANKA
// ============================================================

function updateIncomingAttacks(
  dt
) {

  for (
    let i =
      incomingAttacks.length -
      1;
    i >=
      0;
    i--
  ) {

    const attack =
      incomingAttacks[i];


    attack.life -=
      dt;


    if (
      attack.life <=
        0 &&
      !attack.checked
    ) {

      attack.checked =
        true;


      const avoided =
        player.dodging >
          0 ||
        !player.grounded;


      if (
        !avoided
      ) {

        hurtPriyanka(
          14
        );
      }
      else {

        showMessage(
          "Nice dodge ♥",
          0.7
        );
      }


      incomingAttacks.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// JUMP / DODGE HAZARDS AT DEBASHIS
// ============================================================

function updateHazards(
  dt
) {

  for (
    let i =
      hazards.length -
      1;
    i >=
      0;
    i--
  ) {

    const hazard =
      hazards[i];


    hazard.relX -=
      hazard.speed *
      dt;


    if (
      hazard.relX <
        90 &&
      !hazard.warning
    ) {

      hazard.warning =
        true;


      showMessage(
        hazard.type ===
          "thorn"
          ? "Jump!"
          : "Dodge!",
        0.75
      );
    }


    if (
      hazard.relX <=
        0
    ) {

      let safe =
        false;


      if (
        hazard.type ===
        "thorn"
      ) {

        safe =
          !debashis.grounded;
      }
      else {

        safe =
          debashis.dodging >
          0;
      }


      if (
        !safe
      ) {

        hurtDebashis();
      }
      else {

        showMessage(
          "Saved ♥",
          0.65
        );
      }


      hazards.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// PARTICLES
// ============================================================

function updateParticles(
  dt
) {

  for (
    let i =
      particles.length -
      1;
    i >=
      0;
    i--
  ) {

    const p =
      particles[i];


    p.x +=
      p.vx *
      dt;


    p.y +=
      p.vy *
      dt;


    p.vy +=
      45 *
      dt;


    p.life -=
      dt;


    if (
      p.life <=
      0
    ) {

      particles.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// MEETING / DIALOGUE / RUNAWAY UPDATE
// ============================================================

function updateStory(
  dt
) {

  player.animTime +=
    dt;


  debashis.animTime +=
    dt;


  if (
    mode ===
    MODE.MEETING
  ) {

    meeting.phaseTime +=
      dt;


    meeting.debashisX -=
      92 *
      dt;


    if (
      meeting.debashisX <=
      meeting.targetDebashisX
    ) {

      meeting.debashisX =
        meeting.targetDebashisX;


      debashis.state =
        "idle";


      startDialogue();
    }
  }


  else if (
    mode ===
    MODE.DIALOGUE
  ) {

    dialogueTimer -=
      dt;


    if (
      dialogueTimer <=
      0
    ) {

      nextDialogue();
    }
  }


  else if (
    mode ===
    MODE.RUNAWAY
  ) {

    meeting.phaseTime +=
      dt;


    worldScroll =
      Math.max(
        0,
        worldScroll -
        20 *
        dt
      );


    // Move Priyanka left on screen during cinematic.
    meeting.priyankaX -=
      185 *
      dt;


    // As the camera follows her, keep her from disappearing.
    if (
      meeting.priyankaX <
      W *
      0.20
    ) {

      meeting.priyankaX =
        W *
        0.20;
    }


    if (
      meeting.phaseTime >
      3.1
    ) {

      beginChase();
    }
  }
}


// ============================================================
// MAIN UPDATE
// ============================================================

function update(
  dt
) {

  time +=
    dt;


  if (
    messageTimer >
    0
  ) {

    messageTimer -=
      dt;


    if (
      messageTimer <=
      0
    ) {

      hideMessage();
    }
  }


  if (
    mode ===
      MODE.MEETING ||
    mode ===
      MODE.DIALOGUE ||
    mode ===
      MODE.RUNAWAY
  ) {

    updateStory(
      dt
    );
  }


  else if (
    mode ===
      MODE.CHASE ||
    mode ===
      MODE.TOGETHER
  ) {

    updateGameplay(
      dt
    );
  }


  else if (
    mode ===
    MODE.CELEBRATION
  ) {

    celebrationTime +=
      dt;


    updateParticles(
      dt
    );


    player.state =
      "idle";


    debashis.state =
      "idle";


    player.animTime +=
      dt;


    debashis.animTime +=
      dt;
  }
}


// ============================================================
// DRAW ENVIRONMENT
// ============================================================

function drawCrop(
  crop,
  dx,
  dy,
  dw,
  dh
) {

  if (
    !environmentAtlas.complete
  ) {

    return;
  }


  ctx.drawImage(
    environmentAtlas,

    crop.x,
    crop.y,
    crop.w,
    crop.h,

    dx,
    dy,
    dw,
    dh
  );
}


function drawRepeatedStrip(
  crop,
  y,
  height,
  parallax
) {

  if (
    !environmentAtlas.complete
  ) {

    return;
  }


  const width =
    crop.w *
    (
      height /
      crop.h
    );


  const offset =
    -(
      worldScroll *
      parallax
    ) %
    width;


  for (
    let x =
      offset -
      width;
    x <
      W +
      width;
    x +=
      width
  ) {

    drawCrop(
      crop,
      x,
      y,
      width,
      height
    );
  }
}


function drawEnvironment() {

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );


  gradient.addColorStop(
    0,
    "#26103c"
  );


  gradient.addColorStop(
    0.45,
    "#754268"
  );


  gradient.addColorStop(
    0.78,
    "#d78092"
  );


  gradient.addColorStop(
    1,
    "#f3c39f"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  drawRepeatedStrip(
    ENV.sky,
    0,
    H *
      0.22,
    0.06
  );


  drawRepeatedStrip(
    ENV.mid,
    H *
      0.19,
    H *
      0.23,
    0.12
  );


  drawRepeatedStrip(
    ENV.forest,
    H *
      0.38,
    H *
      0.25,
    0.26
  );


  drawRepeatedStrip(
    ENV.front,
    H *
      0.61,
    H *
      0.12,
    0.48
  );


  drawWorldDecorations();


  // Ground
  ctx.fillStyle =
    "#2c6847";


  ctx.fillRect(
    0,
    groundY(),
    W,
    H -
    groundY()
  );


  if (
    environmentAtlas.complete
  ) {

    const tileW =
      145;


    for (
      let x =
        -(
          worldScroll %
          tileW
        );
      x <
        W +
        tileW;
      x +=
        tileW
    ) {

      drawCrop(
        ENV.grass,
        x,
        groundY() -
        16,
        tileW,
        50
      );
    }
  }
}


// ============================================================
// PROCEDURAL DECORATIONS
// ============================================================

function drawWorldDecorations() {

  if (
    !environmentAtlas.complete
  ) {

    return;
  }


  for (
    const chunk
    of chunks.values()
  ) {

    for (
      const object
      of chunk.objects
    ) {

      const sx =
        object.x -
        worldScroll;


      if (
        sx <
          -220 ||
        sx >
          W +
          220
      ) {

        continue;
      }


      const crop =
        ENV[
          object.type
        ];


      if (
        !crop
      ) {

        continue;
      }


      let baseW =
        120;


      let baseH =
        110;


      if (
        object.type ===
        "pinkTree"
      ) {

        baseW =
          155;

        baseH =
          135;
      }


      if (
        object.type ===
          "fountain" ||
        object.type ===
          "bridge"
      ) {

        baseW =
          150;

        baseH =
          105;
      }


      const w =
        baseW *
        object.scale;


      const h =
        baseH *
        object.scale;


      drawCrop(
        crop,
        sx -
        w /
        2,
        groundY() -
        h +
        2,
        w,
        h
      );
    }
  }
}


// ============================================================
// DRAW CHARACTER SPRITE
// ============================================================

function drawCharacter(
  image,
  animations,
  cell,
  state,
  animTime,
  x,
  y,
  facing,
  scale = 1
) {

  if (
    !image.complete
  ) {

    return;
  }


  const anim =
    animations[
      state
    ] ||
    animations.idle;


  const frame =
    Math.floor(
      animTime *
      anim.fps
    ) %
    anim.frames;


  const sx =
    frame *
    cell.width;


  const sy =
    anim.row *
    cell.height;


  const h =
    166 *
    scale;


  const w =
    148 *
    scale;


  ctx.save();


  ctx.translate(
    x,
    y
  );


  // Rows already include left/right for walking/running.
  // For jump/dodge/attack use facing flip.
  if (
    (
      state ===
        "jump" ||
      state ===
        "dodge" ||
      state ===
        "attack"
    ) &&
    facing <
      0
  ) {

    ctx.scale(
      -1,
      1
    );
  }


  ctx.drawImage(
    image,

    sx,
    sy,
    cell.width,
    cell.height,

    -w /
      2,
    -h +
      9,
    w,
    h
  );


  ctx.restore();
}


// ============================================================
// DRAW OPENING STORY
// ============================================================

function drawOpeningCharacters() {

  const base =
    groundY();


  const px =
    meeting.priyankaX ||
    W *
      0.36;


  const dx =
    meeting.debashisX ||
    W *
      0.78;


  drawCharacter(
    priyankaAtlas,
    PRIYANKA_ANIMS,
    PRIYANKA_CELL,
    player.state,
    player.animTime,
    px,
    base,
    player.facing,
    1.05
  );


  drawCharacter(
    debashisAtlas,
    DEBASHIS_ANIMS,
    DEBASHIS_CELL,
    debashis.state,
    debashis.animTime,
    dx,
    base,
    debashis.facing,
    1.03
  );
}


// ============================================================
// DRAW GAMEPLAY CHARACTERS
// ============================================================

function drawGameplayCharacters() {

  const positions =
    getCharacterScreenPositions();


  drawCharacter(
    priyankaAtlas,
    PRIYANKA_ANIMS,
    PRIYANKA_CELL,
    player.state,
    player.animTime,
    positions.priyanka,
    groundY() -
    player.y,
    player.facing,
    1
  );


  drawCharacter(
    debashisAtlas,
    DEBASHIS_ANIMS,
    DEBASHIS_CELL,
    debashis.state,
    debashis.animTime,
    positions.debashis,
    groundY() -
    debashis.y,
    debashis.facing,
    0.98
  );
}


// ============================================================
// DRAW ENEMIES
// ============================================================

function drawEnemies() {

  const positions =
    getCharacterScreenPositions();


  for (
    const enemy
    of enemies
  ) {

    const x =
      positions.debashis +
      enemy.relX;


    const y =
      groundY() -
      48 +
      Math.sin(
        time *
        4 +
        enemy.bob
      ) *
      5;


    ctx.save();


    ctx.shadowColor =
      enemy.color;


    ctx.shadowBlur =
      18;


    ctx.fillStyle =
      enemy.color;


    ctx.beginPath();


    ctx.ellipse(
      x,
      y,
      enemy.radius,
      enemy.radius *
      1.18,
      0,
      0,
      Math.PI *
      2
    );


    ctx.fill();


    ctx.shadowBlur =
      0;


    ctx.fillStyle =
      "#ff8dba";


    ctx.beginPath();

    ctx.arc(
      x -
      8,
      y -
      7,
      3.5,
      0,
      Math.PI *
      2
    );

    ctx.arc(
      x +
      8,
      y -
      7,
      3.5,
      0,
      Math.PI *
      2
    );

    ctx.fill();


    // HP indicators for stronger enemies
    if (
      enemy.hp >
      1
    ) {

      ctx.fillStyle =
        "rgba(20,4,15,.55)";


      ctx.fillRect(
        x -
        22,
        y -
        48,
        44,
        5
      );


      ctx.fillStyle =
        "#ff82ac";


      ctx.fillRect(
        x -
        22,
        y -
        48,
        44 *
        clamp(
          enemy.hp /
          ENEMY_TYPES[
            enemy.type
          ].hp,
          0,
          1
        ),
        5
      );
    }


    ctx.restore();
  }
}


// ============================================================
// DRAW HEART PROJECTILES
// ============================================================

function drawHeartShape(
  x,
  y,
  size,
  color
) {

  ctx.save();


  ctx.translate(
    x,
    y
  );


  ctx.scale(
    size /
    32,
    size /
    32
  );


  ctx.beginPath();

  ctx.moveTo(
    0,
    8
  );

  ctx.bezierCurveTo(
    -20,
    -10,
    -38,
    8,
    -27,
    27
  );

  ctx.bezierCurveTo(
    -19,
    41,
    -7,
    49,
    0,
    56
  );

  ctx.bezierCurveTo(
    7,
    49,
    19,
    41,
    27,
    27
  );

  ctx.bezierCurveTo(
    38,
    8,
    20,
    -10,
    0,
    8
  );

  ctx.closePath();


  ctx.fillStyle =
    color;


  ctx.fill();


  ctx.restore();
}


function drawHearts() {

  for (
    const heart
    of hearts
  ) {

    ctx.save();


    ctx.shadowColor =
      "#ff5fa9";


    ctx.shadowBlur =
      20;


    drawHeartShape(
      heart.x,
      heart.y,
      18,
      "#ff5fa9"
    );


    ctx.shadowBlur =
      0;


    drawHeartShape(
      heart.x,
      heart.y,
      9,
      "#fff2f8"
    );


    ctx.restore();
  }
}


// ============================================================
// DRAW INCOMING ATTACKS
// ============================================================

function drawIncomingAttacks() {

  const positions =
    getCharacterScreenPositions();


  for (
    const attack
    of incomingAttacks
  ) {

    const t =
      1 -
      attack.life /
      attack.duration;


    const startX =
      positions.debashis +
      attack.sourceOffset;


    const endX =
      positions.priyanka;


    const x =
      lerp(
        startX,
        endX,
        t
      );


    const y =
      groundY() -
      86 -
      Math.sin(
        t *
        Math.PI
      ) *
      90;


    ctx.save();


    ctx.shadowColor =
      "#822e9c";


    ctx.shadowBlur =
      20;


    ctx.fillStyle =
      "#742a91";


    ctx.beginPath();

    ctx.arc(
      x,
      y,
      10,
      0,
      Math.PI *
      2
    );

    ctx.fill();


    ctx.restore();
  }
}


// ============================================================
// DRAW HAZARDS
// ============================================================

function drawHazards() {

  const positions =
    getCharacterScreenPositions();


  for (
    const hazard
    of hazards
  ) {

    const x =
      positions.debashis +
      hazard.relX;


    if (
      hazard.type ===
      "thorn"
    ) {

      ctx.fillStyle =
        "#426b35";


      ctx.beginPath();

      ctx.moveTo(
        x -
        24,
        groundY()
      );

      ctx.lineTo(
        x -
        12,
        groundY() -
        42
      );

      ctx.lineTo(
        x,
        groundY()
      );

      ctx.lineTo(
        x +
        13,
        groundY() -
        48
      );

      ctx.lineTo(
        x +
        25,
        groundY()
      );

      ctx.closePath();

      ctx.fill();
    }
    else {

      ctx.strokeStyle =
        "#70401f";


      ctx.lineWidth =
        14;


      ctx.lineCap =
        "round";


      ctx.beginPath();

      ctx.moveTo(
        x -
        35,
        groundY() -
        115
      );

      ctx.lineTo(
        x +
        35,
        groundY() -
        115
      );

      ctx.stroke();
    }
  }
}


// ============================================================
// DRAW PARTICLES / CELEBRATION
// ============================================================

function drawParticles() {

  for (
    const p
    of particles
  ) {

    ctx.globalAlpha =
      clamp(
        p.life /
        p.maxLife,
        0,
        1
      );


    ctx.fillStyle =
      p.color;


    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI *
      2
    );

    ctx.fill();
  }


  ctx.globalAlpha =
    1;
}


function drawCelebrationSky() {

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H *
      0.7
    );


  gradient.addColorStop(
    0,
    "rgba(76,25,104,.22)"
  );


  gradient.addColorStop(
    1,
    "rgba(255,145,181,.08)"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    W,
    H *
      0.72
  );


  ctx.textAlign =
    "center";


  ctx.shadowColor =
    "#ffd391";


  ctx.shadowBlur =
    24;


  ctx.fillStyle =
    "#fff1c2";


  ctx.font =
    `italic ${Math.max(
      30,
      Math.min(
        58,
        W *
        0.06
      )
    )}px Georgia`;


  ctx.fillText(
    "Happy Halfway Anniversary",
    W /
    2,
    H *
    0.20
  );


  ctx.shadowBlur =
    12;


  ctx.fillStyle =
    "#ffd8e3";


  ctx.font =
    `italic ${Math.max(
      22,
      Math.min(
        38,
        W *
        0.04
      )
    )}px Georgia`;


  ctx.fillText(
    "Priyanka ♥ Debashis",
    W /
    2,
    H *
    0.27
  );


  ctx.shadowBlur =
    0;
}


// ============================================================
// RENDER
// ============================================================

function render() {

  ctx.clearRect(
    0,
    0,
    W,
    H
  );


  drawEnvironment();


  if (
    mode ===
      MODE.WAIT
  ) {

    // Show both characters even before tap.
    meeting.priyankaX =
      W *
      0.36;


    meeting.debashisX =
      W *
      0.78;


    player.state =
      "idle";


    debashis.state =
      "idle";


    drawOpeningCharacters();
  }


  else if (
    mode ===
      MODE.MEETING ||
    mode ===
      MODE.DIALOGUE ||
    mode ===
      MODE.RUNAWAY
  ) {

    drawOpeningCharacters();
  }


  else if (
    mode ===
      MODE.CHASE ||
    mode ===
      MODE.TOGETHER ||
    mode ===
      MODE.GAME_OVER
  ) {

    drawHazards();

    drawEnemies();

    drawIncomingAttacks();

    drawGameplayCharacters();

    drawHearts();

    drawParticles();
  }


  else if (
    mode ===
    MODE.CELEBRATION
  ) {

    drawGameplayCharacters();

    drawParticles();

    drawCelebrationSky();
  }
}


// ============================================================
// INPUT
// ============================================================

function bindHold(
  id,
  property
) {

  const button =
    document.getElementById(
      id
    );


  const press =
    event => {

      event.preventDefault();


      keys[
        property
      ] =
        true;


      button
        .classList
        .add(
          "active"
        );
    };


  const release =
    event => {

      event.preventDefault();


      keys[
        property
      ] =
        false;


      button
        .classList
        .remove(
          "active"
        );
    };


  button.addEventListener(
    "pointerdown",
    press
  );


  button.addEventListener(
    "pointerup",
    release
  );


  button.addEventListener(
    "pointercancel",
    release
  );


  button.addEventListener(
    "pointerleave",
    release
  );
}


bindHold(
  "leftButton",
  "left"
);


bindHold(
  "rightButton",
  "right"
);


bindHold(
  "runButton",
  "run"
);


document
  .getElementById(
    "jumpButton"
  )
  .addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      jump();
    }
  );


document
  .getElementById(
    "dodgeButton"
  )
  .addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      dodge();
    }
  );


document
  .getElementById(
    "attackButton"
  )
  .addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      fireHeart();
    }
  );


window.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
        "ArrowLeft" ||
      event.key ===
        "a" ||
      event.key ===
        "A"
    ) {

      keys.left =
        true;
    }


    if (
      event.key ===
        "ArrowRight" ||
      event.key ===
        "d" ||
      event.key ===
        "D"
    ) {

      keys.right =
        true;
    }


    if (
      event.key ===
      "Shift"
    ) {

      keys.run =
        true;
    }


    if (
      (
        event.key ===
          "ArrowUp" ||
        event.key ===
          " " ||
        event.key ===
          "w" ||
        event.key ===
          "W"
      ) &&
      !event.repeat
    ) {

      event.preventDefault();

      jump();
    }


    if (
      (
        event.key ===
          "s" ||
        event.key ===
          "S"
      ) &&
      !event.repeat
    ) {

      dodge();
    }


    if (
      (
        event.key ===
          "j" ||
        event.key ===
          "J" ||
        event.key ===
          "f" ||
        event.key ===
          "F"
      ) &&
      !event.repeat
    ) {

      fireHeart();
    }
  }
);


window.addEventListener(
  "keyup",
  event => {

    if (
      event.key ===
        "ArrowLeft" ||
      event.key ===
        "a" ||
      event.key ===
        "A"
    ) {

      keys.left =
        false;
    }


    if (
      event.key ===
        "ArrowRight" ||
      event.key ===
        "d" ||
      event.key ===
        "D"
    ) {

      keys.right =
        false;
    }


    if (
      event.key ===
      "Shift"
    ) {

      keys.run =
        false;
    }
  }
);


// ============================================================
// DOM BUTTONS
// ============================================================

startButton.addEventListener(
  "click",
  () => {

    startStory();
  }
);


restartButton.addEventListener(
  "click",
  () => {

    gameAudio.play(
      "ui",
      0.55
    );

    restartGameplay();
  }
);


continueButton.addEventListener(
  "click",
  () => {

    gameAudio.play(
      "ui",
      0.55
    );

    continueTogether();
  }
);


closeButton.addEventListener(
  "click",
  () => {

    gameAudio.play(
      "ui",
      0.48
    );

    closeStory();
  }
);


soundButton.addEventListener(
  "click",
  () => {

    const enabled =
      gameAudio.toggle();


    soundButton
      .textContent =
      enabled
        ? "♪"
        : "×";
  }
);


// ============================================================
// MAIN LOOP
// ============================================================

let previous =
  performance.now();


function loop(
  now
) {

  const dt =
    Math.min(
      0.033,
      (
        now -
        previous
      ) /
      1000
    );


  previous =
    now;


  update(
    dt
  );


  render();


  requestAnimationFrame(
    loop
  );
}


maintainChunks();


requestAnimationFrame(
  loop
);

})();
