@contact-documents  @details
Feature: Contact details

  @contact-documents--lep @lep
  Scenario: Navigate to documents as LEP
    When I navigate to the `contacts.documents` page using `contact` `Johnny Cakeman` fixture
    Then I see the 403 error page

  @contact-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `contacts.documents` page using `contact` `Johnny Cakeman` fixture
    Then I see the 403 error page
