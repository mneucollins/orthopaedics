
module.exports = {
    syncPatient: syncPatient
};

function syncPatient (patient, io) {
    io.sockets.emit('syncPatient', patient);
}
