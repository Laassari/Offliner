import ytdl from '@distube/ytdl-core'

let cookie = null
const agentOptions = {
  headers: {
    referer: 'https://www.youtube.com/',
  },
}

/**
 *
 * @param {string} cookString
 */
export function setCookie(cookString) {
  if (!cookString.trim()) return

  const parsed = JSON.parse(cookString)

  if (Array.isArray(parsed) && parsed.length > 0) {
    cookie = JSON.parse(cookString)
    console.log({ cookie })
  }
}

/**
 *
 * @param {string} url
 * @param {import('@distube/ytdl-core').getInfoOptions} options
 * @returns {Promise<import('@distube/ytdl-core').videoInfo>}
 */
export function getVideoInfo(url, options = {}) {
  const agent = cookie && ytdl.createAgent(cookie, agentOptions)

  return ytdl.getInfo(url, { agent, ...options })
}

/**
 *
 * @param {string} url
 * @param {import('@distube/ytdl-core').downloadOptions} options
 * @returns {Readable}
 */
export function downloadVideo(url, options = {}) {
  const agent = cookie && ytdl.createAgent(cookie, agentOptions)

  return ytdl(url, { agent, ...options })
}

/**
 *
 * @param {import('@distube/ytdl-core').videoFormat} formats
 * @param {import('@distube/ytdl-core').chooseFormatOptions} options
 * @returns
 */
export function chooseVideoFormat(formats, options = {}) {
  return ytdl.chooseFormat(formats, options)
}
