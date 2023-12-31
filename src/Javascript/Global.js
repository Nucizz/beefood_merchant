export const LINK = "https://merchant.beefood.com/";

export const CAMPUS_LOCATION = [
    {
        campus: "Kemanggisan Anggrek",
        location: [
            "Kantin Payung",
            "Kantin Basement",
            "Foodcourt Lt.1",
            "Foodcourt Lt.5",
        ],
    },
    { campus: "Kemanggisan Syahdan", location: ["Deret Creative Space"] },
    { campus: "Kemanggisan Kijang", location: ["Kantin Belakang"] },
];

export const validatePhoneNumber = (input) => {
    var lastInput = input;
    var regExpPhone = /^\+62[0-9]*$/;

    if (!input.startsWith("+62")) {
        input = input.length < 3 ? "+62" : "+62" + input;
    } else if (!regExpPhone.test(input)) {
        input = lastInput.slice(0, -1);
    }
    return input;
};

export const validatePrice = (input) => {
    var lastInput = input;
    var regExpPrice = /^Rp [0-9]*$/;

    if (!input.startsWith("Rp ")) {
        input = input.length < 3 ? "Rp " : "Rp " + input;
    } else if (!regExpPrice.test(input)) {
        input = lastInput.slice(0, -1);
    }
    return input;
};

export const timeConverter = (UNIX_timestamp) => {
    const a = new Date(UNIX_timestamp * 1000);
    const hour = ("0" + a.getHours()).slice(-2);
    const min = ("0" + a.getMinutes()).slice(-2);
    const sec = ("0" + a.getSeconds()).slice(-2);
    return hour + ":" + min + ":" + sec;
};

export const moneyConverter = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    const formattedMoney = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(roundedValue);
    return formattedMoney;
};

export const statusConverter = (index) => {
    switch (index) {
        case 1:
            return "Need Confirmation";
        case 2:
            return "Need Processing";
        case 3:
            return "Waiting Pickup";
        case 4:
            return "Finished";
        case -1:
            return "Cancelled";
        default:
            return "Undefined";
    }
};

export const statusColorer = (index) => {
    switch (index) {
        case 1:
            return "text-amber-400";
        case 2:
            return "text-amber-600";
        case 3:
            return "text-green-600";
        case 4:
            return "text-blue-500";
        case -1:
            return "text-red-600";
        default:
            return "Undefined";
    }
};
