/*global chrome*/

chrome.management.onInstalled.addListener(({id}) => {
  chrome.runtime.sendMessage(id, {type: "action spec"}, spec => storeActionSpec({id, ...spec}))
})

function storeActionSpec(thisSpec) {
  // TODO: Type-check incoming spec!
  getActionSpecs(actionSpecs => {
    console.debug("---begin storeActionSpec---")
    console.debug(actionSpecs)
    const index = actionSpecs.findIndex(thatSpec => thisSpec.id === thatSpec.id)
    if (index > -1)
      actionSpecs[index] = thisSpec
    else
      actionSpecs.unshift(thisSpec)
    saveActionSpecs(actionSpecs)
    console.debug("---end storeActionSpec---")
  })
}

chrome.runtime.onInstalled.addListener(() => {
  getActionSpecs(actionSpecs => {
    const validSpecs = actionSpecs.filter(({id, name, actions}) => 
      id !== undefined && name !== undefined && actions !== undefined)
    console.debug(validSpecs)
    saveActionSpecs(validSpecs)
  })
})

function getActionSpecs(callback) {
  chrome.storage.sync.get({actionSpecs: []}, ({actionSpecs}) => callback(actionSpecs))
}

function saveActionSpecs(actionSpecs) {
  chrome.storage.sync.set({actionSpecs})
}

chrome.runtime.onConnect.addListener(({ name, onMessage }) => {
  if (name == 'ActHub')
    onMessage.addListener(message => {
      console.log(message)
      console.log('Thanks, content.js -- received in background.js')
    });
});
