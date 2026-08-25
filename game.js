(() => {

"use strict";

/*
=================================================================
PRIYANKA ♥ DEBASHIS
STORY GAME V6
=================================================================

CHANGES IN THIS VERSION

- Opening characters are locked facing each other.
- Opening dialogue appears above the person speaking.
- Idle rotation is disabled during conversation.
- Dodge has been completely removed.
- Camera is more zoomed out.
- Priyanka is farther left, Debashis farther ahead.
- Background no longer stacks repeated scenic strips vertically.
- Enemies use the detailed enemy artwork already inside
  environment_atlas.png instead of simple circles/blobs.
- Enemy waves are moderately harder but include short breathing gaps.
- Jump is now the main defensive reaction against incoming attacks.
=================================================================
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


const speechBubble =
  document.getElementById(
    "speechBubble"
  );

const speechName =
  document.getElementById(
    "speechName"
  );

const speechText =
  document.getElementById(
    "speechText"
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
// STATES
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
// CONFIGURATION
// ============================================================

const CONFIG = {

  // Relationship distance.
  startDistance:
    1120,

  reunionDistance:
    78,

  minimumDistance:
    68,

  maximumDistance:
    1900,


  // Rewards.
  shadowReward:
    27,

  batReward:
    31,

  thornReward:
    42,

  knightReward:
    55,

  dragonReward:
    72,


  // Penalties.
  priyankaHitPenalty:
    68,

  debashisHitPenalty:
    42,


  // Health.
  priyankaMaxHealth:
    100,

  debashisMaxHearts:
    3,


  // Movement.
  walkSpeed:
    190,

  runSpeed:
    345,

  jumpPower:
    600,

  gravity:
    1580,


  // Combat.
  heartSpeed:
    620,

  heartCooldown:
    0.30,


  // Enemy director.
  maxActiveEnemies:
    4,

  waveMinEnemies:
    2,

  waveMaxEnemies:
    5,

  waveSpawnMin:
    0.58,

  waveSpawnMax:
    1.05,

  waveRestMin:
    1.35,

  waveRestMax:
    2.45,


  // Enemy ranged attacks.
  enemyAttackChance:
    0.42,

  enemyAttackTravelTime:
    1.15,


  // Procedural scenery.
  chunkWidth:
    940,

  chunksAhead:
    5,

  chunksBehind:
    2,


  // Visual scale.
  characterScale:
    0.82
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
    { row:0, frames:1, fps:1 },

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

  attack:
    { row:7, frames:3, fps:11 }
};


const DEBASHIS_ANIMS = {

  idle:
    { row:0, frames:1, fps:1 },

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
// ============================================================

const ENV = {

  // Only one far scenic strip plus one forest band are used.
  // This avoids the previous "scene repeated vertically" look.
  sky:
    {x:10, y:18, w:1028, h:95},

  forest:
    {x:10, y:252, w:1028, h:95},

  foreground:
    {x:10, y:373, w:1028, h:52},


  // Landmarks / decorations.
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


  // Better enemies from the environment atlas enemy row.
  // These are real illustrated sprites, not geometric blobs.
  enemyShadow:
    {x:18,  y:803, w:68,  h:72},

  enemyBat:
    {x:180, y:798, w:87,  h:73},

  enemyThorn:
    {x:308, y:779, w:92,  h:103},

  enemyKnight:
    {x:519, y:775, w:105, h:112},

  enemyDragon:
    {x:625, y:777, w:137, h:118}
};


// ============================================================
// CANVAS
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

  updateSpeechBubblePosition();
}


window.addEventListener(
  "resize",
  resize
);

resize();


// ============================================================
// HELPERS
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
    0.80
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
    CONFIG.priyankaMaxHealth,

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

  invulnerable:
    0
};


const debashis = {

  hearts:
    CONFIG.debashisMaxHearts,

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
    0
};


let relationshipDistance =
  CONFIG.startDistance;


let worldScroll =
  0;


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


const heartShots =
  [];


const incomingAttacks =
  [];


const groundHazards =
  [];


const particles =
  [];


const chunks =
  new Map();


// Enemy wave director.
let waveRemaining =
  0;

let waveSpawnTimer =
  0;

let waveRestTimer =
  0.8;


// ============================================================
// OPENING
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
      1.70,

    sound:
      "dialogueDebashis"
  },

  {
    speaker:
      "PRIYANKA",

    text:
      "YES",

    duration:
      1.35,

    sound:
      "dialoguePriyanka"
  },

  {
    speaker:
      "DEBASHIS",

    text:
      "Haat ta Dao",

    duration:
      1.80,

    sound:
      "dialogueDebashis"
  },

  {
    speaker:
      "PRIYANKA",

    text:
      "Yarki Hoche naki, haat dhorbe!",

    duration:
      2.75,

    sound:
      "dialoguePriyanka"
  }
];


let dialogueIndex =
  -1;


let dialogueTimer =
  0;


// ============================================================
// ENEMY DEFINITIONS
// ============================================================

const ENEMY_TYPES = {

  shadow: {

    crop:
      ENV.enemyShadow,

    hp:
      1,

    speed:
      98,

    reward:
      CONFIG.shadowReward,

    scale:
      0.72,

    flying:
      false,

    ranged:
      false
  },


  bat: {

    crop:
      ENV.enemyBat,

    hp:
      1,

    speed:
      128,

    reward:
      CONFIG.batReward,

    scale:
      0.78,

    flying:
      true,

    ranged:
      false
  },


  thorn: {

    crop:
      ENV.enemyThorn,

    hp:
      2,

    speed:
      82,

    reward:
      CONFIG.thornReward,

    scale:
      0.78,

    flying:
      false,

    ranged:
      false
  },


  knight: {

    crop:
      ENV.enemyKnight,

    hp:
      3,

    speed:
      69,

    reward:
      CONFIG.knightReward,

    scale:
      0.82,

    flying:
      false,

    ranged:
      true
  },


  dragon: {

    crop:
      ENV.enemyDragon,

    hp:
      4,

    speed:
      86,

    reward:
      CONFIG.dragonReward,

    scale:
      0.82,

    flying:
      true,

    ranged:
      true
  }
};


// ============================================================
// PROCEDURAL WORLD
// ============================================================

function seededRandom(
  seed
) {

  const x =
    Math.sin(
      seed *
      999.91
    ) *
    43758.5453;

  return (
    x -
    Math.floor(x)
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


  // Fewer objects than V5 so the world does not look copied.
  const count =
    2 +
    Math.floor(
      seededRandom(
        index +
        2
      ) *
      3
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
        120 +
        seededRandom(
          index *
          40 +
          i *
          5.9
        ) *
        (
          CONFIG.chunkWidth -
          240
        ),

      scale:
        0.54 +
        seededRandom(
          index *
          70 +
          i
        ) *
        0.48
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
      !chunks.has(i)
    ) {

      chunks.set(
        i,
        createChunk(i)
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

      chunks.delete(index);
    }
  }
}


// ============================================================
// HUD / MESSAGES
// ============================================================

function showMessage(
  text,
  duration = 1.4
) {

  gameMessage.textContent =
    text;

  gameMessage
    .classList
    .add("show");

  messageTimer =
    duration;
}


function hideMessage() {

  gameMessage
    .classList
    .remove("show");
}


function updateHud() {

  const hp =
    clamp(
      player.health /
      CONFIG.priyankaMaxHealth,
      0,
      1
    );


  healthElement.style.width =
    (
      hp *
      100
    ) +
    "%";


  const heartNodes =
    heartsElement
      .querySelectorAll("span");


  heartNodes.forEach(
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


  progressFill.style.width =
    (
      progress *
      100
    ) +
    "%";
}


// ============================================================
// CAMERA / CHARACTER SCREEN POSITIONS
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


  // More visual distance than V5.
  return lerp(
    W *
      0.12,
    W *
      0.49,
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
        0.59,

      debashis:
        W *
        0.42
    };
  }


  return {

    priyanka:
      W *
      0.15,

    debashis:
      W *
      0.15 +
      chaseSeparation()
  };
}


// ============================================================
// OPENING SPEECH BUBBLE
// ============================================================

function updateSpeechBubblePosition() {

  if (
    speechBubble
      .classList
      .contains("hidden")
  ) {
    return;
  }


  const item =
    dialogueSequence[
      dialogueIndex
    ];


  if (
    !item
  ) {
    return;
  }


  const isPriyanka =
    item.speaker ===
    "PRIYANKA";


  const x =
    isPriyanka
      ? meeting.priyankaX
      : meeting.debashisX;


  speechBubble.style.left =
    x +
    "px";


  speechBubble.style.top =
    (
      groundY() -
      152
    ) +
    "px";
}


// ============================================================
// ACTIONS
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
    mode !==
      MODE.CHASE &&
    mode !==
      MODE.TOGETHER
  ) {
    return;
  }


  if (
    !player.grounded
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


function fireHeart() {

  if (
    mode !==
      MODE.CHASE &&
    mode !==
      MODE.TOGETHER
  ) {
    return;
  }


  if (
    player.attackCooldown >
    0
  ) {
    return;
  }


  player.attackCooldown =
    CONFIG.heartCooldown;


  player.attacking =
    0.26;

  debashis.attacking =
    0.26;


  const positions =
    getCharacterScreenPositions();


  heartShots.push({

    owner:
      "priyanka",

    x:
      positions.priyanka +
      27,

    y:
      groundY() -
      player.y -
      68,

    vx:
      CONFIG.heartSpeed,

    life:
      1.45
  });


  heartShots.push({

    owner:
      "debashis",

    x:
      positions.debashis +
      27,

    y:
      groundY() -
      debashis.y -
      68,

    vx:
      CONFIG.heartSpeed,

    life:
      1.45
  });


  gameAudio.play(
    "heart",
    0.72
  );


  spawnSparkles(
    positions.debashis +
      27,
    groundY() -
      68,
    "#ff72b1",
    9
  );
}


// ============================================================
// DAMAGE
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
    0.86;


  relationshipDistance =
    clamp(
      relationshipDistance +
      CONFIG.priyankaHitPenalty,
      CONFIG.minimumDistance,
      CONFIG.maximumDistance
    );


  gameAudio.play(
    "playerHit",
    0.76
  );


  showMessage(
    "Priyanka was hurt — the distance increased",
    1.45
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
      CONFIG.debashisHitPenalty,
      CONFIG.minimumDistance,
      CONFIG.maximumDistance
    );


  gameAudio.play(
    "debashisHit",
    0.75
  );


  showMessage(
    "Debashis was hit!",
    1.15
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
// ENEMY DIRECTOR
// ============================================================

function currentProgress() {

  return clamp(
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
}


function chooseEnemyType() {

  const progress =
    currentProgress();


  const roll =
    Math.random();


  if (
    progress >
      0.68 &&
    roll <
      0.14
  ) {
    return "dragon";
  }


  if (
    progress >
      0.42 &&
    roll <
      0.35
  ) {
    return "knight";
  }


  if (
    progress >
      0.22 &&
    roll <
      0.56
  ) {
    return "thorn";
  }


  if (
    roll <
      0.38
  ) {
    return "bat";
  }


  return "shadow";
}


function startNewWave() {

  const progress =
    currentProgress();


  const extra =
    progress >
      0.72
      ? 1
      : 0;


  waveRemaining =
    Math.floor(
      randomRange(
        CONFIG.waveMinEnemies,
        CONFIG.waveMaxEnemies +
        1 +
        extra
      )
    );


  waveSpawnTimer =
    0.15;
}


function spawnEnemy() {

  if (
    mode !==
      MODE.CHASE &&
    mode !==
      MODE.TOGETHER
  ) {
    return false;
  }


  if (
    enemies.length >=
    CONFIG.maxActiveEnemies
  ) {
    return false;
  }


  const type =
    chooseEnemyType();


  const def =
    ENEMY_TYPES[
      type
    ];


  enemies.push({

    type,

    relX:
      W *
      0.36 +
      randomRange(
        90,
        190
      ),

    hp:
      def.hp,

    maxHp:
      def.hp,

    speed:
      def.speed,

    reward:
      def.reward,

    attackTimer:
      randomRange(
        1.0,
        2.0
      ),

    attacked:
      false,

    bob:
      Math.random() *
      Math.PI *
      2,

    flash:
      0
  });


  return true;
}


function updateEnemyDirector(
  dt
) {

  if (
    waveRemaining >
    0
  ) {

    waveSpawnTimer -=
      dt;


    if (
      waveSpawnTimer <=
      0
    ) {

      if (
        spawnEnemy()
      ) {

        waveRemaining--;


        waveSpawnTimer =
          randomRange(
            CONFIG.waveSpawnMin,
            CONFIG.waveSpawnMax
          );
      }
      else {

        waveSpawnTimer =
          0.25;
      }
    }


    return;
  }


  waveRestTimer -=
    dt;


  if (
    waveRestTimer <=
    0 &&
    enemies.length <=
      1
  ) {

    startNewWave();


    waveRestTimer =
      randomRange(
        CONFIG.waveRestMin,
        CONFIG.waveRestMax
      );
  }
}


// ============================================================
// GROUND HAZARDS
//
// Only jump remains. No dodge mechanic exists.
// ============================================================

function spawnGroundHazard() {

  if (
    mode !==
    MODE.CHASE
  ) {
    return;
  }


  groundHazards.push({

    relX:
      W *
      0.52 +
      randomRange(
        70,
        150
      ),

    speed:
      randomRange(
        105,
        135
      ),

    warning:
      false
  });
}


let groundHazardTimer =
  4.4;


// ============================================================
// ENEMY DEFEAT
// ============================================================

function defeatEnemy(
  index
) {

  const enemy =
    enemies[
      index
    ];


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
      58,
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
    0.62
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
// ENEMY RANGED ATTACK
// ============================================================

function spawnIncomingAttack(
  enemy
) {

  incomingAttacks.push({

    life:
      CONFIG.enemyAttackTravelTime,

    duration:
      CONFIG.enemyAttackTravelTime,

    sourceOffset:
      enemy.relX,

    checked:
      false
  });


  showMessage(
    "Jump!",
    0.58
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
    .add("hidden");


  mode =
    MODE.MEETING;


  meeting.priyankaX =
    W *
    0.30;


  meeting.debashisX =
    W *
    0.78;


  meeting.targetDebashisX =
    W *
    0.61;


  meeting.phaseTime =
    0;


  // Priyanka is facing Debashis.
  player.facing =
    1;

  player.state =
    "idle";


  // Debashis walks toward Priyanka from the right.
  debashis.facing =
    -1;

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


  // Both are now completely still and face one another.
  player.state =
    "idle";

  player.facing =
    1;


  debashis.state =
    "idle";

  debashis.facing =
    -1;


  speechBubble
    .classList
    .remove("hidden");


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

    speechBubble
      .classList
      .add("hidden");


    mode =
      MODE.RUNAWAY;


    meeting.phaseTime =
      0;


    // Priyanka turns away from Debashis and runs left.
    player.facing =
      -1;

    player.state =
      "runL";


    // Debashis remains standing and looking toward her.
    debashis.facing =
      -1;

    debashis.state =
      "idle";


    return;
  }


  const item =
    dialogueSequence[
      dialogueIndex
    ];


  speechName.textContent =
    item.speaker;


  speechText.textContent =
    item.text;


  dialogueTimer =
    item.duration;


  updateSpeechBubblePosition();


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

  player.facing =
    1;


  debashis.state =
    "idle";

  debashis.facing =
    1;


  hud
    .classList
    .remove("hidden");


  mobileControls
    .classList
    .remove("hidden");


  waveRemaining =
    0;

  waveRestTimer =
    0.25;

  waveSpawnTimer =
    0;


  groundHazardTimer =
    3.3;


  updateHud();


  showMessage(
    "Priyanka sees danger near Debashis — protect him ♥",
    2.0
  );
}


// ============================================================
// GAME OVER
// ============================================================

function triggerGameOver() {

  mode =
    MODE.GAME_OVER;


  mobileControls
    .classList
    .add("hidden");


  gameOverOverlay
    .classList
    .remove("hidden");
}


function restartGameplay() {

  enemies.length =
    0;

  heartShots.length =
    0;

  incomingAttacks.length =
    0;

  groundHazards.length =
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
    .add("hidden");


  beginChase();
}


// ============================================================
// REUNION
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

  groundHazards.length =
    0;


  mobileControls
    .classList
    .add("hidden");


  gameHint.textContent =
    "Together ♥";


  celebrationTime =
    0;


  gameAudio.play(
    "celebration",
    0.78
  );


  for (
    let i = 0;
    i < 80;
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
          .remove("hidden");
      }

    },
    1100
  );
}


function continueTogether() {

  celebrationOverlay
    .classList
    .add("hidden");


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
    .remove("hidden");


  mobileControls
    .classList
    .remove("hidden");


  gameHint.textContent =
    "Together Forever ♥";


  waveRemaining =
    0;

  waveRestTimer =
    0.6;


  showMessage(
    "Now Priyanka leads and they fight together ♥",
    2.2
  );


  updateHud();
}


function closeStory() {

  fadeScreen
    .classList
    .add("on");


  setTimeout(
    () => {

      celebrationOverlay
        .classList
        .add("hidden");


      closedOverlay
        .classList
        .remove("hidden");


      fadeScreen
        .classList
        .remove("on");


      mode =
        MODE.CLOSED;


      gameAudio.music.pause();


      try {
        window.close();
      }
      catch (error) {
        // Fallback screen remains visible.
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
// GAMEPLAY UPDATE
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
      0
  ) {

    setMirroredState(
      "idle"
    );
  }


  if (
    !player.grounded
  ) {

    setMirroredState(
      "jump"
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


  updateEnemyDirector(
    dt
  );


  updateEnemies(
    dt
  );


  updateHeartShots(
    dt
  );


  updateIncomingAttacks(
    dt
  );


  updateGroundHazards(
    dt
  );


  updateParticles(
    dt
  );


  if (
    mode ===
    MODE.CHASE
  ) {

    groundHazardTimer -=
      dt;


    if (
      groundHazardTimer <=
      0
    ) {

      spawnGroundHazard();


      groundHazardTimer =
        randomRange(
          5.0,
          8.2
        );
    }
  }
}


// ============================================================
// ENEMIES
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
      enemies[
        i
      ];


    const def =
      ENEMY_TYPES[
        enemy.type
      ];


    enemy.relX -=
      enemy.speed *
      dt;


    enemy.attackTimer -=
      dt;


    enemy.flash =
      Math.max(
        0,
        enemy.flash -
        dt
      );


    if (
      def.ranged &&
      !enemy.attacked &&
      enemy.attackTimer <=
        0 &&
      enemy.relX <
        W *
        0.34 &&
      Math.random() <
        CONFIG.enemyAttackChance
    ) {

      enemy.attacked =
        true;


      spawnIncomingAttack(
        enemy
      );
    }


    if (
      enemy.relX <=
      2
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
// HEART SHOTS
// ============================================================

function updateHeartShots(
  dt
) {

  const positions =
    getCharacterScreenPositions();


  for (
    let i =
      heartShots.length -
      1;
    i >=
      0;
    i--
  ) {

    const shot =
      heartShots[
        i
      ];


    shot.x +=
      shot.vx *
      dt;


    shot.life -=
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
        enemies[
          e
        ];


      const def =
        ENEMY_TYPES[
          enemy.type
        ];


      const ex =
        positions.debashis +
        enemy.relX;


      const ey =
        getEnemyY(
          enemy,
          def
        );


      const hitRadius =
        def.flying
          ? 42
          : 48;


      if (
        Math.abs(
          shot.x -
          ex
        ) <
          hitRadius &&
        Math.abs(
          shot.y -
          ey
        ) <
          50
      ) {

        enemy.hp--;


        enemy.flash =
          0.12;


        spawnSparkles(
          ex,
          ey,
          "#ff86b6",
          8
        );


        heartShots.splice(
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
      shot.life <=
      0
    ) {

      heartShots.splice(
        i,
        1
      );
    }
  }
}


// ============================================================
// RANGED ENEMY ATTACKS
//
// With dodge removed, the player must JUMP over these.
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
      incomingAttacks[
        i
      ];


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
        !player.grounded &&
        player.y >
          38;


      if (
        !avoided
      ) {

        hurtPriyanka(
          14
        );
      }
      else {

        showMessage(
          "Nice jump ♥",
          0.62
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
// GROUND HAZARDS
// ============================================================

function updateGroundHazards(
  dt
) {

  for (
    let i =
      groundHazards.length -
      1;
    i >=
      0;
    i--
  ) {

    const hazard =
      groundHazards[
        i
      ];


    hazard.relX -=
      hazard.speed *
      dt;


    if (
      hazard.relX <
        115 &&
      !hazard.warning
    ) {

      hazard.warning =
        true;


      showMessage(
        "Jump!",
        0.62
      );
    }


    if (
      hazard.relX <=
      0
    ) {

      const safe =
        !debashis.grounded &&
        debashis.y >
          34;


      if (
        !safe
      ) {

        hurtDebashis();
      }
      else {

        showMessage(
          "Saved ♥",
          0.58
        );
      }


      groundHazards.splice(
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
      particles[
        i
      ];


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
// OPENING UPDATE
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
      86 *
      dt;


    if (
      meeting.debashisX <=
      meeting.targetDebashisX
    ) {

      meeting.debashisX =
        meeting.targetDebashisX;


      debashis.state =
        "idle";


      debashis.facing =
        -1;


      startDialogue();
    }
  }


  else if (
    mode ===
    MODE.DIALOGUE
  ) {

    // Explicitly keep both facing each other.
    player.state =
      "idle";

    player.facing =
      1;


    debashis.state =
      "idle";

    debashis.facing =
      -1;


    dialogueTimer -=
      dt;


    updateSpeechBubblePosition();


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


    meeting.priyankaX -=
      205 *
      dt;


    if (
      meeting.priyankaX <
      W *
      0.14
    ) {

      meeting.priyankaX =
        W *
        0.14;
    }


    if (
      meeting.phaseTime >
      3.2
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
// ENVIRONMENT DRAW HELPERS
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


function drawHorizontalScene(
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


  // Horizontal repetition only.
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
      width +
        1,
      height
    );
  }
}


// ============================================================
// DRAW ENVIRONMENT
// ============================================================

function drawEnvironment() {

  // Base sky.
  const skyGradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );


  skyGradient.addColorStop(
    0,
    "#24114b"
  );


  skyGradient.addColorStop(
    0.42,
    "#6a4e88"
  );


  skyGradient.addColorStop(
    0.72,
    "#d78ca2"
  );


  skyGradient.addColorStop(
    1,
    "#f0c29f"
  );


  ctx.fillStyle =
    skyGradient;


  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  /*
  ----------------------------------------------------------
  IMPORTANT:
  We intentionally use ONE large distant scenic layer.

  V5 used several full scenic strips stacked vertically.
  On a phone that could look like the same world repeating
  downward. V6 does not do that.
  ----------------------------------------------------------
  */

  drawHorizontalScene(
    ENV.sky,
    0,
    H *
      0.63,
    0.055
  );


  // Blend the lower part of the sky into the garden.
  const haze =
    ctx.createLinearGradient(
      0,
      H *
        0.42,
      0,
      H *
        0.72
    );


  haze.addColorStop(
    0,
    "rgba(116,94,142,0)"
  );


  haze.addColorStop(
    1,
    "rgba(93,79,88,.38)"
  );


  ctx.fillStyle =
    haze;


  ctx.fillRect(
    0,
    H *
      0.42,
    W,
    H *
      0.30
  );


  // A single forest midground band.
  drawHorizontalScene(
    ENV.forest,
    H *
      0.51,
    H *
      0.23,
    0.20
  );


  drawWorldDecorations();


  // Ground base.
  ctx.fillStyle =
    "#315f42";


  ctx.fillRect(
    0,
    groundY(),
    W,
    H -
    groundY()
  );


  // Foreground garden edge as ONE thin strip.
  drawHorizontalScene(
    ENV.foreground,
    groundY() -
      35,
    62,
    0.75
  );


  // Ground tiles.
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
          9,
        tileW,
        45
      );
    }
  }


  // Subtle near-ground mist.
  const groundShade =
    ctx.createLinearGradient(
      0,
      groundY(),
      0,
      H
    );


  groundShade.addColorStop(
    0,
    "rgba(21,45,29,0)"
  );


  groundShade.addColorStop(
    1,
    "rgba(10,25,17,.42)"
  );


  ctx.fillStyle =
    groundShade;


  ctx.fillRect(
    0,
    groundY(),
    W,
    H -
    groundY()
  );
}


