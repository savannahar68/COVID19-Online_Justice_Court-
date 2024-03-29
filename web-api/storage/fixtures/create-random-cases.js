const axios = require('axios');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const {
  ContactFactory,
} = require('../../../shared/src/business/entities/contacts/ContactFactory');
const {
  TrialSession,
} = require('../../../shared/src/business/entities/trialSessions/TrialSession');
const { Case } = require('../../../shared/src/business/entities/cases/Case');
const { userMap } = require('../../../shared/src/test/mockUserTokenMap');

const USAGE = `
Used for creating cases with random data locally

Usage: node create-random-cases.js [num-to-create]
`;

const numToCreate = process.argv[2];

const main = () => {
  const userName = 'petitioner';
  const user = {
    ...userMap[userName],
    sub: userMap[userName].userId,
  };
  const jwtToken = jwt.sign(user, 'secret');

  if (!jwtToken || !numToCreate) {
    console.log(USAGE);
    return;
  }
  console.log(`creating ${numToCreate} cases`);

  const authToken = `Bearer ${jwtToken}`;
  const petitionFileId = '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c';
  const stinFileId = '2da6d239-555a-40e8-af81-1949c8270cd7';

  const instance = axios.create({
    headers: { Authorization: authToken },
  });

  for (let i = 0; i < numToCreate; i++) {
    const preferredTrialCityObject =
      TrialSession.TRIAL_CITIES.ALL[faker.random.number() % 74];

    const preferredTrialCity =
      preferredTrialCityObject.city + ', ' + preferredTrialCityObject.state;

    //create a case
    const randomlyGeneratedData = {
      petitionFileId,
      petitionMetadata: {
        caseType: Case.CASE_TYPES[faker.random.number() % 13],
        contactPrimary: {
          address1: faker.address.streetAddress(),
          city: faker.address.city(),
          countryType: 'domestic',
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          postalCode: faker.address.zipCode(),
          state: faker.address.stateAbbr(),
        },
        contactSecondary: {
          address1: faker.address.streetAddress(),
          city: faker.address.city(),
          countryType: 'domestic',
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          postalCode: faker.address.zipCode(),
          state: faker.address.stateAbbr(),
        },
        countryType: 'domestic',
        filingType: 'Myself and my spouse',
        hasIrsNotice: faker.random.boolean(),
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
        practitioners: [],
        preferredTrialCity,
        procedureType: Case.PROCEDURE_TYPES[faker.random.number() % 2],
      },
      stinFileId,
    };

    instance
      .post('http://localhost:3002/', {
        ...randomlyGeneratedData,
      })
      .then(res => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
      })
      .catch(error => {
        console.error(error);
      });
  }
};

main();
