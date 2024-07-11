const interceptRules = [
  {
      id: 1,
      priority: 1,
      action: {
          type: "block"
      },
      condition: {
          urlFilter: "https://x.com/i/api/graphql/V7H0Ap3_Hh2FyS75OCDO3Q/*",
          resourceTypes: ["xmlhttprequest"]
      }
  },
  {
      id: 2,
      priority: 1,
      action: {
          type: "block"
      },
      condition: {
          urlFilter: "https://x.com/i/api/1.1/jot/client_event.json",
          resourceTypes: ["xmlhttprequest"]
      }
  },
  {
      id: 3,
      priority: 1,
      action: {
          type: "block"
      },
      condition: {
          urlFilter: "https://api.x.com/1.1/live_pipeline/update_subscriptions",
          resourceTypes: ["xmlhttprequest"]
      }
  },
];


chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4]
  });
});

function setInterception(enable) {
  if (enable) {
      chrome.declarativeNetRequest.updateDynamicRules({
          addRules: interceptRules
      });
  } else {
      chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: interceptRules.map((rule) => rule.id)
      });
  }
}

// Listen for messages to toggle interception
// Combined onMessage listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleInterception") {
      setInterception(message.enable);
      sendResponse({ intercepting: message.enable });
  } else if (message.action === "getLikes") {
      getLikes(message.logged_in_user, message.requested_user)
          .then(data => sendResponse({ success: true, data }))
          .catch(error => sendResponse({ success: false, error: error.message }));
      return true;  // Keep the messaging channel open for sendResponse
  }
});

async function getLikes(logged_in_user, requested_user) {
  const url = 'https://www.bringbacklikes.com/api/likes/'

  const payload = {
      logged_in_user: logged_in_user,
      requested_user: requested_user
  };

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Return the payload if the request is successful
      if (data.success) {
          return data.payload;
      } else {
          return data.error;
      }
  } catch (error) {
      return "Error fetching likes";
  }
}