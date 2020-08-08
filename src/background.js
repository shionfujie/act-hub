/*global chrome*/

chrome.runtime.onConnect.addListener(({ name, onMessage }) => {
  if (name == 'ActHub')
    onMessage.addListener(message => {
      console.log(message.message)
      console.log('Thanks, content.js -- received in background.js')
    });
});
