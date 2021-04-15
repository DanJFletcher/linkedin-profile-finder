const fetch = require('node-fetch')

const handler = async function (event) {
  const query = JSON.parse(event.body)
  const { GOOGLE_SEARCH_API_SECRET } = process.env

  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1/siterestrict?key=${GOOGLE_SEARCH_API_SECRET}&cx=fb1c5f1e963f16518&q=${query}`, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }

    const data = await response.json()

    if (!data.items) {
      data.items = [{formattedUrl: 'no LinkedIn'}]
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.items[0].formattedUrl),
    }
  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
