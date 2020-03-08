
/**
 * Setup custom menu for the sheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DCM Functions')

      .addItem('Setup Sheets', 'setupTabs')
      .addSeparator()
      .addItem('Get Placements', 'getAllPlacements')
      .addSeparator()
      .addItem('Bulk Create Campaigns', 'bulkCreateCampaigns')
      .addItem('Bulk Create Placements', 'bulkCreatePlacements')
      .addItem('Bulk Assign Ads', 'bulkAssignAds')
      .addToUi();
}



/**
 * Use DCM API to get a list of all placements from the specified campaign, print it out on the sheet
 */
function getAllPlacements() {
  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();
  var placementsList = DoubleClickCampaigns.Placements
                                           .list(profile_id, {
                                            'campaignIds' : campaign_id,
                                             'archived' : false
                                           }).placements;

  var sheet = _setupAssignAdsSheet();

  for (var i = 0; i < placementsList.length; ++i) {
    var currentObject = placementsList[i];
    var rowNum = i+2;
    
    sheet.getRange("A" + rowNum).setNumberFormat('@')
         .setValue(currentObject.siteId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum).setNumberFormat('@')
         .setValue(currentObject.keyName).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@')
         .setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum)
         .setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("E" + rowNum)
         .setValue(currentObject.size.width + 'x' + currentObject.size.height).setBackground(AUTO_POP_CELL_COLOR);

  }


  SpreadsheetApp.getUi().alert('Finished getting Placements!');
  
}






/**
 * Read campaign information from sheet and use DCM API to bulk insert them
 * in DCM 
 */
function bulkCreateCampaigns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_CREATE_CAMPAIGNS);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var advertiser_id = currentPlacement[0]; 
    var campaign_name = currentPlacement[1]; 
    var lp_name = currentPlacement[2]; 
    var lp_url = currentPlacement[3]; 
    var lp_id = currentPlacement[4]; 
    var campaign_start = currentPlacement[5];
    var campaign_end = currentPlacement[6];

    var campaign_resource = {
        "name": campaign_name,
        "advertiserId" : advertiser_id,
        "startDate": campaign_start,
        "endDate" : campaign_end,
        "defaultLandingPageId" : lp_id
      };

    
    var lp_resource = {
      "advertiserId": advertiser_id,
      "name": lp_name,
      "url": lp_url
    };
      
    var newLP = DoubleClickCampaigns.AdvertiserLandingPages
                                   .insert(lp_resource, profile_id);
    
    
     var campaign_resource = {
        "name": campaign_name,
        "advertiserId" : advertiser_id,
        "startDate": campaign_start,
        "endDate" : campaign_end,
        "defaultLandingPageId" : newLP.id
      };

    
    var newCampaign = DoubleClickCampaigns.Campaigns
                                          .insert(campaign_resource, profile_id);
    
    sheet.getRange("H" + currentRow)
         .setValue(newCampaign.id).setBackground(AUTO_POP_CELL_COLOR);
    
     sheet.getRange("E" + currentRow)
         .setValue(newLP.id).setBackground(AUTO_POP_CELL_COLOR);
    
      } 
  SpreadsheetApp.getUi().alert('Finished creating Campaigns!');
  }





/**
 * CREATE PLACMENTS
 * Read placement information from sheet and use DCM API to bulk insert them
 * in the DCM campaign
 */
