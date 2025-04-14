chrome.runtime.onInstalled.addListener(() => {
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "recovery_origin") {
        sendMessageToContentScript("recovery_origin");
    } else if (command === "translate_to_kr_hide_ad") {
        sendMessageToContentScript("translate_to_kr_hide_ad");
    } else if (command === "hide_ad") {
        sendMessageToContentScript("hide_ad");
    }
});

function sendMessageToContentScript(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
          let tab = tabs[0];
          chrome.tabs.sendMessage(tab.id, { action: message }, (response) => {
              if (chrome.runtime.lastError) {
                  console.warn("⚠️ Could not send message:", chrome.runtime.lastError.message);
              } else {
                  console.log("✅ Message sent successfully:", response);
              }
          });
      } else {
          console.warn("⚠️ No active tab found.");
      }
  });
}