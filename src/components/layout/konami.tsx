import useSound from '@mrmartineau/use-sound'
import { useHotkeySequence } from '@tanstack/react-hotkeys'

import konamiSound from '@/assets/konamiSound.mp3'

export function Konami() {
  const [play] = useSound(konamiSound)
  useHotkeySequence(
    [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'B',
      'A',
    ],
    () => {
      play()
    },
    {
      timeout: 1500,
    },
  )

  return null
}