// ============================================================
// DRAW PROCEDURAL DECORATIONS
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
          -230 ||
        sx >
          W +
          230
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
        108;


      let baseH =
        100;


      if (
        object.type ===
        "pinkTree"
      ) {

        baseW =
          148;

        baseH =
          130;
      }


      if (
        object.type ===
          "fountain" ||
        object.type ===
          "bridge"
      ) {

        baseW =
          140;

        baseH =
          100;
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
          h -
          4,
        w,
        h
      );
    }
  }
}


// ============================================================
// CHARACTER DRAWING
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
  scale = 1,
  options = {}
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


  let frame =
    Math.floor(
      animTime *
      anim.fps
    ) %
    anim.frames;


  if (
    Number.isInteger(
      options.fixedFrame
    )
  ) {

    frame =
      options.fixedFrame;
  }


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


  let flip =
    false;


  if (
    options.forceFacing ===
    "left"
  ) {

    flip =
      true;
  }
  else if (
    options.forceFacing ===
    "right"
  ) {

    flip =
      false;
  }
  else if (
    (
      state ===
        "jump" ||
      state ===
        "attack"
    ) &&
    facing <
      0
  ) {

    flip =
      true;
  }


  if (
    flip
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
// OPENING CHARACTER DRAW
// ============================================================

function drawOpeningCharacters() {

  const base =
    groundY();


  const px =
    meeting.priyankaX ||
    W *
      0.30;


  const dx =
    meeting.debashisX ||
    W *
      0.78;


  if (
    mode ===
    MODE.DIALOGUE
  ) {

    /*
    ---------------------------------------------------------
    Critical opening fix:
    Use a fixed side-facing frame instead of animating through
    the idle turn-around frames.

    Priyanka: side frame facing right.
    Debashis: same type of side frame mirrored to face left.
    ---------------------------------------------------------
    */

    drawCharacter(
      priyankaAtlas,
      PRIYANKA_ANIMS,
      PRIYANKA_CELL,
      "idle",
      0,
      px,
      base,
      1,
      0.88,
      {
        fixedFrame:1,
        forceFacing:"right"
      }
    );


    drawCharacter(
      debashisAtlas,
      DEBASHIS_ANIMS,
      DEBASHIS_CELL,
      "idle",
      0,
      dx,
      base,
      -1,
      0.88,
      {
        fixedFrame:1,
        forceFacing:"left"
      }
    );


    return;
  }


  // Priyanka standing before the meeting.
  const priOptions =
    mode ===
    MODE.MEETING
      ? {
          fixedFrame:1,
          forceFacing:"right"
        }
      : {};


  drawCharacter(
    priyankaAtlas,
    PRIYANKA_ANIMS,
    PRIYANKA_CELL,
    player.state,
    player.animTime,
    px,
    base,
    player.facing,
    0.88,
    priOptions
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
    0.88,
    mode === MODE.MEETING
      ? {}
      : {
          fixedFrame:1,
          forceFacing:"left"
        }
  );


  // Small anger mark during the runaway.
  if (
    mode ===
      MODE.RUNAWAY &&
    meeting.phaseTime <
      1.35
  ) {

    ctx.save();

    ctx.font =
      "bold 25px sans-serif";

    ctx.fillStyle =
      "#ff4267";

    ctx.textAlign =
      "center";

    ctx.fillText(
      "!",
      px,
      base -
        150
    );

    ctx.restore();
  }
}


// ============================================================
// GAMEPLAY CHARACTERS
// ============================================================

function drawGameplayCharacters() {

  const positions =
    getCharacterScreenPositions();


  const scale =
    CONFIG.characterScale;


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
    scale
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
    scale *
      0.98
  );
}


