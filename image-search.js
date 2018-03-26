const fetch = require('node-fetch')

module.exports = class ImageSearch {
  static async search(offset=1, ...terms) {
    const url = `https://api.imgur.com/3/gallery/search/top/${offset}/?q_all=${terms.join(" ")}`
    const IMGUR_API_CLIENT = process.env.IMGUR_CLIENT_ID
    
    const resp = await fetch(url, {headers: {Authorization: `Client-ID ${IMGUR_API_CLIENT}`}})
    const json = await resp.json()

    return (json.data || []).filter(item => !item.is_album).map(({link:url, title:snippet, id}) => {
      const context = `imgur.com/gallery/${id}`
      const thumbnail = url.replace(id, id + "s")
      return {url, snippet, context, thumbnail }
    })
  }
}