@LoginTest
# Feature to test login
Feature: Login PHP Travels
  Scenario Outline: User can log into the secure area
    Given User is on the "login" page
    When User login with <username> and <password>
    Then User is on the dashboard page

    Examples:
      | username | password             | message                        |
      |  user@phptravels.com | demouser | You logged into a secure area! |
