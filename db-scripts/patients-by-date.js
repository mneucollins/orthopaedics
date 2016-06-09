db.patients.find({
    apptTime: {$gt: ISODate("2016-03-22T00:00:00.000-05:00")}, 
    physician: ObjectId("55074bc22cb065f6448be776")
})
.sort({apptTime: 1})
.forEach(function(patient){
        print(patient.firstName + " " + patient.lastName + " -- " + patient.apptTime);
        
    })