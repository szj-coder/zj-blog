import React from 'react'
import Typed from 'typed.js'
import { Twemoji } from '../Twemoji'

function createTypedInstance(el: HTMLElement) {
  return new Typed(el, {
    stringsElement: '#bios',
    typeSpeed: 40,
    backSpeed: 10,
    loop: true,
    backDelay: 1000,
  })
}
export function TypedBios() {
  const el = React.useRef(null)

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      stringsElement: '#bios',
      typeSpeed: 40,
      backSpeed: 10,
      loop: true,
      backDelay: 1000,
    })
    return () => typed.destroy()
  }, [])

  return (
    <div>
      <ul id="bios" className="hidden">
        {/* <li>
          I'm aliased as <b className="font-medium">Xiaoke</b> at work.
        </li> */}
        <li>I'm a learner, builder, and freedom seeker.</li>
        <li>
          I live in <b className="font-medium">ShangHai, China</b>.
        </li>
        <li>
          I was born in the beautiful <b className="font-medium">Mount Tai</b>.
        </li>
        <li>
          My first programming language I learned was <b className="font-medium">C</b>.
        </li>
        <li>I am currently a back-end developer.</li>
        <li>I like to explore other programming languages.</li>
        <li>
          I'm a Ox-person <Twemoji emoji="dog" />.
        </li>
        <li>
          I'm a guy who wants to enjoy life. I love
          <span className="ml-1">
            <Twemoji emoji="man-swimming" />,
            <Twemoji emoji="ping-pong" />,
          </span>
          .
        </li>
        {/* <li>I love watching football.</li> */}
        {/* <li>
          I love playing <Twemoji emoji="musical-keyboard" /> & <Twemoji emoji="guitar" />.
        </li> */}
        {/* <li>I love rock music.</li> */}
        {/* <li>
          I love playing chess <Twemoji emoji="chess-pawn" />.
        </li> */}
        {/* <li>
          I love playing video game <Twemoji emoji="video-game" />, PES is my favorite one.
        </li> */}
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}
