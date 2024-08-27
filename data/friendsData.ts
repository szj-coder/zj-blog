import type { Friend } from '~/types'

export let friendsData: Friend[] = [
  {
    type: 'friend',
    name: 'claude',
    slogan: 'Anthropic开发的大语言模型',
    imgSrc: '/static/images/friends/claude.svg',
    url: 'https://claude.ai/',
  },
  {
    type: 'friend',
    name: 'ChatGPT',
    slogan: 'OpenAI开发的人工智能聊天机器人程序',
    imgSrc: '/static/images/friends/ChatGPT.svg',
    url: 'https://chatgpt.com/',
  },
]
