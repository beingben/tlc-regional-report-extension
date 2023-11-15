// content.js

// Function to extract data from the other page
function extractMyToopsData() {
  // Add your code here to extract data from the other page
}

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
        roles.add(...spans[j].innerText.split(',')); // Use Set.add() to add unique roles
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'get_data') {

    let areaTroopMemberData = extractAreaTroopMemberPageData();
    sendResponse(areaTroopMemberData);

  } else if (request.message === 'get_other_data') {
    // Call the function to extract data from the other page
    let myToopsData = extractMyToopsData();

    sendResponse(myToopsData);
  }
});