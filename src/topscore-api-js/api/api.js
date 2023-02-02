import Promise from 'promise';
import request from 'superagent';
import Throttle from './throttle';

const throttle = Throttle(1000);

const HELP = '/api/help';
const EVENTS = '/api/events';
const TEAMS = '/api/teams';
const REGISTRATIONS = '/api/registrations';

// Utility functions ////////////////////////////////////

function buildUrl(url, endpoint) {
  return `https://${url}${endpoint}`;
}

function getPage(url, endpoint, queryParams = {}) {
  const {page = 1, ...restParams} = queryParams;
  return throttle.enqueue()
    .then(function() {
      return new Promise(function(resolve, reject) {
        request
          .get(buildUrl(url, endpoint))
          .query({page, ...restParams})
          .end(function(err, response){
            if(err) {
              reject(response);
            } else {
              resolve(response);
            }
          });
      });
  });
}

function getPageRecursive(soFar, url, endpoint, queryParams, page) {
  return getPage(url, endpoint, {...queryParams, page})
    .then(response => {
      const {status, count, result} = response.body;
      if(status != "200") {
        throw('Bad request error', response);
      } else {
        soFar = [...soFar, ...result];
        if(soFar.length < count) {
          return getPageRecursive(soFar, url, endpoint, queryParams, page + 1);
        } else {
          return Promise.resolve(soFar);
        }
      }
    })
    .catch(response => {
      console.log('something failed!', response);
    });
}

function getAllItems(endpoint, options) {
  const {url, queryParams} = options;
  return getPageRecursive([], url, endpoint, queryParams, 1);
}

function findItem(endpoint, query, options) {

  const {url, queryParams} = options;

  return getAllItems(endpoint, options)
    .then(results => {
      const foundItem = results.find(result => {
        let found = true;
        Object.keys(query).forEach(key => {
          if(result[key] !== query[key]) {
            found = false;
          }
        });
        return found;
      });
      const itemType = !foundItem ? 'item' : foundItem.model;
      return Promise.resolve({...options, [itemType]: foundItem});
    });
}

// Given the item endpoint, the item value, and user's auth-key and auth-secret
// will calculate the POST request parameters including auth_token and auth_csrf.
// Returns a promise.
function updateItem(endpoint, item, options) {

  const {url, queryParams} = options;

  const itemString = Object.keys(item).reduce((soFar, key) => `${soFar}&${key}=${item[key]}`, '').slice(1);

  return throttle.enqueue()
    .then(function() {
      return new Promise(function(resolve, reject) {
        request
          .post(buildUrl(url, endpoint))
          .query(queryParams)
          .set({'content-type': 'application/x-www-form-urlencoded'})
          .send(itemString)
          .end(function(err, response){
            if(err) {
              reject(response);
            } else {
              resolve(response);
            }
          });
      });
  });
}

// Externally exposed functions /////////////////////////

function checkApiExists(options) {
  const {url, ...queryParams} = options;
  return getPage(url, HELP, queryParams)
    .then(result => {
      return result.status === 200;
    })
    .catch(result => false);
}

function queryEvent(options) {

  const {name} = options;

  return findItem('/api/events', {name}, options)
    .then(result => {
      if(result.event) {
        const {event: {id: event_id}} = result;
        const {queryParams} = options;
        return Promise.resolve({...result, ...options, queryParams: {...queryParams, event_id}});
      } else {
        throw('Unable to find event', result);
      }
    })
    .then(result => {
      const teamPromise = getAllItems('/api/teams', result);
      const registrationPromise = getAllItems('/api/registrations', result);
      return Promise.all([teamPromise, registrationPromise])
        .then((response) => {
          const [teams, registrations] = response;
          return Promise.resolve({
            ...result,
            teams,
            registrations,
          });
        });
    });
}

function queryEvents(options) {

  return getAllItems(EVENTS, options)
    .then(events => {
      const {queryParams, ...otherOptions} = options;
      return Promise.resolve({events, ...otherOptions, queryParams});
    });
}

// Require {queryParams: {api_csrf, auth_token}} option
function updatePlayerTeam(options) {

  let promiseChain = Promise.resolve();

  const {registrationId: id, teamId: team_id, roles, ...otherOptions} = options;

  return updateItem(`${REGISTRATIONS}/edit`, {
    id,
    team_id,
  }, otherOptions);
}

// Require {queryParams: {api_csrf, auth_token}} option
function batchUpdatePlayerTeam(options) {

  let promiseChain = Promise.resolve();

  const {registrationIds: ids, teamId: team_id, roles, ...otherOptions} = options;

  otherOptions.queryParams.batch_action = 'setTeam';

  return updateItem(`${REGISTRATIONS}/batch`, {
    ids,
    team_id,
  }, otherOptions);
}

/////////////////////////////////////////////////////////////////

export default {

  checkApiExists, // Functions
  getPage,
  queryEvent,
  queryEvents,
  updatePlayerTeam,
  batchUpdatePlayerTeam,
  getAllItems,

  HELP,  // Constants
  EVENTS,
  TEAMS,
  REGISTRATIONS,

}
