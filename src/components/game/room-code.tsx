import { EyeIcon, EyeClosedIcon } from 'lucide-react'
import React from 'react'

type Props = Readonly<{
  code: string
}>

export function RoomCode(props: Props) {
  const { code } = props
  const [showing, show] = React.useState<boolean>(false)
  return (
    <div className="inline-flex items-center gap-3 font-mono text-4xl">
      {showing ? code : '????'}{' '}
      <button
        type="button"
        className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-mauve-50/5 text-mauve-50 transition-all hover:bg-mauve-50/15 active:bg-mauve-50/20"
        onClick={() => {
          show((showing) => !showing)
        }}
      >
        {showing ? <EyeClosedIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}
