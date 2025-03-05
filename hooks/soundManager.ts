import { Audio } from 'expo-av';

class SoundManager {
  private sounds: { [key: string]: Audio.Sound } = {};

  async loadSounds() {
    const soundFiles = {
      up: require('../assets/sounds/up.mp3'),
      swoosh: require('../assets/sounds/swoosh.mp3'),
      bomb: require('../assets/sounds/bomb.mp3'),
    };

    for (const [key, file] of Object.entries(soundFiles)) {
      const { sound } = await Audio.Sound.createAsync(file);
      this.sounds[key] = sound;
    }
  }

  async playSound(soundName: 'up' | 'swoosh' | 'bomb') {
    if (this.sounds[soundName]) {
      try {
        await this.sounds[soundName].replayAsync();
      } catch (error) {
        // Erro silencioso
      }
    }
  }

  async unloadSounds() {
    for (const sound of Object.values(this.sounds)) {
      await sound.unloadAsync();
    }
    this.sounds = {};
  }
}

export const soundManager = new SoundManager(); 