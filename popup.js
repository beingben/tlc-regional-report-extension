// popup.js

// Global variable to store data
let allRows = [];

// Function to create table headers with filters and sort options
function createTableHeader(headerNames) {
  let headerRow = document.createElement("tr");
  headerRow.classList.add("tlc-report-viewer");
  headerNames.forEach((text) => {
    let th = document.createElement("th");
    th.classList.add("tlc-report-viewer");
    th.style.position = "sticky";
    th.style.top = "0";
    th.style.backgroundColor = "#876338"; // Match header background color
    th.style.zIndex = "1"; // Ensure headers stay above content

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

// Function to show the instructions modal
function showInstructionsModal() {
  const modal = document.getElementById('instructionsModal');
  modal.style.display = 'block';

  const closeBtn = modal.querySelector('.close');
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Close the modal when the user clicks anywhere outside of it
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Event listener for "Load Troop Members" button
document.getElementById("troop-member-button").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const url = tab.url;

    if (url.includes("https://www.traillifeconnect.com/user/area-troop-members")) {
      // Send message to content script to get troop members
      chrome.tabs.sendMessage(tab.id, { message: "get_troop_members" }, function (response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
        }

        handleTroopMemberData(response);
      });
    } else {
      // Show the instructions modal
      showInstructionsModal();
    }
  });
});

// Event listener for "Load Area Leaders" button
document.getElementById("area-leaders-button").addEventListener("click", function () {
  const url = "https://www.traillifeconnect.com/user/leaders?_tog5317d374=all";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: url }, function (tab) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId == tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, { message: "get_area_leaders" }, function (response) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }
            handleAreaLeadersData(response);
          });
        }
      });
    });
  });
});

// Event listener for "Load Regional Troop Data" button
document.getElementById("regional-troop-button").addEventListener("click", function () {
  const url = "https://www.traillifeconnect.com/troops/status?_tog1149016d=all";

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.update(tabs[0].id, { url: url }, function (tab) {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId == tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.sendMessage(tabId, { message: "get_regional_troop_data" }, function (response) {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
              return;
            }
            handleRegionalTeamData(response);
          });
        }
      });
    });
  });
});

