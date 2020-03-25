const proxyquire = require('proxyquire');
const sinon = require('sinon');


const should = require('chai').should();
const Reservation = require ('../../../lib/schema/reservation');
//const Reservations = require('../../../lib/reservations');


describe ('Reservations Library',function (){

  const debugStub = function(){
    return sinon.stub();
  }
  let Reservations;

  before(function(){
    Reservations = proxyquire ('../../../lib/reservations',{
      debug : debugStub
  
    });

  });

  // context Reservation 
   context('validate',function (){

    it ('should pass a valid reservation with no optional feilds',function(){
      const New_Reservation = new Reservation(
        {
          party:5,
          name :'Family party',
          date: '2017/06/10',
          time: '06:02 AM',
          email  : 'username@example.com'
        });
        return Reservations.validate(New_Reservation)
        .then(actual => actual.should.deep.equal(New_Reservation))
    });

    it ('should fail an invalid reservation with bad email input',function(){
      const New_Reservation = new Reservation(
        {
          party:5,
          name :'Family party',
          date: '2017/06/10',
          time: '06:02 AM',
          email  : 'username@example.com'
        });
        return Reservations.validate(New_Reservation)
        .catch(error => error.should.be.an('error').and.not.be.null)
    });

  });


  });