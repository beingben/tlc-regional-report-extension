# Chrome Extension for Data Extraction

This Chrome extension is designed to extract data from specific web pages. It listens for a specific message from the popup, and when it receives this message, it performs the following actions:

1. Checks if a specific link is present on the page. If the link is present, it clicks the link.
2. Waits for a table on the page to load.
3. Extracts data from the table. The data includes the name, role, troop name, and troop city from each row of the table.
4. Sends the extracted data back to the popup in the response to the message.

## Installation

1. Download or clone this repository to your local machine.
2. Open the Chrome browser and navigate to `chrome://extensions`.
3. Enable Developer mode by ticking the checkbox in the upper-right corner.
4. Click on the "Load unpacked extension" button.
5. Navigate to the directory where you saved this repository and click "OK".

## Usage

After installing the extension, navigate to a web page from which you want to extract data. Click on the extension's icon in the Chrome toolbar and follow the instructions in the popup.

## License

This extension is licensed under the [MIT License](LICENSE).