// ============================================================
// ENEMY DRAWING
// ============================================================

function getEnemyY(
  enemy,
  def
) {

  if (
    def.flying
  ) {

    return (
      groundY() -
      108 +
      Math.sin(
        time *
        4.2 +
        enemy.bob
      ) *
      13
    );
  }


  return (
    groundY() -
    47 +
    Math.sin(
      time *
      3.4 +
      enemy.bob
    ) *
    2
  );
}


function drawEnemySprite(
  enemy,
  x,
  y
) {

  const def =
    ENEMY_TYPES[
      enemy.type
    ];


  const crop =
    def.crop;


  if (
    !environmentAtlas.complete
  ) {

    // Fallback only.
    ctx.fillStyle =
      "#57274f";

    ctx.beginPath();

    ctx.arc(
      x,
      y,
      28,
      0,
      Math.PI *
      2
    );

    ctx.fill();

    return;
  }


  const naturalRatio =
    crop.w /
    crop.h;


  const baseH =
    def.flying
      ? 72
      : 83;


  const h =
    baseH *
    def.scale;


  const w =
    h *
    naturalRatio;


  ctx.save();


  if (
    enemy.flash >
    0
  ) {

    ctx.globalAlpha =
      0.55 +
      Math.sin(
        enemy.flash *
        90
      ) *
      0.35;
  }


  // Flip illustrated enemies so they face toward Debashis.
  ctx.translate(
    x,
    y
  );


  ctx.scale(
    -1,
    1
  );


  ctx.drawImage(
    environmentAtlas,

    crop.x,
    crop.y,
    crop.w,
    crop.h,

    -w /
      2,
    -h /
      2,
    w,
    h
  );


  ctx.restore();


  // HP bar for multi-hit enemies.
  if (
    enemy.maxHp >
    1
  ) {

    const barW =
      42;


    ctx.fillStyle =
      "rgba(25,8,22,.62)";


    ctx.fillRect(
      x -
        barW /
        2,
      y -
        h /
        2 -
        11,
      barW,
      5
    );


    ctx.fillStyle =
      "#ff7ca8";


    ctx.fillRect(
      x -
        barW /
        2,
      y -
        h /
        2 -
        11,
      barW *
        clamp(
          enemy.hp /
          enemy.maxHp,
          0,
          1
        ),
      5
    );
  }
}


