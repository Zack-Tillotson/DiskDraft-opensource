// Figured out which tabs this user can select between

const basicTabs = [
  'Players',
  'Teams',
  'Log',
  'Help',
];

const adminTabs = [
  'Dashboard',
];

export default function availableTabs(pipeline, action) {

  const {permissions} = pipeline;

  let tabs = basicTabs;

  if(permissions.isAdmin) {
    tabs = [...adminTabs, ...tabs];
  }

  return tabs;
}