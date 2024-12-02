Feature: The Internet Guinea Pig Website

  Scenario Outline: As a user, I can log into the secure area

    Given I am on the login page
    When I login with <username> and <password>

    Examples:
      | username | password             | message                        |
      |  user@phptravels.com | demouser | You logged into a secure area! |
