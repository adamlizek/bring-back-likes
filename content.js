let basic_tweet = '';

async function loadArticles() {
    try {
        const response = await fetch(chrome.runtime.getURL('samples/basic.html'));
        basic_tweet = await response.text();
    } catch (error) {
        console.log('Error loading articles:', error);
    }
}

function stringToHTML(str) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = str.trim();
    return tempDiv.firstChild; // Return the first child element
}


function getLastDeepestChild(element) {
    let currentElement = element;

    // Traverse down the chain of children
    while (currentElement.children.length > 0) {
        currentElement = currentElement.children[0];
    }

    return currentElement;
}

function removeElementByClassName(className) {
    const element = document.querySelector(`.${className.replace(/ /g, '.')}`);
    if (element) {
        element.parentNode.removeChild(element);
    }
}

function getUserId(document){
    // Find all script elements in the body
    const scripts = document.body.getElementsByTagName('script');

    // Iterate over each script element
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];

        // Check if the script's textContent includes __INITIAL_STATE__
        if (script.textContent.includes('__INITIAL_STATE__')) {            
            // Extract the JSON content from the script's textContent
            const jsonMatch = script.textContent.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/s);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    // Parse the JSON string to an object
                    const initialState = JSON.parse(jsonMatch[1]);
                    
                    // Access the user information
                    if (initialState.entities && initialState.entities.users && initialState.entities.users.entities) {
                        const users = initialState.entities.users.entities;
                        for (const id in users) {
                            if (users.hasOwnProperty(id)) {
                                return id;
                            }
                        }
                    } else {
                        console.log('The initial state object does not have the expected structure:', initialState);
                    }
                } catch (e) {
                    console.log('Error parsing JSON:', e);
                }
            }
        }
    }
    return null;
}

function removeAllSvgElements(element) {
    // Recursive function to traverse and remove svg elements
    function recursiveRemoveSvg(el) {
        // Get all svg elements within the current element
        const svgElements = el.querySelectorAll('svg');
        
        // Remove each svg element found
        svgElements.forEach(svg => svg.remove());
        
        // Recursively call for each child element
        Array.from(el.children).forEach(child => recursiveRemoveSvg(child));
    }
    
    // Start the recursive removal from the given element
    recursiveRemoveSvg(element);
}

function updateHeartToEmpty(element) {
    // <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
    const svg = element.querySelector('svg');
    if (svg) {
        svg.innerHTML = '<g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g>';
    }
}



function findSpansWithText(element) {
    const spansWithText = [];
    
    function recursiveSearch(el) {
        if (el.tagName === 'SPAN' && el.textContent.trim() !== '') {
            spansWithText.push(el);
        }
        Array.from(el.children).forEach(child => recursiveSearch(child));
    }
    
    recursiveSearch(element);
    return spansWithText;
}

function findElementWithMatchingText(element, contains, tagName) {
    const spansWithMatchingText = [];
    
    function recursiveSearch(el) {
        // Check if the element is a span and contains "@" in its text content
        if (el.tagName === tagName && el.textContent.includes(contains)) {
            spansWithMatchingText.push(el);
        }
        // Recursively search the children of the current element
        Array.from(el.children).forEach(child => recursiveSearch(child));
    }
    
    // Start the recursive search from the given element
    recursiveSearch(element, contains, tagName);
    return spansWithMatchingText;
}


function deleteNthParent(n, element) {
    let parent = element;
    for (let i = 0; i < n; i++) {
        if (parent) {
            parent = parent.parentElement;
        } else {
            console.log('Parent not found.');
            return;
        }
    }
    
    if (parent) {
        parent.parentElement.removeChild(parent);
    } else {
        console.log(`${n} parent not found.`);
    }
}

