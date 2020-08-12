/*global chrome*/

chrome.management.onInstalled.addListener(({id}) => {
  chrome.runtime.sendMessage(id, {type: "action spec"}, spec => {
    console.debug(spec)
  })
})

chrome.runtime.onConnect.addListener(({ name, onMessage }) => {
  if (name == 'ActHub')
    onMessage.addListener(message => {
      console.log(message)
      console.log('Thanks, content.js -- received in background.js')
    });
});
