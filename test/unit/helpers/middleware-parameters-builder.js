const paths = require('../../../src/apps/investments/paths')

module.exports = ({
  reqMock = {},
  resMock = {},
  requestBody,
  requestParams = {},
  requestQuery = {},
  requestPath,
  requestHeaders = { host: 'localhost:3000' },
  CURRENT_PATH = '',
  breadcrumb = sinon.stub().returnsThis(),
  title = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  interactions,
  order,
  investment,
  features = {},
  userAgent = { isIE: false },
  user,
  locals = {},
} = {}) => {
  return {
    reqMock: {
      ...reqMock,
      session: {
        token: '1234',
      },
      body: requestBody,
      params: requestParams,
      query: requestQuery,
      path: requestPath,
      headers: requestHeaders,
      flash: sinon.spy(),
    },
    resMock: {
      ...resMock,
      breadcrumb,
      title,
      render: sinon.stub(),
      redirect: sinon.spy(),
      json: sinon.spy(),
      send: sinon.spy(),
      status: sinon.stub().returnsThis(),
      header: sinon.spy(),
      locals: {
        CURRENT_PATH,
        paths,
        company,
        contact,
        interaction,
        interactions,
        order,
        investment,
        features,
        userAgent,
        user,
        csrfToken: 'csrf',
        ...locals,
      },
    },
    nextSpy: sinon.spy(),
  }
}