function create_media_element(media_url, tweet_id, username) {
    const split_url = media_url.split('.jpg');
    const formatted_url = split_url[0] + '?format=jpg&name=900x900';

    const mediaElement = document.createElement('div');
    mediaElement.className = 'css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu';

    mediaElement.innerHTML = `
        <a href="/${username}/status/${tweet_id}/photo/1" role="link" class="css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21">
            <div class="css-175oi2r r-1adg3ll r-1udh08x" style="width: 382.5px; height: 510px;">
                <div class="r-1adg3ll r-13qz1uu" style="padding-bottom: 133.333%;"></div>
                <div class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu">
                    <div aria-label="Image" class="css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af" data-testid="tweetPhoto" style="margin: 0px;">
                        <div class="css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv" style="background-image: url('${formatted_url}');"></div>
                        <img alt="Image" draggable="true" src="${formatted_url}" class="css-9pa8cd">
                    </div>
                </div>
            </div>
        </a>
    `;

    return mediaElement;
}

function create_media_div(media_urls, tweet_id, username) {
    const parentDiv = document.createElement('div');
    parentDiv.setAttribute('aria-labelledby', 'id__m2ukark7e8 id__k2dtpbmn1x');
    parentDiv.className = 'css-175oi2r r-9aw3ui r-1s2bzr4';
    parentDiv.id = 'id__pp70gsg17vr';

    // Create the inner structure of the parent element
    parentDiv.innerHTML = `
        <div class="css-175oi2r r-9aw3ui">
            <div class="css-175oi2r">
                <div class="css-175oi2r r-k200y">
                    <div class="css-175oi2r r-1kqtdi0 r-1phboty r-rs99b7 r-1867qdf r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l">
                        <div class="css-175oi2r">
                            <div class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const innerDiv = parentDiv.querySelector('.css-175oi2r.r-16y2uox.r-1pi2tsx.r-13qz1uu');

    // Add each media element to the inner div
    media_urls.forEach((media_url, index) => {
        const mediaElement = create_media_element(media_url, tweet_id, username);
        mediaElement.querySelector('a').setAttribute('href', `/${username}/status/${tweet_id}/photo/${index + 1}`);
        innerDiv.appendChild(mediaElement);
    });

    return parentDiv;
}

//Function to clone an existing tweet and update its content
function createTweetElement(templateTweet, data, document) {
    // Clone the existing tweet
    const newTweet = templateTweet.cloneNode(true);

    // Update the tweet content
    const avatarImg = newTweet.querySelector('[data-testid="Tweet-User-Avatar"] img');
    if (avatarImg) {
        avatarImg.src = data.avatarSrc;
        avatarImg.alt = 'User Avatar';

        // Find the sibling element with the specified class name
        const sibling = avatarImg.previousElementSibling || avatarImg.nextElementSibling;
        if (!sibling) {
            console.log('Sibling element not found.');
        } else {
            // Update the style of the sibling element
            sibling.style.backgroundImage = `url("${data.avatarSrc}")`;
        }
    }

    const userName = newTweet.querySelector('[data-testid="User-Name"] a');
    if (userName) {
        const spans = findSpansWithText(userName);
        spans.forEach(span => {
            span.textContent = data.userName
        });
        userName.href = `/${data.userHandle}`;
    }
    
    const spans = findElementWithMatchingText(newTweet, '@', 'SPAN');

    if(spans){
        spans[0].textContent = `@${data.userHandle}`
    }

    // remove all svgs
    removeAllSvgElements(userName);

    const tweetDate = newTweet.querySelector('time');
    if (tweetDate) {
      tweetDate.textContent = data.tweetDate;
    }

    const tweetText = newTweet.querySelector('[data-testid="tweetText"]');
    if (tweetText) {
        tweetText.textContent = data.tweetText;

        // For now, lets hyperlink any https://t.co/ link
        const textContent = data.tweetText;

        // Step 3: Use a regular expression to replace all t.co links with hyperlinks
        const linkedText = textContent.replace(/(https:\/\/t\.co\/\S+)/g, '<a href="$1" target="_blank" style="text-decoration: none; text-overflow: unset; color: rgb(29, 155, 240);">$1</a>');
        
        // Step 4: Replace @ tags with hyperlinks
        const linkedText2 = linkedText.replace(/(@\w+)/g, '<a href="https://x.com/$1" target="_blank" style="text-decoration: none; text-overflow: unset; color: rgb(29, 155, 240);">$1</a>');

        // Step 5: Set the new HTML content of the div
        tweetText.innerHTML = linkedText2;

    } else if (data.tweetText){
        // Create text element
        const tweetText = document.createElement('div');
        tweetText.textContent = data.tweetText;
        tweetText.setAttribute('data-testid', 'tweetText');
        newTweet.appendChild(tweetText);
    }

    // Delete the media container
    const mediaContainer = newTweet.querySelector('[data-testid="tweetPhoto"]');
    if (mediaContainer) {
        deleteNthParent(6, mediaContainer);
    }

    // Delete the quote tweet
    const quoteSpans  = findElementWithMatchingText(newTweet, 'Quote', 'SPAN');
    if (quoteSpans.length > 0) {
        deleteNthParent(3, quoteSpans[0]);
    }

    const analyticButtons = newTweet.querySelectorAll('span[data-testid="app-text-transition-container"]');

    const comments = getLastDeepestChild(analyticButtons[0]);
    comments.textContent = data.replies;

    const retweets = getLastDeepestChild(analyticButtons[1]);
    retweets.textContent = data.retweets;

    const likes = getLastDeepestChild(analyticButtons[2]);
    likes.textContent = data.likes;

    // Update like to correct empty svg
    likedHeart = newTweet.querySelector('button[data-testid="unlike"]');
    if (likedHeart) {
        updateHeartToEmpty(likedHeart);
    }

    // Delete show more if exists
    const showMore = newTweet.querySelector('div[data-testid="tweet-text-show-more-link"]');
    if (showMore) {
        showMore.remove();
    }

    // If tags exist, delete them
    const tags = document.querySelector('a[href*="/media_tags"]');
    if (tags) {
        tags.parentElement.parentElement.remove();
    }

    // Loop through and make sure color is correct
    analyticButtons.forEach(button => {
        button.parentElement.parentElement.style.color = 'rgb(113, 118, 123)';
    });

    const bookmarksButton = newTweet.querySelector('button[aria-label="Bookmark"]');

    // Get Parent, and delete all children but the first 3
    const parent = bookmarksButton.parentElement.parentElement;
    while (parent.children.length > 3) {
        parent.removeChild(parent.lastChild);
    }
    
    // Now add a "link to tweet" button after
    const linkToTweet = document.createElement('a');

    // Delete pinned/rt if it exists
    const headersToDelete = newTweet.querySelector(`[data-testid="socialContext"]`);

    // Reposted, delete 6th parent. 
    // Pinned, delete 4th parent
    if (headersToDelete) {
        if (headersToDelete.textContent.includes('Pinned')) {
            deleteNthParent(4, headersToDelete);
        } else {
            deleteNthParent(6, headersToDelete);
        }
    }

    // If there is media, lets re-add it.
    let mediaDiv = null;
    if (data.media.length > 0){
        const media_urls = []
        // for (const media of data.media){
        //     media_urls.push(media.mediaUrl)
        // }
        media_urls.push(data.media[0].mediaUrl)
        // Only show the first media for now.
        mediaDiv = create_media_div(media_urls, data.tweet_id, data.userHandle);
        const tweet_text = newTweet.querySelector('[data-testid="tweetText"]')
        tweet_text.parentElement.after(mediaDiv)
    }    

    // If theres a quote tweet, lets add it
    // Fix later
    // if (data.quote_tweet){
    //     const quoteTweet = createTweetElement(templateTweet, data.quote_tweet, document);
    //     // If media div exists, put it after. Else, put it after tweetText
    //     if (mediaDiv){
    //         mediaDiv.after(quoteTweet);
    //     } else {
    //         const tweet_text = newTweet.querySelector('[data-testid="tweetText"]')
    //         tweet_text.after(quoteTweet);
    //     }
    // }
    
    // Make it open a new tab
    linkToTweet.target = '_blank';
    linkToTweet.href = `https://twitter.com/${data.userHandle}/status/${data.tweet_id}`;
    linkToTweet.textContent = 'Link to Tweet';
    linkToTweet.style = 'text-decoration: none; text-overflow: unset; color: rgb(29, 155, 240);'
    parent.appendChild(linkToTweet);

    return newTweet;
  }

