import topScoreApi from '../../../topscore-api-js';

function organizationForm(inputs) {
  return new Promise(function(resolve, reject) {

    if(!inputs) {
      resolve({
        name: null,
        topScoreApi: null,
        topScoreEvents: null,
        topScoreTeams: null,
        topScoreRegs: null
      });
    } else {

      const {name, topScoreUrl: url, topScoreUser: auth_token} = inputs;

      const nameResult = typeof name === 'string' && name.length > 0 ? true : false;

      // API -> events -> teams, registrations
      const apiPromise = topScoreApi.checkApiExists({url});

      const eventsPromise = apiPromise.then(exists => {
        if(exists) {
          return topScoreApi.getPage(url, topScoreApi.EVENTS, {per_page: 1, auth_token})
            .then(result => {
              const status = result.statusCode === 200;
              const event_id = status && result.body.result[0].id;
              return {
                status,
                event_id,
              }
            });
        } else {
          return null;
        }
      }).catch(error => {
        if('' + error.status.startsWith(4)) {
          return false;
        }
        throw error
      });

      const teamsPromise = eventsPromise.then(result => {
        if(result && result.status) {
          return topScoreApi.getPage(url, topScoreApi.TEAMS, {per_page: 1, event_id: result.event_id, auth_token})
            .then(result => result.status);
        } else {
          return null;
        }
      }).catch(error => {
        if(error.status === 403) {
          return false;
        }
        throw error
      });

      const registrationsPromise = eventsPromise.then(result => {
        if(result && result.status) {
          return topScoreApi.getPage(url, topScoreApi.REGISTRATIONS, {per_page: 1, event_id: result.event_id, auth_token})
            .then(result => result.status);
        } else {
          return null;
        }
      }).catch(error => {
        if(error.status === 403) {
          return false;
        }
        throw error
      });

      return Promise.all([apiPromise, eventsPromise, teamsPromise, registrationsPromise])
        .then(resultsAry => {
          const [api, events, teams, registrations] = resultsAry;
          const valid = api && events && events.status && teams === 200 && registrations === 200;
          resolve({
            valid,
            reasons: {
              name: nameResult,
              topScoreApi: api,
              topScoreEvents: events && events.status,
              topScoreTeams: teams === 200,
              topScoreRegs: registrations === 200,
            },
          });
        })
        .catch(error => {
          if(__DEBUG__) {
            console.log("Validator newOrganization error: ", error);
          }
        });

    }

  });
}

export default {organizationForm};