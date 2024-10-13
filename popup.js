// popup.js
let allRows = [];

function createTableHeader(headerNames) {
  let headerRow = document.createElement("tr");
  headerRow.classList.add("tlc-report-viewer");
  headerNames.forEach((text) => {
    let th = document.createElement("th");
    th.classList.add("tlc-report-viewer");
    th.style.whiteSpace = "nowrap";

    // Create the filter input
    let filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.placeholder = "Matches...";
    th.appendChild(document.createTextNode(text));
    th.appendChild(document.createElement("br"));
    th.appendChild(filterInput);

    // Create the sort selector
    let sortSelector = document.createElement("select");
    let defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Sort Order";
    sortSelector.add(defaultOption);
    let ascOption = document.createElement("option");
    ascOption.value = "asc";
    ascOption.text = "Ascending";
    sortSelector.add(ascOption);
    let descOption = document.createElement("option");
    descOption.value = "desc";
    descOption.text = "Descending";
    sortSelector.add(descOption);
    th.appendChild(sortSelector);

    headerRow.appendChild(th);
  });
  return headerRow;
}

document.getElementById("troop-member-button").addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "get_data" }, function (response) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }

          // Store the original data in allRows
          allRows = response;

          // Clear the popup
          document.body.innerHTML = "";

          // Create a table
          let table = document.createElement("table");
          table.classList.add("tlc-report-viewer"); // Add the class "tlc-report-viewer" to the table element

          // Create the table header
          let headerNames = [
            "Name",
            "Role",
            "Troop Name",
            "City",
          ];
          let headerRow = createTableHeader(headerNames);
          let thead = document.createElement("thead");
          thead.classList.add("tlc-report-viewer");

          thead.appendChild(headerRow);
          table.appendChild(thead);

          // Create the table body
          let tbody = document.createElement("tbody");
          tbody.classList.add("tlc-report-viewer");

          // Function to render rows
          function renderRows(data) {
            tbody.innerHTML = "";
            data.forEach((rowData) => {
              let row = document.createElement("tr");
              row.classList.add("tlc-report-viewer");
              ["name", "role", "troopName", "troopCity"].forEach((key) => {
                let td = document.createElement("td");
                td.classList.add("tlc-report-viewer");
                if (key === "name") {
                  let link = document.createElement("a");
                  link.href = rowData.profileLink;
                  link.textContent = rowData[key];
                  td.appendChild(link);
                } else if (key === "troopName") {
                  let link = document.createElement("a");
                  link.href = rowData.troopLink;
                  link.textContent = rowData[key];
                  td.appendChild(link);
                } else {
                  td.textContent = rowData[key];
                }
                td.style.whiteSpace = "nowrap";
                row.appendChild(td);
              });
              tbody.appendChild(row);
            });
          }

          // Initial rendering of rows
          renderRows(allRows);
          table.appendChild(tbody);

          // Add event listeners to filter inputs and sort selectors
          let filterInputs = headerRow.querySelectorAll('input[type="text"]');
          let sortSelectors = headerRow.querySelectorAll("select");

          filterInputs.forEach((filterInput) => {
            filterInput.addEventListener("input", function () {
              filterTable();
            });
          });

          sortSelectors.forEach((sortSelector) => {
            sortSelector.addEventListener("change", function () {
              // Clear other sort selectors
              sortSelectors.forEach((otherSelector) => {
                if (otherSelector !== sortSelector) {
                  otherSelector.value = "";
                }
              });
              sortTable();
            });
          });

          // Append the table to the body
          document.body.appendChild(table);

          // Create the download button
          let downloadButton = document.createElement("button");
          downloadButton.textContent = "Download CSV";
          downloadButton.addEventListener("click", function () {
            // Convert the data to CSV
            let csv = headerNames.join(",") + "\n";
            let dataRows = Array.from(tbody.querySelectorAll("tr")).map((row) => {
              let cells = row.querySelectorAll("td");
              let nameLink = cells[0].querySelector("a");
              let troopLink = cells[2].querySelector("a");
              return `"${nameLink.textContent}","${nameLink.href}","${cells[1].textContent}","${troopLink.textContent}","${troopLink.href}","${cells[3].textContent}"`;
            });
            csv += dataRows.join("\n");
            // Download the CSV file
            let downloadLink = document.createElement("a");
            downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
            downloadLink.download = "table.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          });
          document.body.appendChild(downloadButton);

          // Function to filter the table based on filter inputs
          function filterTable() {
            let filteredRows = allRows.filter((rowData) => {
              return Array.from(filterInputs).every((filterInput, index) => {
                let filterValue = filterInput.value.toLowerCase();
                if (filterValue.length >= 2) {
                  let key = ["name", "role", "troopName", "troopCity"][index];
                  let cellValue = rowData[key]?.toString().toLowerCase() || '';
                  return cellValue.includes(filterValue);
                }
                return true;
              });
            });
            renderRows(filteredRows);
          }

          // Function to sort the table based on the selected column and sort order
          function sortTable() {
            let sortIndex = -1;
            let sortOrder = '';
            sortSelectors.forEach((sortSelector, index) => {
              if (sortSelector.value) {
                sortIndex = index;
                sortOrder = sortSelector.value;
              }
            });
            if (sortIndex >= 0 && sortOrder) {
              let key = ["name", "role", "troopName", "troopCity"][sortIndex];
              allRows.sort(function (a, b) {
                let aValue = a[key]?.toString().toLowerCase() || '';
                let bValue = b[key]?.toString().toLowerCase() || '';
                if (sortOrder === "asc") {
                  return aValue.localeCompare(bValue);
                } else if (sortOrder === "desc") {
                  return bValue.localeCompare(aValue);
                } else {
                  return 0;
                }
              });
              renderRows(allRows);
            }
          }

        },
      );
    });
  });

