(() => {

  "use strict";

  const AUDIO_FILES = {

    music:
      "assets/audio/magical_story_loop.mp3",

    heart:
      "assets/audio/heart_fire.mp3",

    jump:
      "assets/audio/jump.mp3",

    dodge:
      "assets/audio/dodge.mp3",

    playerHit:
      "assets/audio/player_hit.mp3",

    debashisHit:
      "assets/audio/debashis_hit.mp3",

    enemyDefeat:
      "assets/audio/enemy_defeat.mp3",

    dialogueDebashis:
      "assets/audio/dialogue_debashis.mp3",

    dialoguePriyanka:
      "assets/audio/dialogue_priyanka.mp3",

    ui:
      "assets/audio/ui.mp3",

    celebration:
      "assets/audio/celebration.mp3"
  };


  class GameAudio {

    constructor() {

      this.enabled = true;

      this.started = false;

      this.music = new Audio(
        AUDIO_FILES.music
      );

      this.music.loop = true;

      this.music.volume = 0.34;


      this.sounds = {};

      for (
        const [name, src]
        of Object.entries(
          AUDIO_FILES
        )
      ) {

        if (
          name === "music"
        ) {

          continue;
        }

        const audio =
          new Audio(src);

        audio.preload =
          "auto";

        this.sounds[name] =
          audio;
      }
    }


    async start() {

      if (
        this.started
      ) {

        return;
      }

      this.started = true;

      if (
        !this.enabled
      ) {

        return;
      }

      try {

        await this.music.play();

      }
      catch (
        error
      ) {

        console.warn(
          "Music requires another user interaction.",
          error
        );
      }
    }


    play(
      name,
      volume = 1
    ) {

      if (
        !this.enabled
      ) {

        return;
      }

      const source =
        this.sounds[name];

      if (
        !source
      ) {

        return;
      }

      const sound =
        source.cloneNode();

      sound.volume =
        Math.max(
          0,
          Math.min(
            1,
            volume
          )
        );

      sound.play()
        .catch(
          () => {}
        );
    }


    setEnabled(
      enabled
    ) {

      this.enabled =
        Boolean(enabled);

      if (
        this.enabled
      ) {

        if (
          this.started
        ) {

          this.music.play()
            .catch(
              () => {}
            );
        }
      }
      else {

        this.music.pause();
      }
    }


    toggle() {

      this.setEnabled(
        !this.enabled
      );

      return this.enabled;
    }


    setMusicVolume(
      volume
    ) {

      this.music.volume =
        Math.max(
          0,
          Math.min(
            1,
            volume
          )
        );
    }


    useCustomMusic(
      path
    ) {

      const wasPlaying =
        !this.music.paused;

      this.music.pause();

      this.music.src =
        path;

      this.music.loop =
        true;

      if (
        wasPlaying &&
        this.enabled
      ) {

        this.music.play()
          .catch(
            () => {}
          );
      }
    }

  }


  window.gameAudio =
    new GameAudio();

})();
