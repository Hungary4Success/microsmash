document.getElementById("connectBtn").addEventListener("click", connect);

const { DAPLink } = DAPjs;

export default async function connect() {
  const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xD28 }] });
  const usbDevice = new DAPjs.WebUSB(device);
  const currentDAPLink = new DAPLink(usbDevice);

  await currentDAPLink.connect();
  await currentDAPLink.setSerialBaudrate(115200);
  await currentDAPLink.getSerialBaudrate();
  await currentDAPLink.startSerialRead(50);

  currentDAPLink.on(DAPLink.EVENT_SERIAL_DATA, (data) => {
    console.log(data);
  });
}
