"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // initial value of showStar will be true  
  // ?? Don't understand this line of code. 
  // Why do you have to create a Boolean for showStar?
  const showStar = Boolean(currentUser);

  return $(`
    <li id="${story.storyId}">
      ${deleteBtn ? deleteBtnHTML() : ""}
      ${showStar ? getFavoriteHTML(story, currentUser) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

/** Add delete button to remove from own stories. */
function deleteBtnHTML(){
  return `
  <span class="trash-can">
    <i class="fa fa-trash" aria-hidden="true"></i>
  </span>
  `;
}

/** Color star or not for favorite story. */
function getFavoriteHTML(story, user){
  const isFavorite = user.isFavorite(story); /** Will return true or false, whether to color star or not */
  const starType = isFavorite ? "fas" : "far";
  return `
  <span class="star">
    <i class = "${starType} fa-star"></i>
  </span>
  `;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Write a function in stories.js that is called when users submit the form. 
// Pick a good name for it. 
// This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.
async function submitStory(evt) {
  console.debug("submitStory", evt);
  evt.preventDefault();

  // grab the author, title, and url from the story form 
  const author = $("#author-name").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  
  const story = await storyList.addStory(currentUser, {title, author, url});
  const $story = generateStoryMarkup(story);

  $allStoriesList.append($story);

  $storyForm.trigger("reset");
}

$storyForm.on("submit", submitStory);


// This function should get the data from the form, call the .addFavoriteStory method you wrote, and then put that new story on the page.

async function starFavoriteStory(evt){
  console.debug("starFavoriteStory", evt);
  let $closestLi = $(evt.target).closest("li");
  let $favoriteId = $closestLi[0].id;

  const story = storyList.stories.find(s => s.storyId === $favoriteId);

  if ($(evt.target).hasClass("fas")){
    await currentUser.removeFavoriteStory(story);
    $(evt.target).closest("i").toggleClass("fas far");
  } 
  else {
    await currentUser.addFavoriteStory(story);
    $(evt.target).closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click", ".fa-star", starFavoriteStory);
$favoriteStoriesList.on("click", ".fa-star", starFavoriteStory);
$myStoriesList.on("click", ".fa-star", starFavoriteStory);

// Part 4: Removing Stories
// Allow logged in users to remove a story. 
// Once a story has been deleted, 
// remove it from the DOM and let the API know its been deleted.

async function deleteStory(evt){
  console.debug("removeStoryDOM");
  const $closestLi = $(evt.target).closest("li");

  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await updateMyStories();
}

$myStoriesList.on("click", ".fa-trash", deleteStory);