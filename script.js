// Initialize a global variable to hold the Dynamsoft Web Twain instance
let DWObject;

Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", Dynamsoft_OnReady);

function Dynamsoft_OnReady() {
  // Get the Web Twain instance
  DWObject = Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer");
  const thumbnailViewer = DWObject.Viewer.createThumbnailViewer({
    rows: 2,
    columns: 2,
  });

  thumbnailViewer.show();
  availableSources(); // Populate the source dropdown with available sources
}

// Function to populate the source dropdown with available scanner sources
function availableSources() {
  let sourceDropdown = document.getElementById("scanner");
  sourceDropdown.innerHTML = "";

  // Get all available sources and fill the dropdown
  DWObject.IfShowUI = false; // Disable UI for source selection
  DWObject.OpenSourceManager();
  let sourceCount = DWObject.SourceCount;
  for (let i = 0; i < sourceCount; i++) {
    let sourceName = DWObject.GetSourceNameItems(i);
    let option = document.createElement("option");
    option.value = i;
    option.text = sourceName;
    sourceDropdown.add(option);
  }
  DWObject.CloseSourceManager();
}

// Function to toggle the checkbox value
function toggleCheckboxValue(id) {
  let checkbox = document.getElementById(id);
  checkbox.checked == "true" ? "false" : "true";
}

function toggleShowUI() {
  if (DWObject) {
    DWObject.IfShowUI = document.getElementById("showUI").checked;
  }
}

// Function to acquire images based on user input settings
function acquireImage() {
  // Configure settings based on user input
  if (DWObject) {
    DWObject.SelectSourceByIndex(document.getElementById("scanner").value);
    DWObject.IfShowUI = document.getElementById("showUI").checked;
    DWObject.IfShowUI = document.getElementById("showUI").value === "true";
    DWObject.IfAutoFeed =
      document.getElementById("autofeeder").value === "true";
    DWObject.PixelType = document.querySelector(
      'input[name="PixelType"]:checked'
    ).value;
    DWObject.Resolution = parseInt(document.getElementById("resolution").value);
  }

  if (document.getElementById("showUI").checked) {
    if (DWObject) {
      DWObject.SelectSourceAsync()
        .then(function () {
          toggleShowUI(); // Toggle Show UI based on checkbox
          return DWObject.AcquireImageAsync({
            IfCloseSourceAfterAcquire: true,
          });
        })
        .then(function (result) {
          console.log("Image acquired successfully. Result:", result);
        })
        .catch(function (e) {
          console.error("Error acquiring image: " + e.message);
        })
        .finally(function () {
          DWObject.CloseSourceAsync().catch(function (e) {
            console.error(e);
          });
        });
    }
  } else {
    return DWObject.AcquireImageAsync({
      IfCloseSourceAfterAcquire: true,
    })
      .then(function (result) {
        console.log("Image acquired successfully. Result:", result);
      })
      .catch(function (e) {
        console.error("Error acquiring image: " + e.message);
      })
      .finally(function () {
        DWObject.CloseSourceAsync().catch(function (e) {
          console.error(e);
        });
      });
  }
}

// This function gets executed when the save as pdf button is clicked, it saves all images into a multi page pdf on the desired location
function saveasPdf() {
  console.log(DWObject.SaveAllAsPDF);
  DWObject.IfShowFileDialog = true;
  DWObject.SaveAllAsPDF(
    "Sample.pdf",
    function () {
      console.log("Successful!");
    },
    function (errCode, errString) {
      console.log(errString);
    }
  );
}

// This function gets executed when Save as pdf 2 button is clicked and it uses a for loop to create multiple file for each image that is scanned.
function saveIndividualPdf() {
  DWObject.IfShowFileDialog = true;
  console.log(DWObject.HowManyImagesInBuffer);
  if (DWObject.HowManyImagesInBuffer > 0) {
    // Iterate through each scanned image
    for (let i = 0; i < DWObject.HowManyImagesInBuffer; i++) {
      // Acquire the image index
      let imageIndex = i;

      // Create a new PDF file for each image
      //   This path will work when the ifShowFileDialog is false, otherwise file will be saved at the selected location.
      var pdfFilePath = `C:\\Users\\HP\\Desktop\\dynamsoft_assesment\\dynamsoft\\iteration2\\${
        i + 1
      }.pdf`;

      // Save the current image as PDF
      console.log(
        DWObject.SaveAsPDF(
          pdfFilePath,
          imageIndex,
          function () {
            console.log("success:", pdfFilePath);
          },
          function (code, string) {
            console.log(code, string);
          }
        )
      );
    }
    console.log("Done");
  } else {
    console.log("No Scanned Images");
  }
}

// This function removes the selected page although its task is to remove only blank pages.
function removeSelectedImages() {
  if (DWObject) {
    // Remove selected images from the viewer
    DWObject.RemoveAllSelectedImages();
    console.log("selected images removed.");
  }
}

// This function removes all the scanned images.
function removeAllImages() {
  if (DWObject) {
    // Remove all images from the viewer
    DWObject.RemoveAllImages();
    console.log("All images removed.");
  }
}
