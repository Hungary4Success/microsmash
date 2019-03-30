document.getElementById("connectBtn").onclick = doSerial;

window.daplink.on(DAPLink.EVENT_SERIAL_DATA, function(data) {
    console.log(data);
});

function doSerial(){

    navigator.usb.requestDevice({
        filters: [{vendorId: 0xD28}]
    })
    .then(function(device) {

        // Change Serial button to close
        $("#command-serial").attr("title", "Close the serial connection and go back to the editor");
        $("#command-serial > .roundlabel").text("Close Serial");

        // Empty #repl to remove any previous terminal interfaces
        $("#repl").empty();

        // Connect to device
        window.transport = new WebUSB(device);
        window.daplink = new DAPLink(window.transport);
       

        window.daplink.connect()
        .then( function() {
            return window.daplink.setSerialBaudrate(115200);
        })
        .then( function() {
            return window.daplink.getSerialBaudrate();
        })
        .then(function(baud) {
            window.daplink.startSerialRead(50);
            console.log('Listening at ${baud} baud...');
            
           lib.init(setupHterm);
           
        })
        .catch(function(e) {
             // If micro:bit does not support dapjs
            $("#flashing-overlay-error").show();
            if(e.message === "No valid interfaces found."){
                $("#flashing-overlay-error").html('<div>' + e + '</div><div><a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">Update your micro:bit firmware</a> to make use of this feature!</div><a href="#" onclick="flashErrorClose()">Close</a>');
                return;
            } else if(e.message === "Unable to claim interface.") {
                $("#flashing-overlay-error").html('<div>' + e + '</div><div>Another process is connected to this device.</div><a href="#" onclick="flashErrorClose()">Close</a>');
                return;
            }


            $("#flashing-overlay-error").html('<div>' + e + '</div><div>Please restart your micro:bit and try again</div><a href="#" onclick="flashErrorClose()">Close</a>');
        });
    });
}