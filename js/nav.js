"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $storyForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorites list on click on "favorites" */

function updateFavorites(evt) {
  console.debug("updateFavorites", evt);
  hidePageComponents();
  $favoriteStoriesList.empty();

  if (currentUser.favorites.length === 0){
    $favoriteStoriesList.append('No favorites added!');
  } else {
    // loop through all of our favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
  }

  $favoriteStoriesList.show();
}

$navFavorites.on("click", updateFavorites);

/** Show my stories list on click on "my stories" */

function updateMyStories(evt) {
  console.debug("updateMyStories", evt);
  hidePageComponents();
  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0){
    $myStoriesList.append('No stories added by user yet!');
  } else {
    // loop through all of our own stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story, true);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}

$navMyStories.on("click", updateMyStories);