document.getElementById("regional-team-button").addEventListener("click", function () {
  // The URL to navigate to
  const url = "https://www.traillifeconnect.com/troops/status?_tog1149016d=all";
  
  // Navigate to the URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.update(tabs[0].id, { url: url }, function (tab) {
          // Listen for the tab to be fully loaded
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
              if (tabId == tab.id && info.status === 'complete') {
                  // Remove the listener to avoid future triggers
                  chrome.tabs.onUpdated.removeListener(listener);
                  // Now that the page is loaded, send a message to extract data
                  chrome.tabs.sendMessage(tabId, { message: "get_regional_team_data" }, function (response) {
                      // Handle the extracted data
                      handleRegionalTeamData(response);
                  });
              }
          });
      });
  });
});

function handleRegionalTeamData(response) {
  // Check if response is valid
  if (!response || !Array.isArray(response) || response.length === 0) {
      // Display a message if no data is returned
      document.body.innerHTML = "<p>No data was returned from the page.</p>";
      return;
  }

  // Store the original data in allRows
  allRows = response;

  // Clear the popup
  document.body.innerHTML = "";

  // Create a table
  let table = document.createElement("table");
  table.classList.add("tlc-report-viewer");

  // Create the table header
  let headerNames = [
      "Troop Number",
      "Status",
      "Date",
      "State",
      "County",
      "City",
      "Address",
      "Area",
      "Number of Members",
      "Number of Adults",
      "Number of Youth",
      "Percentage"
  ];
  let headerRow = createTableHeader(headerNames);

  let thead = document.createElement("thead");
  thead.classList.add("tlc-report-viewer");

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create the table body
  let tbody = document.createElement("tbody");
  tbody.classList.add("tlc-report-viewer");

  // Function to render rows
  function renderRows(data) {
      tbody.innerHTML = "";
      data.forEach((rowData) => {
          let row = document.createElement("tr");
          row.classList.add("tlc-report-viewer");
          [
              "troopNumber",
              "status",
              "date",
              "state",
              "county",
              "city",
              "address",
              "area",
              "numberOfMembers",
              "numberOfAdults",
              "numberOfYouth",
              "percentage"
          ].forEach((key) => {
              let td = document.createElement("td");
              td.classList.add("tlc-report-viewer");
              td.textContent = rowData[key];
              td.style.whiteSpace = "nowrap";
              row.appendChild(td);
          });
          tbody.appendChild(row);
      });
  }

  // Initial rendering of rows
  renderRows(allRows);
  table.appendChild(tbody);

  // Append the table to the body
  document.body.appendChild(table);

  // Add event listeners to filter inputs and sort selectors
  let filterInputs = headerRow.querySelectorAll('input[type="text"]');
  let sortSelectors = headerRow.querySelectorAll("select");

  filterInputs.forEach((filterInput) => {
    filterInput.addEventListener("input", function () {
      filterTable();
    });
  });

  sortSelectors.forEach((sortSelector) => {
    sortSelector.addEventListener("change", function () {
      // Clear other sort selectors
      sortSelectors.forEach((otherSelector) => {
        if (otherSelector !== sortSelector) {
          otherSelector.value = "";
        }
      });
      sortTable();
    });
  });

  // Function to filter the table based on filter inputs
  function filterTable() {
      let filteredRows = allRows.filter((rowData) => {
          return Array.from(filterInputs).every((filterInput, index) => {
              let filterValue = filterInput.value.toLowerCase();
              if (filterValue.length >= 2) {
                  let key = [
                      "troopNumber",
                      "status",
                      "date",
                      "state",
                      "county",
                      "city",
                      "address",
                      "area",
                      "numberOfMembers",
                      "numberOfAdults",
                      "numberOfYouth",
                      "percentage"
                  ][index];
                  let cellValue = rowData[key]?.toString().toLowerCase() || '';
                  return cellValue.includes(filterValue);
              }
              return true;
          });
      });
      renderRows(filteredRows);
  }

  // Function to sort the table based on the selected column and sort order
  function sortTable() {
      let sortIndex = -1;
      let sortOrder = '';
      sortSelectors.forEach((sortSelector, index) => {
        if (sortSelector.value) {
          sortIndex = index;
          sortOrder = sortSelector.value;
        }
      });
      if (sortIndex >= 0 && sortOrder) {
          let key = [
              "troopNumber",
              "status",
              "date",
              "state",
              "county",
              "city",
              "address",
              "area",
              "numberOfMembers",
              "numberOfAdults",
              "numberOfYouth",
              "percentage"
          ][sortIndex];

          allRows.sort(function (a, b) {
              let aValue = a[key]?.toString().toLowerCase() || '';
              let bValue = b[key]?.toString().toLowerCase() || '';

              // For numerical sorting
              if (!isNaN(aValue) && !isNaN(bValue)) {
                  aValue = parseFloat(aValue);
                  bValue = parseFloat(bValue);
              }

              if (sortOrder === "asc") {
                  return aValue > bValue ? 1 : -1;
              } else if (sortOrder === "desc") {
                  return aValue < bValue ? 1 : -1;
              } else {
                  return 0;
              }
          });
          renderRows(allRows);
      }
  }

  // Create the download button
  let downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.addEventListener("click", function () {
      // Convert the data to CSV
      let csv = headerNames.join(",") + "\n";
      let dataRows = Array.from(tbody.querySelectorAll("tr")).map((row) => {
          return Array.from(row.querySelectorAll("td")).map((td) => `"${td.textContent}"`).join(",");
      });
      csv += dataRows.join("\n");
      // Download the CSV file
      let downloadLink = document.createElement("a");
      downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      downloadLink.download = "troop_status_data.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  });
  document.body.appendChild(downloadButton);
}
