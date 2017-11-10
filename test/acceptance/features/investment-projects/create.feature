@investment-projects-create
Feature: Create a new Investment project
  As an existing user
  I would like to create a new Investment project

  @investment-projects-create--verify-add
  Scenario: Verify Add Investment project option

    Given I navigate to Investments page of any company
    When I verify an option to add a new Investment project

  @investment-projects-create--foreign-equity
  Scenario: Create a new Investment project as a source of foreign equity investment

    Given I create a new Investment project as a source of foreign equity investment
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "FDI, Acquisition"

  @investment-projects-create--no-optional-fields
  Scenario: Create a new Investment project as a source of foreign equity investment

    Given I create a new Investment project without optional fields
    Then I see the success message
    And I verify my newly created Investment project in company profile

  @investment-projects-create--different-client-relation-manager @ignore
  Scenario: Create a new Investment project with a different client relation manager

    Given I create a new Investment project with a different client relation manager
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager details shown under Project team

  @investment-projects-create--different-referral-source-adviser @ignore
  Scenario: Create a new Investment project with a different referral source adviser

    Given I create a new Investment project with a different referral source adviser
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the referral source adviser details shown under Project team

  @investment-projects-create--different-client-referral-contacts @ignore
  Scenario: Create a new Investment project with different client relation manager and referral source adviser

    Given I create a new Investment project with different client relation manager and referral source adviser
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify the client relation manager and referral source adviser details shown under Project team

  @investment-projects-create--FDItype
  Scenario: Create a new Investment project with FDI as Investment type

    Given I create a new Investment project with FDI as Investment type
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "FDI, Acquisition"

  @investment-projects-create--non-FDItype
  Scenario: Create a new Investment project with Non-FDI as Investment type

    Given I create a new Investment project with Non-FDI as Investment type
    Then I see the success message
    And I verify my newly created Investment project in company profile
    And I verify Type of Investment is shown as "Non-FDI"

  @investment-projects-create--non-foreign-equity @ignore
  Scenario: Create a new Investment project as not a source of foreign equity investment

    Given I create a new Investment project as not a source of foreign equity investment
    Then I see the success message
    And I verify my newly created foreign equity Investment project in company profile

  @investment-search-FDItype
  Scenario: Search for newly created FDI Investment project

    Given I create a new Investment project with FDI as Investment type
    Then I see the success message
    When I search for my newly created Investment project
    Then I verify it is displayed in the search results

  @investment-search-nonFDItype
  Scenario: Search for newly created Non-FDI Investment project

    Given I create a new Investment project with Non-FDI as Investment type
    Then I see the success message
    When I search for my newly created Investment project
    Then I verify it is displayed in the search results

  @investment-search-CTItype @ignore
  Scenario: Search for newly created commitment to invest type Investment project

    Given I create a new Investment project as a source of foreign equity investment
    When I search for my newly created Investment project
    Then I verify it is displayed in the search results
