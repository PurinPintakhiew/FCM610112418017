const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-ce809-firebase-adminsdk-i1wt8-9533f4e085.json')
const databaseURL = 'https://fcm-ce809.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-ce809/messages:send'
const deviceToken =
  'coIDFGduk5q0UhSGA5AVkR:APA91bHpSE2qjuyf4wxr0-qXJMN6yZOhos8HpDoyG35JAiOKvZx1MjbNDfHJdJORus_VAAXqLESlUawVUk_G5NvcXE6S8vXMzlizhV4v-2i6AOb-3k6KHxq9_QQzLad2YJwbugMj4dft'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()
