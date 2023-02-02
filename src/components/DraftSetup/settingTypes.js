export const defaultSettings = [

// Players ////////////
{
  id: 'removeUnaccepted',
  text: 'Remove nonaccepted players',
  detailText: 'Only include players with the "Accepted" status. This will remove "Waitlisted" and "Pending" registrations from the draft.',
  value: true,
  type: 'checkbox',
  location: 'players',
},

// Columns ///////////

// TODO Rethink adding these back in. Currently we're assuming vectors are being used and that it's going to come from the spreadsheet import.
// {
//   id: 'useVector',
//   text: 'Use player Vector column',
//   detailText: 'A player Vector is a measure of how good a player is, typically calculated by adding together other columns. E.g. Athleticism (0-5) + Skill (0-5) = Vector (0-10).',
//   value: false,
//   type: 'checkbox',
//   location: 'columns',
// }, {
//   id: 'vectorColumns',
//   text: 'What columns make up the vector?',
//   detailText: 'Select which columns should be combined to make up the Vector column.',
//   value: [],
//   type: 'multicolumn',
//   location: 'columns',
// }, 

// Security ////////////////
{
  id: 'hideHistory',
  text: 'Hide full history',
  detailText: 'Don\'t show the entire draft history, instead only show the last few selections.',
  value: true,
  type: 'checkbox',
  location: 'security',
}, 

// Draft Management 
{
  id: 'baggageVectorLimitDrafts',
  text: 'Require baggage to be drafted before lower vector players',
  detailText: 'Limit captains to only be able to draft players with a vector greater than any of their undrafted baggage\'s vectors.',
  value: true,
  type: 'checkbox',
  location: 'draftManagement',
}, {
  id: 'showDraftTimer',
  text: 'Show draft timer',
  detailText: 'A timer will be displayed after the draft starts which shows how long the captain has spent making a choice. If the next setting is selected the timer will count down to zero.',
  value: true,
  type: 'checkbox',
  location: 'draftManagement',
// }, {
//   id: 'limitDraftTime',
//   text: 'Limit Selection Time',
//   detailText: 'The time in seconds for a user to make a selection. Zero means unlimited time.',
//   value: 0,
//   type: 'range',
//   min: 0,
//   max: 600,
//   label: (value) => {
//     const mins = parseInt(value / 60);
//     const secs = value - mins * 60;
//     let ret = '';
//     if(mins) {
//       ret += `${mins} min`;
//     }
//     if(mins && secs) {
//       ret += ' ';
//     }
//     if(secs) {
//       ret += `${secs} sec`
//     }
//     if(!ret) {
//       ret = '0 sec';
//     }
//     return ret;
//   },
//   location: 'draftManagement',
}, {
  id: 'useSnakeOrder',
  text: 'Use "snake" draft ordering',
  detailText: 'Captains draft in an order where every other round is in reverse order. e.g. The last captain in the first round will draft first in the second.',
  value: true,
  type: 'checkbox',
  location: 'draftManagement',
}, {
  id: 'allowCaptainSelect',
  text: 'Allow captains to select drafts',
  detailText: 'Captains who have selected a team can see a "draft" button and are able to select players.',
  value: true,
  type: 'checkbox',
  location: 'draftManagement',
}];

export default defaultSettings;

// Maximum men
// Maximum women
// Allow captains to request drafts
// Allow captains to confirm drafts