db.getCollection('users')
.find({role: "Physician"})
.forEach(function(user) {
    db.physicians.insert({
        _id: user._id,
        name: user.name,
        department: user.department,
        npi: user.npi,
        email: user.email,
        patientsClinicDelay: [],
        timestamp: user.timestamp
    });
    
    db.users.remove({_id: user._id});
});