# TLC Regional Report Viewer

## Overview

The TLC Regional Report Viewer is a Chrome extension designed to streamline the extraction and downloading of information from Trail Life Connect (TLC) in CSV format. This extension allows users to utilize the website's existing filtering capabilities to obtain specific data, including names, roles, troop information, and more from various pages within TLC. It supports multiple pages, including:

- **Area Troop Members**: Extract data on troop members with customizable filters.
- **Area Leaders**: Obtain information on area leaders, including contact details and roles.
- **Troop Status**: Access regional troop data, membership numbers, and status updates.

This Chrome extension ensures that private information is only visible and accessible to the logged-in user, enhancing privacy and security while eliminating the need for a separate service.

## Releases

**Version 1.5 (2024-11-14)**

- **New Features:**
  - extended timeout to allow for slower connections and server congestions (from 10 seconds to 60 seconds)

**Version 1.4 (2024-10-20)**

- **New Features:**
  - Added support for extracting data from the "Area Troop Members," "Area Leaders," and "Troop Status" pages.
  - Implemented advanced filtering and sorting functionality within the extension's popup.
  - Introduced the ability to download extracted data as a CSV file directly from the extension's popup.
  - Enhanced user interface with a modal dialog to guide users when they are not on the correct page.

**Version 1.1 (2023-07-10)**

- Added alternating color scheme in the table for better readability.
- Introduced filter functionality on each column header.
- Implemented a sort function on each column header.

**Version 1.0 (2023-06-08)**

The initial release focused on presenting a simplified view of data from the "All Member Search" page. It enabled users to apply filters on the page, extract the filtered data, view it in a simplified table format, and download it as a CSV file via the extension's popup page.

## Installation

To install the TLC Regional Report Viewer:

1. **Access the Extension:**
   - Navigate to the Google Chrome Web Store using this link: [TLC Regional Report Viewer Extension](https://chromewebstore.google.com/detail/tlc-regional-report-viewe/iipjolkbefloigjhmikgkpjliemaploj).
   - *Note: If the extension is not published globally and is only accessible through a provided link, ensure you have the correct link or instructions to install the extension locally.*

2. **Install the Extension:**
   - Click on the **“Add to Chrome”** button to install the extension.
   - Confirm any prompts that appear to complete the installation.

## Usage

After installation, you can use the extension to extract data from the following pages:

### **Extracting Troop Members Data**

1. **Navigate to the Page:**
   - Go to the "Area Troop Members" page at `https://www.traillifeconnect.com/user/area-troop-members`.

2. **Apply Filters:**
   - Use the page's filtering options to refine your search results.
   - **Suggestion:** Set the filter **Youth = No** to exclude youth members.

3. **Display All Records:**
   - Ensure all desired records are on one page by clicking the **"Show All Data"** button.

4. **Use the Extension:**
   - Click on the extension's icon in the Chrome toolbar.
   - Click the **"Load Troop Members"** button in the extension's popup.
   - If you are not on the correct page, a modal will appear with instructions.

5. **Interact with Data:**
   - View the extracted data in a user-friendly table.
   - Utilize the filter inputs and sort selectors on each column header.
   - Download the data as a CSV file by clicking the **"Download CSV"** button.

### **Extracting Area Leaders Data**

1. **Navigate to the Page:**
   - Go to the "Area Leaders" page at `https://www.traillifeconnect.com/user/leaders`.

2. **Display All Records:**
   - Click the **"Show All Data"** button to display all records on one page.

3. **Use the Extension:**
   - Click on the extension's icon in the Chrome toolbar.
   - Click the **"Load Area Leaders"** button.

4. **Interact with Data:**
   - View, filter, and sort the data within the popup.
   - Download the data as a CSV file if needed.

### **Extracting Regional Troop Data**

1. **Navigate to the Page:**
   - Go to the "Troop Status" page at `https://www.traillifeconnect.com/troops/status`.

2. **Display All Records:**
   - Click the **"Show All Data"** button to ensure all records are visible.

3. **Use the Extension:**
   - Click on the extension's icon in the Chrome toolbar.
   - Click the **"Load Regional Troop Data"** button.

4. **Interact with Data:**
   - Analyze the data with filtering and sorting options.
   - Download the data by clicking the **"Download CSV"** button.

### **General Notes**

- **Modal Dialog:** If you attempt to load data without being on the correct page, a modal dialog will provide instructions on how to navigate to the appropriate page.
- **Data Privacy:** All data extracted is only accessible to you as the logged-in user. The extension does not store or transmit any personal data.

## Contributing

We welcome contributions from the community to improve and enhance the TLC Regional Report Viewer. If you're interested in contributing, please follow these steps:

1. **Fork the Repository:**
   - Visit the GitHub repository at [https://github.com/beingben/tlc-regional-report-extension](https://github.com/beingben/tlc-regional-report-extension).
   - Click the **"Fork"** button to create your own copy of the project.

2. **Make Your Changes:**
   - Clone your forked repository to your local machine.
   - Create a new branch for your changes.
   - Implement the enhancements or fixes you want to contribute.

3. **Commit Your Changes:**
   - Commit your changes to your branch.
   - Ensure your commit messages are clear and descriptive.

4. **Create a Pull Request:**
   - Push your changes to your fork on GitHub.
   - Open a pull request against the main repository.
   - In your pull request description, explain your changes and how they enhance the functionality of the extension.

5. **Issue Reporting:**
   - If you encounter any issues or have suggestions for improvement, please use the GitHub Issues page at [https://github.com/beingben/tlc-regional-report-extension/issues](https://github.com/beingben/tlc-regional-report-extension/issues) to report them.
   - This helps us track and manage requests and bugs effectively.

Your contributions, whether they're code improvements, bug fixes, or feature requests, are greatly appreciated and help make the TLC Regional Report Viewer better for everyone. Thank you for your support and collaboration!

## License

This extension is licensed under the [MIT License](LICENSE.md).

---

**Note:** Ensure that you have the necessary permissions and access rights when using the extension, especially when handling sensitive data. Always comply with the website's terms of service and privacy policies.

If you have any questions or need further assistance, feel free to reach out through the GitHub repository's issue tracker.