// Function to handle troop member data received from content script
function handleTroopMemberData(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    document.body.innerHTML = "<p>No data was returned from the page.</p>";
    return;
  }

  allRows = data;

  // Clear the popup content
  document.body.innerHTML = "";

  // Create the table headers
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

  // Create the table and append thead and tbody
  let table = document.createElement("table");
  table.classList.add("tlc-report-viewer");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the "Download CSV" button
  let downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.classList.add("download-button");

  downloadButton.addEventListener("click", function () {
    // Convert the data to CSV
    let csv = headerNames.join(",") + "\n";
    let dataRows = allRows.map((rowData) => {
      return [
        `"${rowData.name}"`,
        `"${rowData.role}"`,
        `"${rowData.troopName}"`,
        `"${rowData.troopCity}"`
      ].join(",");
    });
    csv += dataRows.join("\n");
    // Download the CSV file
    let downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadLink.download = "troop_members.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  // Create a container div to hold the download button and table
  let containerDiv = document.createElement("div");
  containerDiv.classList.add("tlc-container");

  // Create a table container div for scrolling
  let tableContainerDiv = document.createElement("div");
  tableContainerDiv.classList.add("tlc-table-container");

  tableContainerDiv.appendChild(table);

  containerDiv.appendChild(downloadButton);
  containerDiv.appendChild(tableContainerDiv);

  // Append the container to the body
  document.body.appendChild(containerDiv);

  // Add filtering and sorting functionality
  let filterInputs = headerRow.querySelectorAll('input[type="text"]');
  let sortSelectors = headerRow.querySelectorAll("select");

  filterInputs.forEach((filterInput) => {
    filterInput.addEventListener("input", function () {
      filterTable();
    });
  });

  sortSelectors.forEach((sortSelector) => {
    sortSelector.addEventListener("change", function () {
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
}

// Function to handle area leaders data received from content script
function handleAreaLeadersData(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    document.body.innerHTML = "<p>No data was returned from the page.</p>";
    return;
  }

  allRows = data;

  // Clear the popup content
  document.body.innerHTML = "";

  // Create the table headers
  let headerNames = [
    "Name",
    "Role",
    "Expiration Date",
    "Email"
  ];
  let headerRow = createTableHeader(headerNames);
  let thead = document.createElement("thead");
  thead.classList.add("tlc-report-viewer");

  thead.appendChild(headerRow);

  // Create the table body
  let tbody = document.createElement("tbody");
  tbody.classList.add("tlc-report-viewer");

  // Function to render rows
  function renderRows(data) {
    tbody.innerHTML = "";
    data.forEach((rowData) => {
      let row = document.createElement("tr");
      row.classList.add("tlc-report-viewer");
      ["name", "role", "expirationDate", "email"].forEach((key) => {
        let td = document.createElement("td");
        td.classList.add("tlc-report-viewer");
        if (key === "name") {
          let link = document.createElement("a");
          link.href = rowData.profileLink;
          link.textContent = rowData[key];
          td.appendChild(link);
        } else if (key === "email") {
          let emailLink = document.createElement("a");
          emailLink.href = `mailto:${rowData[key]}`;
          emailLink.textContent = rowData[key];
          td.appendChild(emailLink);
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

  // Create the table and append thead and tbody
  let table = document.createElement("table");
  table.classList.add("tlc-report-viewer");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the "Download CSV" button
  let downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.classList.add("download-button");

  downloadButton.addEventListener("click", function () {
    // Convert the data to CSV
    let csv = headerNames.join(",") + "\n";
    let dataRows = allRows.map((rowData) => {
      return [
        `"${rowData.name}"`,
        `"${rowData.role}"`,
        `"${rowData.expirationDate}"`,
        `"${rowData.email}"`
      ].join(",");
    });
    csv += dataRows.join("\n");
    // Download the CSV file
    let downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadLink.download = "area_leaders.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  // Create a container div to hold the download button and table
  let containerDiv = document.createElement("div");
  containerDiv.classList.add("tlc-container");

  // Create a table container div for scrolling
  let tableContainerDiv = document.createElement("div");
  tableContainerDiv.classList.add("tlc-table-container");

  tableContainerDiv.appendChild(table);

  containerDiv.appendChild(downloadButton);
  containerDiv.appendChild(tableContainerDiv);

  // Append the container to the body
  document.body.appendChild(containerDiv);

  // Add filtering and sorting functionality
  let filterInputs = headerRow.querySelectorAll('input[type="text"]');
  let sortSelectors = headerRow.querySelectorAll("select");

  filterInputs.forEach((filterInput) => {
    filterInput.addEventListener("input", function () {
      filterTable();
    });
  });

  sortSelectors.forEach((sortSelector) => {
    sortSelector.addEventListener("change", function () {
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
          let key = ["name", "role", "expirationDate", "email"][index];
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
      let key = ["name", "role", "expirationDate", "email"][sortIndex];

      allRows.sort(function (a, b) {
        let aValue = a[key]?.toString().toLowerCase() || '';
        let bValue = b[key]?.toString().toLowerCase() || '';

        if (key === "expirationDate") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
          if (sortOrder === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else {
          if (sortOrder === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });
      renderRows(allRows);
    }
  }
}

// Function to handle regional troop data received from content script
function handleRegionalTeamData(data) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    document.body.innerHTML = "<p>No data was returned from the page.</p>";
    return;
  }

  allRows = data;

  // Clear the popup content
  document.body.innerHTML = "";

  // Create the table headers
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

  // Create the table and append thead and tbody
  let table = document.createElement("table");
  table.classList.add("tlc-report-viewer");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create the "Download CSV" button
  let downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.classList.add("download-button");

  downloadButton.addEventListener("click", function () {
    // Convert the data to CSV
    let csv = headerNames.join(",") + "\n";
    let dataRows = allRows.map((rowData) => {
      return [
        `"${rowData.troopNumber}"`,
        `"${rowData.status}"`,
        `"${rowData.date}"`,
        `"${rowData.state}"`,
        `"${rowData.county}"`,
        `"${rowData.city}"`,
        `"${rowData.address}"`,
        `"${rowData.area}"`,
        `"${rowData.numberOfMembers}"`,
        `"${rowData.numberOfAdults}"`,
        `"${rowData.numberOfYouth}"`,
        `"${rowData.percentage}"`
      ].join(",");
    });
    csv += dataRows.join("\n");
    // Download the CSV file
    let downloadLink = document.createElement("a");
    downloadLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    downloadLink.download = "regional_troop_data.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });

  // Create a container div to hold the download button and table
  let containerDiv = document.createElement("div");
  containerDiv.classList.add("tlc-container");

  // Create a table container div for scrolling
  let tableContainerDiv = document.createElement("div");
  tableContainerDiv.classList.add("tlc-table-container");

  tableContainerDiv.appendChild(table);

  containerDiv.appendChild(downloadButton);
  containerDiv.appendChild(tableContainerDiv);

  // Append the container to the body
  document.body.appendChild(containerDiv);

  // Add filtering and sorting functionality
  let filterInputs = headerRow.querySelectorAll('input[type="text"]');
  let sortSelectors = headerRow.querySelectorAll("select");

  filterInputs.forEach((filterInput) => {
    filterInput.addEventListener("input", function () {
      filterTable();
    });
  });

  sortSelectors.forEach((sortSelector) => {
    sortSelector.addEventListener("change", function () {
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

        if (key === "date" || key === "percentage" || key.startsWith("numberOf")) {
          // For numerical or date sorting
          if (key === "date") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          } else {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
          }
          if (sortOrder === "asc") {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        } else {
          if (sortOrder === "asc") {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });
      renderRows(allRows);
    }
  }
}
