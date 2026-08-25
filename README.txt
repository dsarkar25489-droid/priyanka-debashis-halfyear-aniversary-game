PRIYANKA ♥ DEBASHIS — STORY GAME V5
====================================

THIS VERSION HAS NO LEVEL / MONTH SYSTEM.

STORY
-----
1. Priyanka and Debashis meet.
2. Debashis walks to Priyanka.
3. Debashis: Bengali?
4. Priyanka: YES
5. Debashis: Haat ta Dao
6. Priyanka: Yarki Hoche naki, haat dhorbe!
7. Priyanka gets angry, turns left and runs away.
8. The chase/protection game begins.
9. Priyanka's actions are mirrored by Debashis.
10. Enemy kills bring Priyanka closer.
11. Priyanka getting hurt pushes Debashis farther away.
12. When Priyanka reaches Debashis:
    HAPPY HALFWAY ANNIVERSARY
13. Continue = both keep playing together forever.
14. Close = story fades out.

FILES
-----
index.html
style.css
audio.js
game.js

assets/
    priyanka_atlas.png
    debashis_atlas.png
    environment_atlas.png

assets/audio/
    magical_story_loop.mp3
    heart_fire.mp3
    jump.mp3
    dodge.mp3
    player_hit.mp3
    debashis_hit.mp3
    enemy_defeat.mp3
    dialogue_debashis.mp3
    dialogue_priyanka.mp3
    ui.mp3
    celebration.mp3

ANDROID
-------
The game uses Pointer Events for touch controls.

The first "Tap to begin" is important:
Android Chrome does not allow background audio autoplay before a user gesture.

GOOGLE VM
---------
This game is a static website.
Nginx can serve the folder directly.

Example web root:
    /var/www/lovegame/

Copy all files from this folder into that location.

MAIN DIFFICULTY SETTINGS
------------------------
Open game.js and find:

const CONFIG = {

Important settings:

startDistance: 1050

enemySpawnMin: 1.15
enemySpawnMax: 2.20
maxActiveEnemies: 3

priyankaHitPenalty: 62

normalKillReward: 27
fastKillReward: 34
strongKillReward: 52
eliteKillReward: 72

To make the game HARDER:

enemySpawnMin: 0.90
enemySpawnMax: 1.60
maxActiveEnemies: 4

To make it EASIER:

enemySpawnMin: 1.60
enemySpawnMax: 2.80
maxActiveEnemies: 2

BACKGROUND MUSIC
----------------
The included file:

assets/audio/magical_story_loop.mp3

is an ORIGINAL magical-fantasy loop generated for this project.

It is NOT the Harry Potter theme.

If you legally own/licence another music track, replace:

assets/audio/magical_story_loop.mp3

with your track using the SAME filename.

Or edit audio.js:

music:
    "assets/audio/YOUR_FILE.mp3"

The track automatically loops.

MUSIC VOLUME
------------
Open audio.js and find:

this.music.volume = 0.34;

Example:
0.20 = quieter
0.50 = louder

CONTROLS
--------
Android:
Left / Right / Run / Dodge / Jump / Heart buttons

Desktop:
A / Left Arrow     Move left
D / Right Arrow    Move right
Shift              Run
Space / Up / W     Jump
S                  Dodge
J / F              Fire heart
