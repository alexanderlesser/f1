const api = require('../api/api')
const mongoose = require('mongoose')
const Driver = require('../models/driver')
const Race = require('../models/race')
const Result = require('../models/result')
const util = require('../utils/helpers')

const checkDrivers = async () => {
  try {
  const response = await api.getDrivers()
  const driversCollection = await response.DriverTable.Drivers.map(driver => {
    return {
      driverId: driver.driverId,
      driverNumber: driver.permanentNumber,
      shortCode: driver.code,
      firstName: driver.givenName,
      lastName: driver.familyName,
      fullName: driver.givenName + ' ' + driver.familyName,
      birthDate: driver.dateOfBirth,
      nationality: driver.nationality,
    }
  })
  const collection = await mongoose.connection.db.collection('drivers').countDocuments()
  console.log('COLLECTION: ', collection);
  if(collection !== 0) {

    driversCollection.map(async (driver) => {
      const exist = await Driver.findOne({driverId: driver.driverId})
      
      if(!exist) {
        const newDriver = await new Driver(driver)
        console.log(newDriver);

        await newDriver.save(newDriver).then(response => {
          console.log('Driver created: ',response);
        })
        .catch(err => {
          console.log('Could not create driver', err);
        })
      }
    })

  } else {
    await Driver.insertMany(driversCollection)
  }
} catch(err) {
  console.log(err);
}
}

const checkRaces = async () => {
  try {
    const response = await api.getRaces()

    const raceCollection = response.RaceTable.Races.map(race => {
      return {
        season: race.season,
        round: race.round,
        name: race.raceName,
        circuit: race.Circuit,
        date: race.date,
        time: race.time,
        passed: util.isInThePast(new Date(race.date))
      }
    })
    
    const collection = await mongoose.connection.db.collection('races').countDocuments()
    if(collection !== 0) {
      console.log('INSIDE COLLECTION');
      raceCollection.map( async (race) => {
        const exist = await Race.findOne({round: parseInt(race.round), season: race.season})
        
        if(!exist) {
          const newRace = await new Race(race)

          newRace.save().then(() => {
            console.log('New race created');
          })
          .catch(err => {
            console.log('Could not create race ',err);
          })
        } else {
          if(!exist.passed && race.passed) {
            exist.passed = true
            await exist.save().then(() => {
              console.log('Updated race ' + exist.name);
            })
            .catch(err => {
              console.log(err);
            })
          }
        }
      })
    } else {
      await Race.insertMany(raceCollection)
    }
  } catch( err ) {
    console.log(err);
  }
}

const checkRaceResults = async () => {
  try {
  const rounds = await Race.find({passed: true})

  const raceResults = await Promise.all(rounds.map(async (race) => {
    const round = race.round
    const raceResponse = await api.getRaceResults(round)
    const qualifyingResponse = await api.getQualifyingResults(round)
    const sprintResponse = await api.getSprintResults(round)
    const raceResult = raceResponse.RaceTable.Races[0]
    const qualifyingResult = qualifyingResponse.RaceTable.Races[0]
    const sprintResult = sprintResponse.RaceTable.Races[0]
    return {
      season: race.season,
      round: race.round,
      name: race.name,
      circuit: race.circuit,
      results: {
        race: {
          result: raceResult.Results,
          date: raceResult.date
        },
        qualifying: {
          result: qualifyingResult.QualifyingResults,
          date: qualifyingResult.date
        },
        sprint: {
          result: sprintResult.length > 0 ? sprintResult.SprintResults : [],
          date: sprintResult.length > 0 ? sprintResult.date : '',
        }
      }
    }
  }))

  // console.log(raceResults);
  const collection = await mongoose.connection.db.collection('races').countDocuments()
  if(collection !== 0) {
    raceResults.map( async (result) => {
      const exist = await Result.findOne({round: parseInt(result.round), season: result.season})
      console.log(exist);
      if(!exist) {
        const newResult = await new Result(result)

        newResult.save().then(() => {
          console.log('New result created');
        })
        .catch(err => {
          console.log('Could not create result ',err);
        })
      }
    })
  } else {
    await Result.insertMany(raceResults)
  }
  
} catch (err) {
  console.log(err);
}
}

const checkConstructors = async () => {
  try {
    const response = await api.getConstructors()
    const constructorsCollection = await response.ConstructorTable.Constructors.map(constructor => {
      return {
        constructorId: constructor.constructorId,
        name: constructor.name,
        nationality: constructor.nationality,
      }


    })
  } catch (err) {
    console.log(err);
  }
}


exports.checkData = async () => {
  console.log('CHECKING DATA');
  // await checkDrivers()
  // await checkRaces()
  // await checkRaceResults()

}