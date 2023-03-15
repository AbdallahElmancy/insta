const roles = {
    Admin:"admin",
    User:"user",
    HR:"HR"
}
const endPoints = {
    Profile:[roles.Admin,roles.User],
    updateName:[roles.HR]
}
module.exports = endPoints