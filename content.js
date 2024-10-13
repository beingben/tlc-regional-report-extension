// content.js

function extractAreaTroopMemberPageData() { 
  let table = document.querySelector('.table-basic.kv-grid-table.table.table-hover.table-striped.table-condensed');
  let rows = table.rows;
  let data = [];

  for (let i = 2; i < rows.length; i++) {
    
    let cells = rows[i].cells;
    let dataKeyCell = cells[0];
    let dataKey = dataKeyCell.querySelector('.kv-expanded-row').getAttribute('data-key');
    let name = cells[1].innerText;
    let profileLink = `https://www.traillifeconnect.com/profile/${dataKey}/overview`;

    let rolesCell = cells[4];
    let roles = new Set(); // Use a Set to keep track of unique roles

    // Check for span elements
    let spans = rolesCell.querySelectorAll('span');
    for (let j = 0; j < spans.length; j++) {
      if (j === 0) {
        role_texts = spans[j].innerText.split(',');
        for (let k = 0; k < role_texts.length; k++) {
          roles.add(role_texts[k]); // Use Set.add() to add unique roles
        }
      } else {
        roles.add(spans[j].innerText);
      }
    }

    // Check for img elements
    let imgs = rolesCell.querySelectorAll('img');
    imgs.forEach(img => {
      let roleTitles = img.getAttribute('data-original-title').split(',');
      roleTitles.forEach(title => {
        roles.add(title.trim());
      });
    });

    // Check for i elements
    let is = rolesCell.querySelectorAll('i');
    is.forEach(i => {
      let roleTitles = i.getAttribute('data-original-title').split('<br>');
      roles.add(roleTitles[0]);
    });

    let troopName = cells[7].innerText;
    let troopLink = cells[7].querySelector('a').href;
    let troopCity = cells[8].innerText;

    roles.forEach(role => { // Loop through the Set to add each unique role
      let rowData = {
        name: name,
        profileLink: profileLink,
        role: role.trim(),
        troopName: troopName,
        troopLink: troopLink,
        troopCity: troopCity
      };

      data.push(rowData);
    });
  }
  return data;
}

async function extractTroopStatusData() {
  try {
      await waitForElement('#w0-container table tbody');
  } catch (error) {
      console.error(error);
      return [];
  }

  let table = document.querySelector('#w0-container table');
  let tbody = table.querySelector('tbody');
  let rows = tbody.rows;
  let data = [];

  for (let i = 0; i < rows.length; i++) {
      let cells = rows[i].cells;
      let cellMap = {};
      for (let j = 0; j < cells.length; j++) {
          let dataColSeq = cells[j].getAttribute('data-col-seq');
          if (dataColSeq !== null) {
              cellMap[dataColSeq] = cells[j];
          }
      }

      // Debugging statements (you can uncomment these for troubleshooting)
      // console.log(`Row ${i} cellMap:`, cellMap);

      let dataKey = rows[i].getAttribute('data-key');

      let troopNumberCell = cellMap['1'];
      let statusCell = cellMap['2'];
      let dateCell = cellMap['3'];
      let stateCell = cellMap['4'];
      let countyCell = cellMap['5'];
      let cityCell = cellMap['6'];
      let addressCell = cellMap['7'];
      let areaCell = cellMap['9'];
      let numberOfMembersCell = cellMap['10'];
      let numberOfAdultsCell = cellMap['11'];
      let numberOfYouthCell = cellMap['12'];
      let percentageCell = cellMap['13'];

      // Safely access innerText with fallback to empty string
      let troopNumber = '';
      if (troopNumberCell) {
          troopNumber = troopNumberCell.innerText ? troopNumberCell.innerText.trim() : '';
          if (!troopNumber) {
              // Try getting text from child elements
              let link = troopNumberCell.querySelector('a');
              troopNumber = link ? link.innerText.trim() : '';
          }
      }

      let status = statusCell ? statusCell.innerText.trim() : '';
      let date = dateCell ? dateCell.innerText.trim() : '';
      let state = stateCell ? stateCell.innerText.trim() : '';
      let county = countyCell ? countyCell.innerText.trim() : '';
      let city = cityCell ? cityCell.innerText.trim() : '';
      let address = addressCell ? addressCell.innerText.trim() : '';
      let area = areaCell ? areaCell.innerText.trim() : '';
      let numberOfMembers = numberOfMembersCell ? numberOfMembersCell.innerText.trim() : '';
      let numberOfAdults = numberOfAdultsCell ? numberOfAdultsCell.innerText.trim() : '';
      let numberOfYouth = numberOfYouthCell ? numberOfYouthCell.innerText.trim() : '';
      let percentage = percentageCell ? percentageCell.innerText.trim() : '';

      data.push({
          troopNumber: troopNumber,
          status: status,
          date: date,
          state: state,
          county: county,
          city: city,
          address: address,
          area: area,
          numberOfMembers: numberOfMembers,
          numberOfAdults: numberOfAdults,
          numberOfYouth: numberOfYouth,
          percentage: percentage
      });
  }
  return data;
}

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
      let timer = 0;
      const interval = 100;
      const checkExist = setInterval(() => {
          const element = document.querySelector(selector);
          timer += interval;
          if (element) {
              clearInterval(checkExist);
              resolve(element);
          } else if (timer >= timeout) {
              clearInterval(checkExist);
              reject(new Error("Element not found: " + selector));
          }
      }, interval);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'get_data') {

    let areaTroopMemberData = extractAreaTroopMemberPageData();
    sendResponse(areaTroopMemberData);

  } else if (request.message === 'get_regional_member_data') {

    let myRegionTeamData = extractMyRegionTeamData();
    sendResponse(myRegionTeamData);

  } else if (request.message === 'get_regional_team_data') {

    extractTroopStatusData().then((troopStatusData) => {
      sendResponse(troopStatusData);
    }).catch((error) => {
      console.error('Error in extractTroopStatusData:', error);
      sendResponse([]);
    });

    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});
