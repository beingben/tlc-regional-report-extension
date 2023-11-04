// popup.js
document.getElementById('continue-button').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: 'get_data'}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      // Clear the popup
      document.body.innerHTML = '';

      // Create a table
      let table = document.createElement('table');
      let thead = document.createElement('thead');
      let tbody = document.createElement('tbody');

      // Create the table header
      let headerRow = document.createElement('tr');
      ['Name', 'Role', 'Troop Name', 'Troop City'].forEach(text => {
        let th = document.createElement('th');
        th.textContent = text;
        th.style.whiteSpace = 'nowrap';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create the table body
      response.forEach(rowData => {
        let row = document.createElement('tr');
        ['name', 'role', 'troopName', 'troopCity'].forEach(key => {
          let td = document.createElement('td');
          if (key === 'name') {
            let a = document.createElement('a');
            a.href = rowData["profileLink"];
            a.innerText = rowData[key];
            a.target = '_blank'; // Add this line to open the link in a new tab
            td.appendChild(a);
          } else if (key === 'troopName') {
            let a = document.createElement('a');
            a.href = rowData["troopLink"];
            a.innerText = rowData[key];
            a.target = '_blank'; // Add this line to open the link in a new tab
            td.appendChild(a);
          } else {
            td.textContent = rowData[key];
          }
          td.style.whiteSpace = 'nowrap';
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);

      // Create the download button
      let downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download CSV';
      downloadButton.addEventListener('click', function() {
        // Convert the table to CSV format
        let csv = 'Name,Profile link,Role,Troop Name,Troop Link,Troop City\n';
        response.forEach(rowData => {
          csv += `"${rowData.name}","${rowData.profileLink}","${rowData.role}","${rowData.troopName}","${rowData.troopLink}","${rowData.troopCity}"\n`;
        });

        // Download the CSV file
        let downloadLink = document.createElement('a');
        downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
        downloadLink.download = 'table.csv';
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
      document.body.appendChild(downloadButton);

      // Append the table to the body
      document.body.appendChild(table);

    });
  });
});