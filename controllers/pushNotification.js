const { Expo } = require('expo-server-sdk');
const tokens = require("./tokensController");

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const pushNotification = (ph) => {
  tokens.serverGetTokens()
    .then(token => {
      let messages = [];

      for (let pushToken of token) {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }

        messages.push({
          to: pushToken,
          playSound: 'default',
          title: 'A new change in pH level has been detected',
          body: `Current pH level: ${ph}`,
          data: {},
        });
      }

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];

      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }

        let receiptIds = [];
        for (let ticket of tickets) {
          if (ticket.id) {
            receiptIds.push(ticket.id);
          }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            for (let receiptId in receipts) {
              let { status, message, details } = receipts[receiptId];
              if (status === 'ok') {
                continue;
              } else if (status === 'error') {
                console.error(
                  `There was an error sending a notification: ${message}`
                );
                if (details && details.error) {
                  console.error(`The error code is ${details.error}`);
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      })();
    })
    .catch(error => {
      console.error('Error in serverGetTokens:', error);
    });
};

module.exports = pushNotification;
