# **DCM API Click Tracker generation tool**

Google Sheets based tool to perform bulk tasks to DCM accounts using DCM API.

## OVERVIEW

This AppScript-based tool lets you use a Google Sheets to perform bulk tasks including - Bulk Create Campaigns - 
Bulk Create Placements - Bulk Assign Ads. 
Additional helper tasks for these bulk creations include - Get Placements List


It uses DCM APIs to pull and push data to DCM.

The same result could be achieved by manually creating each entities through the
DCM UI, but the tool leverages the APIs and Spreadsheet functionalities to
automate the most manual steps.

In order to use this tool you need to have valid access to the **DoubleClick
Campaign Manager APIs** through your Google Account, and you will need to enable
that API in a Google Cloud Project so that you can generate authenticate the
tool (see the corresponding step of Initial Setup section below).

## INITIAL SETUP

*   Create a new [Google Spreadsheet](https://sheets.google.com) and open its
    script editor (from _Tools > Script Editor_)
    -   Copy the code from code.js and utils.js in two corresponding code.gs,
        utilities.gs files in your AppScript project
    -   Enable DCM API _Resources > Advanced Google Services_ and enable the
        _DCM/DFA Reporting and Trafficking API (v2.8)_
    -   Click on _Google API Console link_ at the bottom of _Advanced Google
        Services_ window to open the Google Cloud Platform project, select
        _Library_ from the left hand menu, then search and enable the DCM API in
        the project
*   Close the script editor and spreadsheet tabs both (this is necessary so the
    custom functions appear)
*   Re-open the Go back to the Spreadsheet, click on the _DCM Functions_ menu
    and select _Setup Sheets_ for the initial tabs and header rows setup (wait
    for the script to finish)
*   Remove any tab not needed (aside from the ones created by script)
*   Input the DCM Profile ID in the setup tab (i.e. at cell C5) then select
    _Data_ from the sheet menu and select _Named Ranges...._ to set the title
    _DCMProfileID_ and value _Setup!C5_
*   Input the Floodlight Config ID in the setup tab (i.e. at cell C6) then select
    _Data_ from the sheet menu and select _Named Ranges...._ to set the title
    _DCMFLoodlightConfigID_ and value _Setup!C6_

## USAGE

*   As general rules
    *   Only manually edit columns with green headers.
    *   Columns with blue headers will be auto-populated.
    *   User Profile ID and Floodlgiht Config DI cells are required to be filled in (Setup tab)
    
*   **Bulk Create Campaigns** allows you to create campaigns in Bulk. 
    1. DCM Functions > Bulk Create Camapigns
    2. Wait for the Script to finish loading
    3. LP (landing page) ID and Campaign ID will be auto populated in column E, H after the Script finished running

*   **Create Placements** allows you to bulk create placements by filling in the required cells under the Green headed columns. 
Profile ID, Advertiser ID and Campaign ID are required!
    1. Fill in the cells under the Green headed columns
    2. Add-ons > DCM API > Bulk Create Placements
    3. Wait for the Script to finish loading
    4. SiteKeyName and Palcement ID will be auto populated in column B, K after the Script finished running


*   **Get Placements** allows you to get the complete list of placements for the specified campaign. Profile ID, Advertiser ID and Campaign ID are required!
    1. Add-ons > DCM API > Get All Placements
    2. Wait for the Script to finish loading
    3. Placement information will be auto populated in column A, B, C, D, E after the Script finished running

*   **Bulk Assign Ads** allows you to Assign ads to placements. Placement information as well as Profile ID, Advertiser ID and Campaign ID are required!
    1. Add-ons > DCM API > Bulk Assign Ads
    2. Wait for the Script to finish loading
    3. Ad ID information will be auto populated in column F after the Script finished running


