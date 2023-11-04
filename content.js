// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'get_data') {
    let table = document.querySelector('.table-basic.kv-grid-table.table.table-hover.table-striped.table-condensed');
    let rows = table.rows;
    let data = [];

    for (let i = 2; i < rows.length; i++) {
      // if (i === 0) continue;
      // if (i === 1) continue;

      let cells = rows[i].cells;
      let dataKeyCell = cells[0];
      let dataKey = dataKeyCell.querySelector('.kv-expanded-row').getAttribute('data-key');
      let name = cells[1].innerText;
      let profileLink = `https://www.traillifeconnect.com/profile/${dataKey}/overview`;

      let rolesCell = cells[4];
      let roles = [];

      // Check for span elements
      let spans = rolesCell.querySelectorAll('span');
      for (let j = 0; j < spans.length; j++) {
        if (j === 0) {
          roles.push(...spans[j].innerText.split(','));
        } else {
          roles.push(spans[j].innerText);
        }
      }

      // Check for img elements
      let imgs = rolesCell.querySelectorAll('img');
      imgs.forEach(img => {
        let roleTitles = img.getAttribute('data-original-title').split(',');
        roleTitles.forEach(title => {
          roles.push(title.trim());
        });
      });

      // Check for i elements
      let is = rolesCell.querySelectorAll('i');
      is.forEach(i => {
        let roleTitles = i.getAttribute('data-original-title').split('<br>');
        roles.push(roleTitles[0]);
      });

      let troopName = cells[7].innerText;
      let troopLink = cells[7].querySelector('a').href;
      let troopCity = cells[8].innerText;

      for (let j = 0; j < roles.length; j++) {
        let rowData = {
          name: name,
          profileLink: profileLink,
          role: roles[j].trim(),
          troopName: troopName,
          troopLink: troopLink,
          troopCity: troopCity
        };

        data.push(rowData);
      }
    }

    sendResponse(data);
  }
});