/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    if (params.challenge) {
      return { body: { challenge: params.challenge } }
    }

    // check for missing request input parameters and headers
    const requiredParams = []
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // replace this with the api you want to access
    const apiEndpoint = 'https://insights-collector.newrelic.com/v1/accounts/3848902/events'

    // const eventDetail = params.event['activitystreams:object']

    const body = {
      "eventType":"Purchase",
      "name": "Rohan",
      "gender":"male",
      "email":"test12@gmail.com",
      "status":"200",
      "magento_id":201
    }

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
        'Api-Key':'cf711e114a73659b2569df3499ed9a351e79NRAL'
      },
      body: JSON.stringify(body),
    })
    
    const content = await res.json()
    const response = {
      statusCode: 200,
      body: content
    }
    
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error'+error, logger)
  }
}

exports.main = main
