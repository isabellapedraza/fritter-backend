// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'create-nest': createNest,
  'view-nests-by-creator': viewNestsByCreator,
  'view-nest-members': viewNestMembers,
  'view-nest-posts': viewNestPosts,
  'delete-nest': deleteNest,
  'edit-nest-posts': editNestPosts,
  'edit-nest-members': editNestMembers,
  'create-time': createTime,
  'view-times-by-creator': viewTimesByCreator,
  'view-times-by-group': viewTimesByGroup,
  'delete-time': deleteTime,
  'edit-time-startTime': editTimeStartTime,
  'edit-time-endTime': editTimeEndTime,
  'view-friends-by-user': viewFriendsByUser,
  'view-mutual-friends': viewMutualFriends,
  'view-suggested-friends': viewSuggestedFriends,
  'add-friend': addFriend,
  'remove-friend': removeFriend
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