function drawEnemies() {

  const positions =
    getCharacterScreenPositions();


  for (
    const enemy
    of enemies
  ) {

    const def =
      ENEMY_TYPES[
        enemy.type
      ];


    const x =
      positions.debashis +
      enemy.relX;


    const y =
      getEnemyY(
        enemy,
        def
      );


    drawEnemySprite(
      enemy,
      x,
      y
    );
  }
}


// ============================================================
// HEART PROJECTILES
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


function drawHeartShots() {

  for (
    const shot
    of heartShots
  ) {

    ctx.save();


    ctx.shadowColor =
      "#ff5fa9";


    ctx.shadowBlur =
      17;


    drawHeartShape(
      shot.x,
      shot.y,
      16,
      "#ff5fa9"
    );


    ctx.shadowBlur =
      0;


    drawHeartShape(
      shot.x,
      shot.y,
      8,
      "#fff2f8"
    );


    ctx.restore();
  }
}


// ============================================================
// ENEMY ATTACK DRAW
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
      72 -
      Math.sin(
        t *
        Math.PI
      ) *
      44;


    ctx.save();


    ctx.shadowColor =
      "#7338cf";


    ctx.shadowBlur =
      18;


    ctx.fillStyle =
      "#7d45d8";


    ctx.beginPath();

    ctx.arc(
      x,
      y,
      9,
      0,
      Math.PI *
      2
    );

    ctx.fill();


    ctx.fillStyle =
      "#e5d7ff";


    ctx.beginPath();

    ctx.arc(
      x,
      y,
      3,
      0,
      Math.PI *
      2
    );

    ctx.fill();


    ctx.restore();
  }
}


