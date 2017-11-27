/**
 * Gets XPath selector for element containing text
 * @param text
 * @param el
 * @param className
 * @param child
 * @returns {{selector: string, locateStrategy: string}}
 */
function getSelectorForElementWithText (text, { el = '//*', className, child } = {}) {
  const classNameContains = className ? ` and contains(@class, "${className}")` : ''

  return {
    selector: `${el}[contains(.,"${text}")${classNameContains}]${child || ''}`,
    locateStrategy: 'xpath',
  }
}

/**
 * Gets XPath selector for button containing text
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getButtonWithText (text) {
  return getSelectorForElementWithText(text, { el: '//*', className: 'button' })
}

/**
 * Gets XPath selector for the value of a details table key value pair
 * @param text
 * @returns {{selector: string, locateStrategy: string}}
 */
function getDetailsTableRowValue (text) {
  return getSelectorForElementWithText(
    text,
    {
      el: '//th',
      child: '/following-sibling::td',
    }
  )
}

module.exports = {
  getSelectorForElementWithText,
  getButtonWithText,
  getDetailsTableRowValue,
}
