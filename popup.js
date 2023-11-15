// popup.js
let allRows = [];

function createTableHeader(headerNames) {
  let headerRow = document.createElement('tr');
  headerRow.classList.add('tlc-report-viewer');
  headerNames.forEach(text => {
    let th = document.createElement('th');
    th.classList.add('tlc-report-viewer');
    th.style.whiteSpace = 'nowrap';

    // Create the filter input
    let filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = 'Matches...';
    filterInput.addEventListener('input', function() {
      filterTable();
    });

    // Create the sort selector
    let sortSelector = document.createElement('select');
    let defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Sort Order';
    sortSelector.add(defaultOption);
    let ascOption = document.createElement('option');
    ascOption.value = 'asc';
    ascOption.text = 'Ascending';
    sortSelector.add(ascOption);
    let descOption = document.createElement('option');
    descOption.value = 'desc';
    descOption.text = 'Descending';
    sortSelector.add(descOption);
    sortSelector.addEventListener('change', function() {
      // Clear/reset the value/state of other selectors before applying the sort
      headerRow.querySelectorAll('select').forEach(otherSelector => {
        if (otherSelector !== sortSelector) {
          otherSelector.value = '';
        }
      });
      filterTable();
      sortTable([...headerRow.children].indexOf(th), this.value);
    });
    th.appendChild(document.createTextNode(text));
    th.appendChild(document.createElement('br'));
    th.appendChild(filterInput);
    th.appendChild(sortSelector);

    headerRow.appendChild(th);
  });
  return headerRow;
}

document.getElementById('continue-button').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: 'get_data'}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      // Store the original data in allRows
      allRows = response;

      // Clear the popup
      document.body.innerHTML = '';

      // Create a table
      let table = document.createElement('table');
      table.classList.add('tlc-report-viewer'); // Add the class "tlc-report-viewer" to the table element


      // Create the table header
      let headerRow = createTableHeader(['Name', 'Role', 'Troop Name', 'City']);
      let thead = document.createElement('thead');
      thead.classList.add('tlc-report-viewer');
    
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create the table body
      let tbody = document.createElement('tbody');
      tbody.classList.add('tlc-report-viewer');

      // add rows to the table body
      response.forEach(rowData => {
        let row = document.createElement('tr');
        row.classList.add('tlc-report-viewer');
        ['name', 'role', 'troopName', 'troopCity'].forEach(key => {
          let td = document.createElement('td');
          td.classList.add('tlc-report-viewer');
          if (key === 'name') {
            let link = document.createElement('a');
            link.href = rowData.profileLink;
            link.textContent = rowData[key];
            td.appendChild(link);
          } else if (key === 'troopName') {
            let link = document.createElement('a');
            link.href = rowData.troopLink;
            link.textContent = rowData[key];
            td.appendChild(link);
          } else {
            td.textContent = rowData[key];
          }
          td.style.whiteSpace = 'nowrap';
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);

      // Add event listeners to filter inputs and sort selectors
      headerRow.querySelectorAll('input[type="text"]').forEach(filterInput => {
        filterInput.addEventListener('input', function() {
          filterTable();
          sortTable();
        });
      });
      headerRow.querySelectorAll('select').forEach(sortSelector => {
        sortSelector.addEventListener('change', function() {
          // Clear/reset the value/state of other selectors before applying the sort
          headerRow.querySelectorAll('select').forEach(otherSelector => {
            if (otherSelector !== sortSelector) {
              otherSelector.value = '';
            }
          });
          filterTable();
          sortTable([...headerRow.children].indexOf(sortSelector.parentNode), this.value);
        });
      });

      // Create the download button
      let downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download CSV';
      downloadButton.addEventListener('click', function() {
        // Convert the filtered table to CSV format
        let csv = 'Name,Profile Link,Role,Troop Name,Troop Link,City\n';
        let filteredRows = Array.from(tbody.querySelectorAll('tr'));
        filteredRows.forEach(row => {
          let rowData = {
            name: row.querySelectorAll('td')[0].textContent,
            profileLink: row.querySelectorAll('td a')[0].href,
            role: row.querySelectorAll('td')[1].textContent,
            troopName: row.querySelectorAll('td')[2].textContent,
            troopLink: row.querySelectorAll('td a')[1].href,
            city: row.querySelectorAll('td')[3].textContent
          };
          csv += `"${rowData.name}","${rowData.profileLink}","${rowData.role}","${rowData.troopName}","${rowData.troopLink}","${rowData.city}"\n`;
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

      // Function to filter and sort the table based on all filter inputs and sort selectors
      function filterTable() {
        let filterInputs = headerRow.querySelectorAll('input[type="text"]');
        let rows = allRows.filter(rowData => {
          let shouldDisplay = true;
          filterInputs.forEach((filterInput, index) => {
            let filterValue = filterInput.value.toLowerCase();
            if (filterValue.length >= 2) { // Only filter if at least two characters have been entered
              let cellValue = rowData[['name', 'role', 'troopName', 'troopCity'][index]].toLowerCase();
              if (!cellValue.includes(filterValue)) {
                shouldDisplay = false;
              }
            }
          });
          return shouldDisplay;
        });
        tbody.innerHTML = '';
        rows.forEach(rowData => {
          let row = document.createElement('tr');
          row.classList.add('tlc-report-viewer');
          ['name', 'role', 'troopName', 'troopCity'].forEach(key => {
            let td = document.createElement('td');
            td.classList.add('tlc-report-viewer');
            if (key === 'name') {
              let link = document.createElement('a');
              link.href = rowData.profileLink;
              link.textContent = rowData[key];
              td.appendChild(link);
            } else if (key === 'troopName') {
              let link = document.createElement('a');
              link.href = rowData.troopLink;
              link.textContent = rowData[key];
              td.appendChild(link);
            } else {
              td.textContent = rowData[key];
            }
            td.style.whiteSpace = 'nowrap';
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        sortTable();
      }

      // Function to sort the table based on the selected column and sort order
      function sortTable(columnIndex, sortOrder) {
        let rows = Array.from(tbody.querySelectorAll('tr'));
        tbody.innerHTML = '';
        rows.sort(function(a, b) {
          let aCellValue = a.querySelectorAll('td')[columnIndex]?.textContent;
          let bCellValue = b.querySelectorAll('td')[columnIndex]?.textContent;
          if (sortOrder === 'asc') {
            return aCellValue.localeCompare(bCellValue);
          } else if (sortOrder === 'desc') {
            return bCellValue.localeCompare(aCellValue);
          } else {
            return 0;
          }
        });
        rows.forEach(row => {
          tbody.appendChild(row);
        });
      }

    });
  });
});
