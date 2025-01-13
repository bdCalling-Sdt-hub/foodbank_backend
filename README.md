-----------Food Bank Dashboard APIs End point--------------

## Users/owner

### User/owner create APIs

-/api/v1/user/create-user/

- firstName
- lastName
- email
- contactNo
- password
- role (super admin, admin)
- profilePicture

## Event

### Event create APIs

-/api/v1/event/create-event/

- eventName
- eventType
- location
- deliveryDriver
- warehouseVolunteer
- dayOfEvent
- startOfEvent
- endOfEvent
- deliveryCount
- warehouseVolunteerCount

### Client create APIs

-/api/v1/client/create-client/

- firstName
- lastName
- holocaustSurvivor
- dateOfBirth
- phoneNo
- alternativePhoneNo
- address
- apartment
- city
- state
- zipCode
- PeopleHousehold
- badgeNumber
- dietaryRestrictions
- deliveryInstructions
- clientDeliveryGroup

### Create client APIs

-/api/v1/client-group/create-client-group/

- clientGroupName
- addClient (list) Array[]

### Create volunteers APIs

-/api/v1/volunteers/create-volunteers/

- firstName
- lastName
- email
- phoneNo
- address
- volunteerType
- volunteerRole (driver, wire house, both)

### Create volunteer group APIs

-/api/v1/volunteer-group/create-volunteer-group/

- volunteerGroupName
- volunteersTypeList (list)
- volunteers