function populateTweets(tweetToClone, parentElement, likes) {
    console.log('tweetToClone:', tweetToClone);
    console.log('parentElement:', parentElement);

    let tweet_to_use = stringToHTML(basic_tweet);
    if (!tweetToClone){
        tweetToClone = tweet_to_use;
    }

    likes.forEach(like => {
        try {
            // Clone the existing tweet
            const newTweet = createTweetElement(tweetToClone, like, document);
            parentElement.appendChild(newTweet);
        } catch (error) {
            // Try base tweet
            const newTweet = createTweetElement(tweet_to_use, like, document);
            parentElement.appendChild(newTweet);
        }
    });

    // Update height of cells.
    const newTweets = parentElement.querySelectorAll('[data-testid="cellInnerDiv"]');

    let currentTranslateY = 0;

    newTweets.forEach((tweet, index) => {
        // Make sure they're a tweet
        if (!tweet.querySelector('[data-testid="tweet"]')) {
            return;
        }

        // Measure the height of the cell
        const tweetHeight = tweet.offsetHeight;
        
        // Set the translateY value
        tweet.style.transform = `translateY(${currentTranslateY}px)`;
        
        // Update the currentTranslateY for the next cell
        currentTranslateY += tweetHeight;
    });
}


function insertLikesTab() {
  // Select the tab list using the provided selector
  console.log('Inserting Likes tab');
  
  const tabList = document.querySelector('div[role="tablist"][data-testid="ScrollSnap-List"]');
  
  if (tabList) {
    const elements = document.querySelectorAll('span'); // Select all span elements
    let targetElement;

    elements.forEach(element => {
        if (element.textContent.trim() === 'Likes') {
            targetElement = element;
            return;
        }
    });

    if (targetElement) {
        return;
    }

    // Create the new "Likes" tab element
    const likesTab = document.createElement('div');
    likesTab.setAttribute('role', 'presentation');
    likesTab.classList.add('css-175oi2r', 'r-14tvyh0', 'r-cpa5s6', 'r-16y2uox');

    const likesLink = document.createElement('a');
    likesLink.href = "#likes";  // Update with actual link if needed
    likesLink.setAttribute('role', 'tab');
    likesLink.setAttribute('aria-selected', 'false');
    likesLink.classList.add('css-175oi2r', 'r-1awozwy', 'r-6koalj', 'r-eqz5dr', 'r-16y2uox', 'r-1h3ijdo', 'r-1777fci', 'r-s8bhmr', 'r-1c4vpko', 'r-1c7gwzm', 'r-o7ynqc', 'r-6416eg', 'r-1ny4l3l', 'r-1loqt21');
    // Add the hoverable class to the "Likes" tab
    likesLink.classList.add('r-1re7ezh', 'r-1loqt21', 'r-1q142lx', 'r-1qd0xha', 'r-a023e6', 'r-16dba41', 'r-1h0z5md', 'r-417010');

    // Add event listener to apply the selected styles and show spinner when clicked
    likesLink.addEventListener('click', () => {
        // Only allow it to be clicked once
        if (likesLink.getAttribute('aria-selected') === 'true') {
            return;
        }
        
        toggleInterception(true);
        // Remove the selected state from any currently selected tab
        const selectedTab = document.querySelector('a[aria-selected="true"]');
        if (selectedTab) {
            selectedTab.setAttribute('aria-selected', 'false');
            const indicator = selectedTab.querySelector('div[style*="background-color"]');
            if (indicator) {
            indicator.remove();
            }
            // Set the text color back to grey
            const selectedText = selectedTab.querySelector('span');
            if (selectedText) {
            selectedText.style.color = 'rgb(113, 118, 123)';
            }
        }
        // Set the "Likes" tab as selected
        likesLink.setAttribute('aria-selected', 'true');

        // Add the selected indicator
        const indicator = document.createElement('div');
        indicator.classList.add('css-175oi2r', 'r-xoduu5', 'r-1kihuf0', 'r-sdzlij', 'r-1p0dtai', 'r-hdaws3', 'r-s8bhmr', 'r-u8s1d', 'r-13qz1uu');
        indicator.style.backgroundColor = 'rgb(29, 155, 240)';
        likesLink.querySelector('div').appendChild(indicator);

        // Set the text color to white
        const likesText = likesLink.querySelector('span');
        if (likesText) {
            likesText.style.color = 'rgb(255, 255, 255)';
        }

        const elements = document.querySelectorAll('[data-testid="cellInnerDiv"]');
        const sections = document.querySelectorAll('section');

        let firstSection = null;
        sections.forEach(section => {
            // If we're on the media tab, check for <li role="listitem"> instead
            if (window.location.href.includes('media')) {
                console.log('Searching media tab')
                if (section.querySelector('li[role="listitem"]')) {
                    if (firstSection === null) {
                        firstSection = section;
                    }
                }
            } else {
                if (section.querySelector('[data-testid="tweet"]')) {
                    if (firstSection === null) {
                        firstSection = section;
                    }
                }
            }
        });

        let tweetToClone = null;
        elements.forEach(element => {
            // Check and make sure it's a tweet
            if (element.querySelector('[data-testid="tweet"]')) {
                if (tweetToClone === null) {
                    tweetToClone = element.cloneNode(true);
                }
                element.remove();
            } 
        });
        
        const parentElement = firstSection.parentElement;
        parentElement.removeChild(firstSection);
        const newSection = document.createElement('div');
        parentElement.appendChild(newSection);

        // Get user thats logged in
        const profileElement = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
        //const userHandle = profileElement.href.split('/').pop();
        const userId = getUserId(document);
        const tempSpans = findElementWithMatchingText(document.querySelector('[data-testid="UserName"]'), '@', 'SPAN');
        const userHandle = tempSpans[0].textContent.split('@').pop();

        // Send message to background script to get likes
        chrome.runtime.sendMessage(
            {
                action: "getLikes",
                logged_in_user: userId,
                requested_user: userHandle
            },
            (response) => {
                if (response.success) {
                    console.log('Likes fetched:', response.data);
                    if (typeof response.data === 'string') {
                        // Display error message
                        const errorMessage = document.createElement('div');
                        // Add some styles to the error message
                        errorMessage.style.color = 'white';
                        errorMessage.style.backgroundColor = '#ff4d4d'; // Light red background
                        errorMessage.style.padding = '10px';
                        errorMessage.style.marginTop = '10px';
                        errorMessage.style.borderRadius = '5px';
                        errorMessage.style.textAlign = 'center';
                        errorMessage.style.fontWeight = 'bold';
                        errorMessage.style.fontSize = '16px';

                        //Hyperlink any urls
                        const linkedText = response.data.replace(/(https:\/\/\S+)/g, '<a href="$1" target="_blank" style="text-decoration: none; text-overflow: unset; color: rgb(29, 155, 240);">$1</a>');
                        errorMessage.innerHTML = linkedText;
                        console.log(errorMessage)

                        newSection.appendChild(errorMessage);

                    } else {
                        populateTweets(tweetToClone, newSection, response.data);
                    }
                } else {
                    console.log('Error fetching likes:', response.error);
                }
            }
        );

    });

    const likesDiv = document.createElement('div');
    likesDiv.classList.add('css-175oi2r');

    const likesInnerDiv = document.createElement('div');
    likesInnerDiv.setAttribute('dir', 'ltr');
    likesInnerDiv.classList.add('css-146c3p1', 'r-bcqeeo', 'r-1ttztb7', 'r-qvutc0', 'r-37j5jr', 'r-a023e6', 'r-rjixqe', 'r-majxgm', 'r-1awozwy', 'r-6koalj', 'r-18u37iz', 'r-1pi2tsx', 'r-1777fci', 'r-1l7z4oj', 'r-95jzfe', 'r-bnwqim');
    likesInnerDiv.style.textOverflow = 'unset';
    likesInnerDiv.style.color = 'rgb(113, 118, 123)';

    const likesSpan = document.createElement('span');
    likesSpan.classList.add('css-1jxf684', 'r-bcqeeo', 'r-1ttztb7', 'r-qvutc0', 'r-poiln3');
    likesSpan.style.textOverflow = 'unset';
    likesSpan.textContent = 'Likes';

    likesInnerDiv.appendChild(likesSpan);
    likesDiv.appendChild(likesInnerDiv);
    likesLink.appendChild(likesDiv);
    likesTab.appendChild(likesLink);

    // Insert the "Likes" tab at the end of the tab list
    tabList.appendChild(likesTab);

    // Add an event listener to Posts to send to /userHandle
    // Fix, this currently takes two clicks
    for (let i = 0; i < tabList.children.length; i++) {
        // Make sure its not the likes tab
        if(tabList.children[i].textContent === 'Likes'){
            continue;
        }
        tabList.children[i].addEventListener('click', () => {
            toggleInterception(false);
            const destination = tabList.children[i].querySelector('a').href;
            window.location.href = destination;
        });
    };
  }
}

