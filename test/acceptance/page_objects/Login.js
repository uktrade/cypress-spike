module.exports = {
  url: `${process.env.QA_HOST}/sign-in`,
  props: {
    email: process.env.QA_USER_EMAIL,
    password: process.env.QA_USER_PASSWORD,
  },
  elements: {
    form: 'form',
    signOutButton: {
      selector: '//a[contains(@href, "sign-out")]',
      locateStrategy: 'xpath',
    },
    flashMessage: '.flash-message',
    usernameField: '#field-username',
    passwordField: '#field-password',
    searchBar: '#field-term',
    breadcrumbHome: '.c-breadcrumb li:nth-child(1) a',
  },
  commands: [
    {
      enterCredentials () {
        return this.waitForElementVisible('@form', 1000)
          .setValue('@usernameField', this.props.email)
          .setValue('@passwordField', this.props.password)
      },

      logIn () {
        return this.enterCredentials()
          .submitForm('@form')
          .waitForElementVisible('@searchBar', 1000)
      },
    },
  ],
}
