const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const should = require('chai').should();
const Reservation = require ('../../../lib/schema/reservation');
const db = require('sqlite');

describe ('Reservation Schema',function () {

  // context Reservation 
  context('Date & Time Combination',function (){
    it ('should return and Iso 1908 date and time when given a valid input',function(){
      const date = '2017/06/10';
      const time = '06:02 AM';
      Reservation.combineDateTime(date,time).should.equal('2017-06-10T06:02:00.000Z');
    });

    it ('should return null when given an invalid  date or time input',function(){
      const date = 'asad';
      const time = 'ZM';
      should.not.exist(Reservation.combineDateTime(date,time));
    });
  });

   // context Validation
   context('Validator',function(){
     it('should pass a valid reservation -- no optional feilds provided',function(done){
      const New_Reservation = new Reservation(
        {
          party:5,
          name :'Family party',
          date: '2017/06/10',
          time: '06:02 AM',
          email  : 'username@example.com'
        }
      )
      New_Reservation.validator(function(error,value)
      {
        value.should.deep.equal(New_Reservation);
        done(error);
      });

     });

     it('should fail a reservation -- given invalid email ',function(done){
      const New_Reservation = new Reservation(
        {
          party:5,
          name :'Family party',
          date: '2017/06/10',
          time: '06:02 AM',
          email  : 'username'
        }
      )
      New_Reservation.validator(function(error,value)
      {
        error.should.be.an('error')
        .and.not.be.null;
        done();
      });

     });

   });

   //  context  create
context ('Create',function(){
  let dbstub;
  let validateSpy;

before(function(){
dbstub = sinon.stub(db,'run').resolves({
    stmt:{
      lastID : 1349
    }
  });

  const debugStub = function(){
    return sinon.stub();
  }
  reservations = proxyquire('../../../lib/reservations.js',{
    debug : debugStub,
    sqlite : dbstub
  });

});

after(function(){
  dbstub.restore();
});


it ('should return the created reservation ID from DB', function(done){
  const New_Reservation = new Reservation(
    {
      party:5,
      name :'Family party',
      date: '2017/06/10',
      time: '06:02 AM',
      email  : 'username@gmail.com'
    }
  );

  reservations.create(New_Reservation)
  .then(lastID =>{
    lastID.should.deep.equal(1349);
    done();
  })
  .catch(error=>done(error));
  
});

it('should call the validator with a transformed validation once', function(done){

  const New_Reservation = new Reservation({
      date: '2017/06/10',
      time: '06:02 AM',
      email: 'username@gmail.com',
      message: undefined,
      name: 'Family party',
      party: 5,
      phone: undefined
    }
  );
  validateSpy = sinon.spy(reservations,'validate');
  reservations.create(New_Reservation)
  .then(()=>{
    validateSpy.should.have.been.calledOnce.and.have.been.calledWith(new Reservation ({
      date: '2017/06/10',
      time: '06:02 AM',
      email: 'username@gmail.com',
      message: undefined,
      name: 'Family party',
      party: 5,
      phone: undefined
    })
    );

    validateSpy.restore();
    done();
  })
  .catch(error => done(error));
  
});
});
//DB Save Context
context('DB Save context',function(){

  let dbMock;

before(function(){
dbMock = sinon.mock(db);
});

after(function(){
  dbMock.restore();
});

it('should call db only once when a save operation is called',function(){
  dbMock.expects('run').once();

  const debugStub = function(){
    return sinon.stub();
  }
  reservations = proxyquire('../../../lib/reservations.js',{
    debug : debugStub,
    sqlite : dbMock
  });
  const New_Reservation = {
      date: '2017/06/10',
      time: '06:02 AM',
      email: 'username@gmail.com',
      message: undefined,
      name: 'Family party',
      party: 5,
      phone: undefined
  };
  reservations.save(New_Reservation);
  dbMock.verify();
  
});

});


});