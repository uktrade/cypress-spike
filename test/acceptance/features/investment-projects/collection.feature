@investment-projects-collection  @collection
Feature: View a list of Investment Projects
  As an Data hub user
  I would like to view a list of Investment Projects
  So I can search for Investment Projects and filter and sort the results

  @investment-projects-collection--view
  Scenario: View Investment Projects list

    Given I navigate to company fixture Lambda plc
    When I click the Investment local nav link
    And I click the "Add investment project" link
    Then I am taken to the "Add investment project" page
    When I select FDI as the Investment project type
    And I choose Yes for "Will this company be the source of foreign equity investment?"
    And I populate the create Investment Project form
    Then I see the success message
    And the investment project local header is displayed
      | key           | value            | formatter              |
      | Status        | Ongoing - change |                        |
      | Project code  |                  | isProjectCodeFormatter |
      | Valuation     | Not yet valued   |                        |
      | Created on    |                  | isRecentDateFormatter  |
    And the Investment project summary details are displayed
      | key                           | value                                         |
      | Client                        | investmentProject.equitySource.name           |
      | Type of investment            | investmentProject.typeAndSubType              |
      | Primary sector                | investmentProject.primarySector               |
      | Business activity             | investmentProject.businessActivities          |
      | Client contacts               | investmentProject.clientContact               |
      | Project description           | investmentProject.description                 |
      | Anonymised description        | investmentProject.anonymousDescription        |
      | Estimated land date           | investmentProject.estimatedLandDate           |
      | New or existing investor      | investmentProject.investorType                |
      | Level of involvement          | investmentProject.levelOfInvolvement          |
      | Specific investment programme | investmentProject.specificInvestmentProgramme |
    When I navigate to the Investment Projects source of equity investment
    Then I can view the Investment project in the collection
      | text            | expected                            |
      | Investor        | investmentProject.equitySource.name |
      | Sector          | investmentProject.primarySector     |
      | Land date       | investmentProject.estimatedLandDate |
    And the Investment project has badges
      | text            | expected                            |
      | Stage           | investmentProject.stage             |
      | Investment type | investmentProject.type              |
