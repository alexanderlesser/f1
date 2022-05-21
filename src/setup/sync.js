const api = require('../api/api')
const mongoose = require('mongoose')
const Driver = require('../models/driver')
const Race = require('../models/race')
const Constructor = require('../models/constructor')
const cloudinary = require('./cloudinary')
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
  if(collection !== 0) {

    await driversCollection.reduce(async (memo, driver) => {
      const results = await memo

      const exist = await Driver.findOne({driverId: driver.driverId})

      if(!exist) {
        console.log('Driver does not exist: ', driver.driverId)
        const driverImage = await cloudinary.searchPublic(driver.driverId, 'drivers')
        if(driverImage.total_count > 0) {
          driver.image = {
            id: driverImage.resources[0].asset_id,
            public_id: driverImage.resources[0].public_id,
            folder: driverImage.resources[0].public_id,
            url: driverImage.resources[0].secure_url
          }
        } else {
          const image = await cloudinary.uploadImage(driver.driverId, 'drivers')
          driver.image = {
            id: image.asset_id,
            public_id: image.public_id,
            folder: image.folder,
            url: image.secure_url
          }
        }

        const newDriver = await new Driver(driver)

        await newDriver.save().then(response => {
          console.log('Driver created: ',response);
        })
        .catch(err => {
          console.log('Could not create driver', err);
        })
      }

      return [...results, driver]
    }, [])
  } else {
    const res = await driversCollection.reduce(async (memo, driver) => {
      const results = await memo

      const driverImage = await cloudinary.searchPublic(driver.driverId, 'drivers')
      if(driverImage.total_count > 0) {
        driver.image = {
          id: driverImage.resources[0].asset_id,
          public_id: driverImage.resources[0].public_id,
          folder: driverImage.resources[0].public_id,
          url: driverImage.resources[0].secure_url
        }
      } else {
        const image = await cloudinary.uploadImage(driver.driverId, 'drivers')
        
          driver.image = {
          id: image.asset_id,
          public_id: image.public_id,
          folder: image.folder,
          url: image.secure_url
        }
      }

      console.log('DRIVER COMPLETE');

      return [...results, driver]
    }, [])

    await Driver.insertMany(res)
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
        color: util.getConstructorHexColor(constructor.constructorId)
      }
    })

    const collection = await mongoose.connection.db.collection('constructors').countDocuments()
    console.log(collection);
    if(collection !== 0) { 
      constructorsCollection.map(async (constructor) => {
        const exist = await Constructor.findOne({constructorId: constructor.constructorId})
        if(!exist) {
          const newConstructor = await new Constructor(constructor)
  
          await newConstructor.save().then(response => {
            console.log('Constructor created: ', response);
          })
          .catch(err => {
            console.log('Could not create constructor', err);
          })
        }
      })
    } else {
      await Constructor.insertMany(constructorsCollection)
    }
  } catch (err) {
    console.log(err);
  }
}


exports.checkData = async () => {
  console.log('CHECKING DATA');
  // await checkDrivers()
  // await checkRaces()
  // await checkRaceResults()
  // await checkConstructors()
}