function bulkCreatePlacements() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_CREATE_PLACEMENT);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var site_id = currentPlacement[0];
    var placement_name = currentPlacement[2]; 
    var placement_start = currentPlacement[4];
    var placement_end = currentPlacement[5];
    var placement_type = currentPlacement[6];
    var placement_cost_type = currentPlacement[7];
    var placement_cost_units = currentPlacement[8];
    var placement_cost_rate = currentPlacement[9];
    var width = currentPlacement[3].substr(0, currentPlacement[3].indexOf('x'));
    var height = currentPlacement[3].split('x').pop();
    var pricing_type;
    var pricing_rate;

    var pricing_rate = placement_cost_rate*1000000000;


        if (placement_cost_type == "CPA") {
        pricing_type = "PRICING_TYPE_CPA";
    }
        if (placement_cost_type == "CPC") {
        pricing_type = "PRICING_TYPE_CPC";
    }
        if (placement_cost_type == "CPM") {
        pricing_type = "PRICING_TYPE_CPM";
    }
        if (placement_cost_type == "CPM_ACTIVEVIEW") {
        pricing_type = "PRICING_TYPE_CPM_ACTIVEVIEW";
    }
        if (placement_cost_type == "FLAT_RATE_CLICKS") {
        pricing_type = "PRICING_TYPE_FLAT_RATE_CLICKS";
    }
        if (placement_cost_type == "FLAT_RATE_IMPRESSIONS") {
        pricing_type = "PRICING_TYPE_FLAT_RATE_IMPRESSIONS";
    }


   var placementResource = {
        "siteId": site_id,
        "campaignId" : campaign_id,
        "name": placement_name,
        "size": {
          "height": height,
          "width": width
        },
        "compatibility": placement_type,
        "pricingSchedule": {
          "startDate": placement_start,
          "endDate": placement_end,
          "pricingType": pricing_type,
          "capCostOption" : "CAP_COST_CUMULATIVE",
          "pricingPeriods" : [{
          
              "startDate": placement_start,
              "endDate": placement_end,
              "units": placement_cost_units,
              "rateOrCostNanos": pricing_rate

          }
      ],
        },
        "paymentSource": "PLACEMENT_AGENCY_PAID",
        "tagFormats": [
          "PLACEMENT_TAG_IFRAME_JAVASCRIPT",
          "PLACEMENT_TAG_JAVASCRIPT",
          "PLACEMENT_TAG_STANDARD",
          "PLACEMENT_TAG_TRACKING",
          "PLACEMENT_TAG_INTERNAL_REDIRECT"
        ]
    };



    var newPlacement = DoubleClickCampaigns.Placements
                                           .insert(placementResource,
                                                    profile_id);
    
    sheet.getRange("K" + currentRow)
         .setValue(newPlacement.id).setBackground(AUTO_POP_CELL_COLOR);

    sheet.getRange("B" + currentRow)
         .setValue(newPlacement.keyName).setBackground(AUTO_POP_CELL_COLOR);


  }
  
   SpreadsheetApp.getUi().alert('Finished creating Placements!');
}









/**
 * BulkAssing Creatives
 **/
function bulkAssignAds() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(BULK_ASSIGN_ADS);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();
  const campaign_id = _fetchCampaignId();

  
  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentPlacement = values[i];
    var placement_id = currentPlacement[2];
    var ad_name = currentPlacement[6];
    var ad_url = currentPlacement[7];
    var ad_dynamic = currentPlacement[8];
    var date_time = new Date();
    var startDateIso = date_time.toISOString();
    
    var endDate = DoubleClickCampaigns.Placements
                                        .get(profile_id, placement_id).pricingSchedule.endDate;

    
    var endDateIso = endDate+'T04:00:00Z';
    
    //var placement_type = placement_type_now;
    //var placement_type_now;
    
    
       if (ad_dynamic == true) {
        ad_active = true;
    } else {
        ad_active = false;
    }
 
    var AdInsertion = {
        "campaignId" : campaign_id,
        "startTime" : startDateIso,
        "endTime" : endDateIso,
        "type" : "AD_SERVING_CLICK_TRACKER",
        "name" : ad_name,
        "dynamicClickTracker" : ad_dynamic,
         "active" : ad_active,

        "placementAssignments" : [{
          "placementId" : placement_id,
          "active" : "true"
        }],
        "clickThroughUrl": {
          "customClickThroughUrl": ad_url
  },
        }
 


    var newAds = DoubleClickCampaigns.Ads
                                        .insert(AdInsertion,
                                                    profile_id);
    
    sheet.getRange("F" + currentRow)
         .setValue(newAds.id).setBackground(AUTO_POP_CELL_COLOR);  

  }
  
     SpreadsheetApp.getUi().alert('Finished assigning Ads!');
}



