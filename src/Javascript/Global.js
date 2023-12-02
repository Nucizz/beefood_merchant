export const LINK = "https://beefood.com/"

export const CAMPUS_LOCATION = [
    { campus: "Kemanggisan Angggrek", location: ["Kantin Payung", "Kantin Basement", "Foodcourt Lt.1", "Foodcourt Lt.5"] },
    { campus: "Kemanggisan Syahdan", location: ["Deret Creative Space"] },
    { campus: "Kemanggisan Kijang", location: ["Kantin Belakang"] },
]

export const validatePhoneNumber = (input) => {
    var lastInput = input;
    var regExpPhone = /^\+62[0-9]*$/;

    if(!input.startsWith("+62")) {
        input = (input.length < 3) ? "+62" : ("+62" + input);
    } else if(!regExpPhone.test(input)) {
        input = lastInput.slice(0, -1)
    }
    return input;
}

export const timeConverter = (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000)
    const hour = ('0' + a.getHours()).slice(-2)
    const min = ('0' + a.getMinutes()).slice(-2)
    const sec = ('0' + a.getSeconds()).slice(-2)
    return hour + ':' + min + ':' + sec
}