// content.js

// Function to extract data from the "Area Troop Members" page
function extractAreaTroopMemberPageData() {
  let tbody = document.querySelector("tbody");
  if (!tbody) {
    console.error('No tbody found on the page.');
    return [];
  }
  let rows = tbody.rows;
  let data = [];

  // Loop through each row in the table body
  Array.from(rows).forEach(row => {
    let cells = row.cells;
    let dataKeyCell = cells[0];
    let kvExpandedRow = dataKeyCell.querySelector('.kv-expanded-row');
    if (!kvExpandedRow) return; // Skip if not found
    let dataKey = kvExpandedRow.getAttribute('data-key');
    let name = cells[1].innerText.trim();
    let profileLink = `https://www.traillifeconnect.com/profile/${dataKey}/overview`;

    // Extract roles
    let rolesCell = cells[4];
    let roles = extractRolesFromCell(rolesCell);

    // Extract troop information
    let troopName = cells[7].innerText.trim();
    let troopLinkElement = cells[7].querySelector('a');
    let troopLink = troopLinkElement ? troopLinkElement.href : '';
    let troopCity = cells[8].innerText.trim();

    // For each role, create a data entry
    roles.forEach(role => {
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
  });
  return data;
}

// Function to extract roles from a cell

function extractRolesFromCell(rolesCell) {
  let roles = new Set();
  let spans = rolesCell.querySelectorAll('span');
  spans.forEach(span => {
    let roleTexts = span.innerText.split(',');
    roleTexts.forEach(roleText => {
      roles.add(roleText.trim());
    });
  });

  let imgs = rolesCell.querySelectorAll('img');
  imgs.forEach(img => {
    let roleTitles = img.getAttribute('data-original-title').split(',');
    roleTitles.forEach(title => {
      roles.add(title.trim());
    });
  });

  let is = rolesCell.querySelectorAll('i');
  is.forEach(i => {
    let roleTitles = i.getAttribute('data-original-title').split('<br>');
    roles.add(roleTitles[0].trim());
  });

  return roles;
}

// Function to extract data from the "Area Leaders" page
async function extractAreaLeadersData() {
  // Wait for the table to be present
  await waitForElement('.table-basic', 10000);

  let tbody = document.querySelector("tbody");
  if (!tbody) {
    console.error('No tbody found on the page.');
    return [];
  }
  let rows = tbody.rows;
  let data = [];

  // Loop through each row in the table body
  Array.from(rows).forEach(row => {
    let dataKey = row.getAttribute('data-key');

    let cells = row.cells;

    // Extract Name
    let nameCell = cells[1];
    let nameSpan = nameCell.querySelector('span');
    let name = nameSpan ? nameSpan.innerText.trim() : '';

    // Construct Profile Link using data-key
    let profileLink = `https://www.traillifeconnect.com/profile/${dataKey}/overview`;

    // Extract Roles
    let rolesCell = cells[2];
    let roles = extractRolesFromCell(rolesCell);

    // Extract Email
    let email = '';
    // The email is within the expanded content
    let expandedContent = row.querySelector('.kv-expanded-row');
    if (expandedContent) {
      let emailSpan = expandedContent.querySelector(`span#copyEmail-${dataKey}`);
      if (emailSpan) {
        email = emailSpan.textContent.trim();
      }
    }

    // Extract Expiration Date
    let expirationDateCell = cells[4]; // Adjust index based on table structure
    let expirationDate = '';
    if (expirationDateCell) {
      let dateSpan = expirationDateCell.querySelector('span > i');
      expirationDate = dateSpan ? dateSpan.innerText.trim() : '';
    }

    // For each role, create a data entry
    if (roles.size === 0) {
      data.push({
        name: name,
        profileLink: profileLink,
        role: '',
        email: email,
        expirationDate: expirationDate
      });
    } else {
      roles.forEach(role => {
        data.push({
          name: name,
          profileLink: profileLink,
          role: role,
          email: email,
          expirationDate: expirationDate
        });
      });
    }
  });

  return data;
}

// Function to extract data from the "Troop Status" page
async function extractTroopStatusData() {
  try {
    await waitForElement('#w0-container table tbody');
  } catch (error) {
    console.error(error);
    return [];
  }

  let table = document.querySelector('#w0-container table');
  let rows = table.rows;
  let data = [];

  // Loop through each row in the table
  Array.from(rows).forEach(row => {
    let cells = row.cells;
    let cellMap = {};
    for (let j = 0; j < cells.length; j++) {
      let dataColSeq = cells[j].getAttribute('data-col-seq');
      if (dataColSeq !== null) {
        cellMap[dataColSeq] = cells[j];
      }
    }

    let dataKey = row.getAttribute('data-key');

    // Map the cells to their respective columns
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

    // Extract data from cells
    let troopNumber = '';
    if (troopNumberCell) {
      troopNumber = troopNumberCell.innerText ? troopNumberCell.innerText.trim() : '';
      if (!troopNumber) {
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
  });

  return data;
}

// Utility function to wait for an element to be present in the DOM
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

// Message listener to communicate with popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Content script received message:', request.message);

  if (request.message === 'get_troop_members') {
    // Extract troop member data
    let data = extractAreaTroopMemberPageData();
    sendResponse(data);

  } else if (request.message === 'get_area_leaders') {
    // Extract area leaders data
    extractAreaLeadersData().then((data) => {
      sendResponse(data);
    }).catch((error) => {
      console.error('Error extracting area leaders data:', error);
      sendResponse([]);
    });
    return true; // Indicates an asynchronous response

  } else if (request.message === 'get_regional_troop_data') {
    // Extract regional troop data
    extractTroopStatusData().then((data) => {
      sendResponse(data);
    }).catch((error) => {
      console.error('Error extracting regional troop data:', error);
      sendResponse([]);
    });
    return true; // Indicates an asynchronous response
  }
});
