/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFriendsByUser(fields) {
  fetch(`/api/friends?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewMutualFriends(fields) {
  fetch(`/api/friends/mutual?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewSuggestedFriends(fields) {
  fetch(`/api/friends/suggested?user=${fields.user}`)
    .then(showResponse)
    .catch(showResponse);
}

function addFriend(fields) {
  fetch('/api/friends', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function removeFriend(fields) {
  fetch('/api/friends', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
