const GlobalVariables = {};

// Fungsi untuk mendapatkan atau menambahkan variabel
function setVariable(key, value) {
    if (GlobalVariables[key] === undefined) {
        console.log(`Adding new variable: ${key}`);
    } else {
        console.log(`Variable already exists, updating: ${key}`);
    }
    GlobalVariables[key] = value; // Menimpa nilai variabel
}


function getVariable(key) {
    return GlobalVariables[key];
}

module.exports = {
    setVariable,
    getVariable,
};