function toggleInterception(enable) {
    chrome.runtime.sendMessage({ action: "toggleInterception", enable: enable }, response => {
        if (response.intercepting) {
            console.log("Interception enabled");
        } else {
            console.log("Interception disabled");
        }
    });
}


function waitForElement(selector, callback) {    
    const element = document.querySelector(selector);
    if (element) {
        console.log(`Element found immediately: ${selector}`);
        callback(element);
        return;
    }

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            const nodes = Array.from(mutation.addedNodes);
            for (let node of nodes) {
                if (node.nodeType === 1 && node.matches(selector)) {
                    observer.disconnect();
                    callback(node);
                    return;
                }
                // Check child nodes in case the element is deeply nested
                const nestedElement = node.querySelector(selector);
                if (nestedElement) {
                    observer.disconnect();
                    callback(nestedElement);
                    return;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log(`Waiting for element: ${selector}`);
}


function init() {
    toggleInterception(false);
    loadArticles().then(() => {
        waitForTablist();
    });

    // Add event listener for popstate to handle back navigation
    window.addEventListener('popstate', () => {
        console.log('Detected back navigation');
        waitForTablist();
    });
}

function waitForTablist() {
    const maxRetries = 10;
    let retries = 0;

    function checkForTablist() {
        const tablist = document.querySelector('[role="tablist"]');
        if (tablist) {
            insertLikesTab();
        } else if (retries < maxRetries) {
            retries++;
            setTimeout(checkForTablist, 500); // Retry after 500ms
        } else {
            console.log('Tablist element not found after max retries');
        }
    }

    checkForTablist();
}

function observeTablist() {
    const observer = new MutationObserver((mutations, observer) => {
        mutations.forEach(mutation => {
            console.log('Mutation:', mutation.type, mutation.target)
            if (mutation.type === 'childList') {
                const tablist = document.querySelector('[role="tablist"]');
                if (tablist) {
                    // Element is now available
                    insertLikesTab();
                    //observer.disconnect(); // Stop observing once the element is found
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the element is already available
    const tablist = document.querySelector('[role="tablist"]');
    if (tablist) {
        insertLikesTab();
        //observer.disconnect();
    }
}

// Call the init function
init();