// ============================================================
// GROUND HAZARD DRAW
// ============================================================

function drawGroundHazards() {

  const positions =
    getCharacterScreenPositions();


  for (
    const hazard
    of groundHazards
  ) {

    const x =
      positions.debashis +
      hazard.relX;


    ctx.save();


    ctx.fillStyle =
      "#315830";


    ctx.strokeStyle =
      "#203c26";


    ctx.lineWidth =
      2;


    ctx.beginPath();

    ctx.moveTo(
      x -
        27,
      groundY()
    );

    ctx.lineTo(
      x -
        15,
      groundY() -
        37
    );

    ctx.lineTo(
      x -
        5,
      groundY()
    );

    ctx.lineTo(
      x +
        7,
      groundY() -
        46
    );

    ctx.lineTo(
      x +
        18,
      groundY()
    );

    ctx.lineTo(
      x +
        28,
      groundY() -
        31
    );

    ctx.lineTo(
      x +
        37,
      groundY()
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    ctx.restore();
  }
}


// ============================================================
// PARTICLES / CELEBRATION
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

    meeting.priyankaX =
      W *
      0.30;


    meeting.debashisX =
      W *
      0.78;


    player.state =
      "idle";


    debashis.state =
      "idle";


    // Even before start, face one another.
    drawCharacter(
      priyankaAtlas,
      PRIYANKA_ANIMS,
      PRIYANKA_CELL,
      "idle",
      0,
      meeting.priyankaX,
      groundY(),
      1,
      0.88,
      {
        fixedFrame:1,
        forceFacing:"right"
      }
    );


    drawCharacter(
      debashisAtlas,
      DEBASHIS_ANIMS,
      DEBASHIS_CELL,
      "idle",
      0,
      meeting.debashisX,
      groundY(),
      -1,
      0.88,
      {
        fixedFrame:1,
        forceFacing:"left"
      }
    );
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

    drawGroundHazards();

    drawEnemies();

    drawIncomingAttacks();

    drawGameplayCharacters();

    drawHeartShots();

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
        .add("active");
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
        .remove("active");
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
// BUTTONS
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


    soundButton.textContent =
      enabled
        ? "♪"
        : "×";
  }
);


// ============================================================
// LOOP
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
